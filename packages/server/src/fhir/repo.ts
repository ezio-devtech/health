import {
  badRequest,
  deepEquals,
  DEFAULT_SEARCH_COUNT,
  evalFhirPath,
  Filter,
  forbidden,
  formatSearchQuery,
  getSearchParameterDetails,
  getStatus,
  gone,
  isGone,
  isNotFound,
  isOk,
  notFound,
  Operator as FhirOperator,
  resolveId,
  SearchParameterDetails,
  SearchParameterType,
  SearchRequest,
  SortRule,
  stringify,
  tooManyRequests,
} from '@medplum/core';
import {
  AccessPolicy,
  AccessPolicyResource,
  Bundle,
  BundleEntry,
  BundleLink,
  Login,
  Meta,
  OperationOutcome,
  ProjectMembership,
  Reference,
  Resource,
  SearchParameter,
} from '@medplum/fhirtypes';
import { randomUUID } from 'crypto';
import { applyPatch, JsonPatchError, Operation } from 'fast-json-patch';
import { URL } from 'url';
import validator from 'validator';
import { getConfig } from '../config';
import { getClient } from '../database';
import { logger } from '../logger';
import { getRedis } from '../redis';
import { addBackgroundJobs } from '../workers';
import { addSubscriptionJobs } from '../workers/subscription';
import { AddressTable, ContactPointTable, HumanNameTable, IdentifierTable, LookupTable } from './lookups';
import { getPatientId } from './patient';
import { rewriteAttachments, RewriteMode } from './rewrite';
import { validateResource, validateResourceType } from './schema';
import { parseSearchUrl } from './search';
import {
  Column,
  Condition,
  Conjunction,
  Disjunction,
  Expression,
  InsertQuery,
  Negation,
  Operator,
  SelectQuery,
} from './sql';
import { getSearchParameter, getSearchParameters, getStructureDefinitions } from './structure';

/**
 * The RepositoryContext interface defines standard metadata for repository actions.
 * In practice, there will be one Repository per HTTP request.
 * And the RepositoryContext represents the context of that request,
 * such as "who is the current user?" and "what is the current project?"
 */
export interface RepositoryContext {
  /**
   * The current author reference.
   * This should be a FHIR reference string (i.e., "resourceType/id").
   * Where resource type is ClientApplication, Patient, Practitioner, etc.
   * This value will be included in every resource as meta.author.
   */
  author: Reference;

  /**
   * The current project reference.
   * This should be the ID/UUID of the current project.
   * This value will be included in every resource as meta.project.
   */
  project?: string;

  /**
   * Optional compartment restriction.
   * If the compartments array is provided,
   * all queries will be restricted to those compartments.
   */
  accessPolicy?: AccessPolicy;

  /**
   * Optional flag for system administrators,
   * which grants system-level access.
   */
  superAdmin?: boolean;
}

export interface CacheEntry<T extends Resource> {
  resource: T;
  projectId: string;
  compartments: string[];
}

/**
 * Public resource types are in the "public" project.
 * They are available to all users.
 */
const publicResourceTypes = [
  'CapabilityStatement',
  'CompartmentDefinition',
  'ImplementationGuide',
  'OperationDefinition',
  'SearchParameter',
  'StructureDefinition',
];

/**
 * Protected resource types are in the "medplum" project.
 * Reading and writing is limited to the system account.
 */
const protectedResourceTypes = ['JsonWebKey', 'Login', 'PasswordChangeRequest', 'Project', 'ProjectMembership', 'User'];

/**
 * The lookup tables array includes a list of special tables for search indexing.
 */
const lookupTables: LookupTable<unknown>[] = [
  new AddressTable(),
  new ContactPointTable(),
  new HumanNameTable(),
  new IdentifierTable(),
];

/**
 * Defines the maximum number of resources returned in a single search result.
 */
const maxSearchResults = 1000;

/**
 * The Repository class manages reading and writing to the FHIR repository.
 * It is a thin layer on top of the database.
 * Repository instances should be created per author and project.
 */
export class Repository {
  readonly #context: RepositoryContext;

  constructor(context: RepositoryContext) {
    this.#context = context;
    if (!this.#context.author?.reference) {
      throw new Error('Invalid author reference');
    }
  }

  async createResource<T extends Resource>(resource: T): Promise<T> {
    validateResource(resource);
    return this.#updateResourceImpl(
      {
        ...resource,
        id: randomUUID(),
      },
      true
    );
  }

  async readResource<T extends Resource>(resourceType: string, id: string): Promise<T> {
    if (!id || !validator.isUUID(id)) {
      throw badRequest('Invalid UUID');
    }

    validateResourceType(resourceType);

    if (!this.#canReadResourceType(resourceType)) {
      throw forbidden;
    }

    if (!this.#context.accessPolicy) {
      const cacheRecord = await getCacheEntry<T>(resourceType, id);
      if (cacheRecord) {
        if (
          !this.#isSuperAdmin() &&
          this.#context.project !== undefined &&
          cacheRecord.projectId !== undefined &&
          cacheRecord.projectId !== this.#context.project
        ) {
          throw notFound;
        }
        return this.#removeHiddenFields(cacheRecord.resource);
      }
    }

    const client = getClient();
    const builder = new SelectQuery(resourceType).column('content').column('deleted').where('id', Operator.EQUALS, id);

    this.#addSecurityFilters(builder, resourceType);

    const rows = await builder.execute(client);
    if (rows.length === 0) {
      throw notFound;
    }

    if (rows[0].deleted) {
      throw gone;
    }

    const resource = JSON.parse(rows[0].content as string) as T;
    await setCacheEntry(resource);
    return this.#removeHiddenFields(resource);
  }

  async readReference<T extends Resource>(reference: Reference<T>): Promise<T> {
    const parts = reference.reference?.split('/');
    if (!parts || parts.length !== 2) {
      throw badRequest('Invalid reference');
    }
    return this.readResource(parts[0], parts[1]);
  }

  /**
   * Returns resource history.
   *
   * Results are sorted with oldest versions last
   *
   * See: https://www.hl7.org/fhir/http.html#history
   *
   * @param resourceType The FHIR resource type.
   * @param id The FHIR resource ID.
   * @returns Operation outcome and a history bundle.
   */
  async readHistory<T extends Resource>(resourceType: string, id: string): Promise<Bundle<T>> {
    try {
      await this.readResource<T>(resourceType, id);
    } catch (err) {
      if (!isGone(err as OperationOutcome)) {
        throw err;
      }
    }

    const client = getClient();
    const rows = await new SelectQuery(resourceType + '_History')
      .column('content')
      .where('id', Operator.EQUALS, id)
      .orderBy('lastUpdated', true)
      .limit(100)
      .execute(client);

    const entries: BundleEntry<T>[] = [];

    for (const row of rows) {
      if (row.content) {
        entries.push({
          resource: this.#removeHiddenFields(JSON.parse(row.content as string)),
        });
      } else {
        entries.push({
          response: {
            status: getStatus(gone).toString(),
            outcome: gone,
          },
        });
      }
    }

    return {
      resourceType: 'Bundle',
      type: 'history',
      entry: entries,
    };
  }

  async readVersion<T extends Resource>(resourceType: string, id: string, vid: string): Promise<T> {
    if (!validator.isUUID(vid)) {
      throw badRequest('Invalid UUID');
    }

    await this.readResource<T>(resourceType, id);

    const client = getClient();
    const rows = await new SelectQuery(resourceType + '_History')
      .column('content')
      .where('id', Operator.EQUALS, id)
      .where('versionId', Operator.EQUALS, vid)
      .execute(client);

    if (rows.length === 0) {
      throw notFound;
    }

    return this.#removeHiddenFields(JSON.parse(rows[0].content as string));
  }

  async updateResource<T extends Resource>(resource: T): Promise<T> {
    return this.#updateResourceImpl(resource, false);
  }

  async #updateResourceImpl<T extends Resource>(resource: T, create: boolean): Promise<T> {
    validateResource(resource);

    const { resourceType, id } = resource;
    if (!id) {
      throw badRequest('Missing id');
    }

    if (!this.#canWriteResourceType(resourceType)) {
      throw forbidden;
    }

    const existing = await this.#checkExistingResource<T>(resourceType, id, create);

    if (await this.#isTooManyVersions(resourceType, id, create)) {
      throw tooManyRequests;
    }

    const updated = await rewriteAttachments<T>(RewriteMode.REFERENCE, this, {
      ...this.#restoreReadonlyFields(resource, existing),
      meta: {
        ...existing?.meta,
        ...resource.meta,
      },
    });

    if (await this.#isNotModified(existing, updated)) {
      return existing as T;
    }

    const result: T = {
      ...updated,
      meta: {
        ...updated?.meta,
        versionId: randomUUID(),
        lastUpdated: this.#getLastUpdated(existing, resource),
        author: this.#getAuthor(resource),
      },
    };

    const project = this.#getProjectId(updated);
    if (project) {
      (result.meta as Meta).project = project;
    }

    const account = await this.#getAccount(existing, updated);
    if (account) {
      (result.meta as Meta).account = account;
    }

    await setCacheEntry(result);
    await this.#writeResource(result);
    await this.#writeResourceVersion(result);
    await this.#writeLookupTables(result);
    await addBackgroundJobs(result);
    this.#removeHiddenFields(result);
    return result;
  }

  /**
   * Tries to return the existing resource, if it is available.
   * Handles the following cases:
   *  - Previous version exists
   *  - Previous version was deleted, and user is restoring it
   *  - Previous version does not exist, and user does not have permission to create by ID
   *  - Previous version does not exist, and user does have permission to create by ID
   * @param resourceType The FHIR resource type.
   * @param id The resource ID.
   * @returns The existing resource, if found.
   */
  async #checkExistingResource<T extends Resource>(
    resourceType: string,
    id: string,
    create: boolean
  ): Promise<T | undefined> {
    try {
      return await this.readResource<T>(resourceType, id);
    } catch (err) {
      if (!err || typeof err !== 'object' || !('resourceType' in err)) {
        throw err;
      }

      const existingOutcome = err as OperationOutcome;
      if (!isOk(existingOutcome) && !isNotFound(existingOutcome) && !isGone(existingOutcome)) {
        throw existingOutcome;
      }

      if (!create && isNotFound(existingOutcome) && !this.#canSetId()) {
        throw existingOutcome;
      }

      // Otherwise, it is ok if the resource is not found.
      // This is an "update" operation, and the outcome is "not-found" or "gone",
      // and the current user has permission to create a new version.
      return undefined;
    }
  }

  /**
   * Returns true if the resource has too many versions within the specified time period.
   * @param resourceType The resource type.
   * @param id The resource ID.
   * @param create If true, then the resource is being created.
   * @returns True if the resource has too many versions within the specified time period.
   */
  async #isTooManyVersions(resourceType: string, id: string, create: boolean): Promise<boolean> {
    if (create) {
      return false;
    }
    const seconds = 60;
    const maxVersions = 10;
    const client = getClient();
    const rows = await new SelectQuery(resourceType + '_History')
      .raw(`COUNT (DISTINCT "versionId")::int AS "count"`)
      .where('id', Operator.EQUALS, id)
      .where('lastUpdated', Operator.GREATER_THAN, new Date(Date.now() - 1000 * seconds))
      .execute(client);
    return (rows[0].count as number) >= maxVersions;
  }

  /**
   * Returns true if the resource is not modified from the existing resource.
   * @param existing The existing resource.
   * @param updated The updated resource.
   * @returns True if the resource is not modified.
   */
  async #isNotModified(existing: Resource | undefined, updated: Resource): Promise<boolean> {
    if (!existing) {
      return false;
    }

    // When stricter FHIR validation is enabled, then this can be removed.
    // At present, there are some cases where a server accepts "empty" values that escape the deep equals.
    const cleanExisting = JSON.parse(stringify(existing));
    const cleanUpdated = JSON.parse(stringify(updated));
    return deepEquals(cleanExisting, cleanUpdated);
  }

  /**
   * Reindexes all resources of the specified type.
   * This is only available to the system account.
   * This should not result in any change to resources or history.
   * @param resourceType The resource type.
   */
  async reindexResourceType(resourceType: string): Promise<void> {
    if (!this.#isSuperAdmin()) {
      throw forbidden;
    }

    const client = getClient();
    const builder = new SelectQuery(resourceType).column({ tableName: resourceType, columnName: 'id' });
    this.#addDeletedFilter(builder);

    const rows = await builder.execute(client);
    for (const { id } of rows) {
      await this.reindexResource(resourceType, id);
    }
  }

  /**
   * Reindexes the resource.
   * This is only available to the system and super admin accounts.
   * This should not result in any change to the resource or its history.
   * @param resourceType The resource type.
   * @param id The resource ID.
   */
  async reindexResource<T extends Resource>(resourceType: string, id: string): Promise<T> {
    if (!this.#isSuperAdmin()) {
      throw forbidden;
    }

    const resource = await this.readResource<T>(resourceType, id);
    await this.#writeResource(resource as T);
    await this.#writeLookupTables(resource as T);
    return resource as T;
  }

  /**
   * Resends subscriptions for the resource.
   * This is only available to the system and super admin accounts.
   * This should not result in any change to the resource or its history.
   * @param resourceType The resource type.
   * @param id The resource ID.
   */
  async resendSubscriptions<T extends Resource>(resourceType: string, id: string): Promise<T> {
    if (!this.#isSuperAdmin()) {
      throw forbidden;
    }

    const resource = await this.readResource<T>(resourceType, id);
    await addSubscriptionJobs(resource);
    return resource as T;
  }

  async deleteResource(resourceType: string, id: string): Promise<void> {
    const resource = await this.readResource(resourceType, id);

    if (!this.#canWriteResourceType(resourceType)) {
      throw forbidden;
    }

    await deleteCacheEntry(resourceType, id);

    const client = getClient();
    const lastUpdated = new Date();
    const content = '';
    const columns: Record<string, any> = {
      id,
      lastUpdated,
      deleted: true,
      compartments: this.#getCompartments(resource),
      content,
    };

    await new InsertQuery(resourceType, columns).mergeOnConflict(true).execute(client);

    await new InsertQuery(resourceType + '_History', {
      id,
      versionId: randomUUID(),
      lastUpdated,
      content,
    }).execute(client);

    await this.#deleteFromLookupTables(resource);
  }

  async patchResource(resourceType: string, id: string, patch: Operation[]): Promise<Resource> {
    const resource = await this.readResource(resourceType, id);

    let patchResult;
    try {
      patchResult = applyPatch(resource, patch, true);
    } catch (err) {
      const patchError = err as JsonPatchError;
      const message = patchError.message?.split('\n')?.[0] || 'JSONPatch error';
      throw badRequest(message);
    }

    const patchedResource = patchResult.newDocument;
    return this.updateResource(patchedResource);
  }

  async search<T extends Resource>(searchRequest: SearchRequest): Promise<Bundle<T>> {
    const resourceType = searchRequest.resourceType;
    validateResourceType(resourceType);

    if (!this.#canReadResourceType(resourceType)) {
      throw forbidden;
    }

    let entry = undefined;
    if (searchRequest.count === undefined || searchRequest.count > 0) {
      entry = await this.#getSearchEntries<T>(searchRequest);
    }

    let total = undefined;
    if (searchRequest.total === 'estimate' || searchRequest.total === 'accurate') {
      total = await this.#getTotalCount(searchRequest);
    }

    return {
      resourceType: 'Bundle',
      type: 'searchest',
      entry,
      total,
      link: this.#getSearchLinks(searchRequest),
    };
  }

  /**
   * Returns the bundle entries for a search request.
   * @param searchRequest The search request.
   * @returns The bundle entries for the search result.
   */
  async #getSearchEntries<T extends Resource>(searchRequest: SearchRequest): Promise<BundleEntry<T>[]> {
    const resourceType = searchRequest.resourceType;
    const client = getClient();
    const builder = new SelectQuery(resourceType)
      .column({ tableName: resourceType, columnName: 'id' })
      .column({ tableName: resourceType, columnName: 'content' });

    this.#addDeletedFilter(builder);
    this.#addSecurityFilters(builder, resourceType);
    this.#addSearchFilters(builder, builder.predicate, searchRequest);
    this.#addSortRules(builder, searchRequest);

    builder.limit(Math.min(searchRequest.count || 20, maxSearchResults));
    builder.offset(searchRequest.offset || 0);

    const rows = await builder.execute(client);
    return rows.map((row) => ({
      resource: this.#removeHiddenFields(JSON.parse(row.content as string)),
    }));
  }

  /**
   * Returns the search bundle links for a search request.
   * At minimum, the 'self' link will be returned.
   * If "count" does not equal zero, then 'first', 'next', and 'previous' links will be included.
   * @param searchRequest The search request.
   * @returns The search bundle links.
   */
  #getSearchLinks(searchRequest: SearchRequest): BundleLink[] {
    const result: BundleLink[] = [
      {
        relation: 'self',
        url: this.#getSearchUrl(searchRequest),
      },
    ];

    if (searchRequest.count === undefined || searchRequest.count > 0) {
      const count = searchRequest.count || DEFAULT_SEARCH_COUNT;
      const offset = searchRequest.offset || 0;

      result.push({
        relation: 'first',
        url: this.#getSearchUrl({ ...searchRequest, offset: 0 }),
      });

      result.push({
        relation: 'next',
        url: this.#getSearchUrl({ ...searchRequest, offset: offset + count }),
      });

      if (offset > 0) {
        result.push({
          relation: 'previous',
          url: this.#getSearchUrl({ ...searchRequest, offset: offset - count }),
        });
      }
    }

    return result;
  }

  #getSearchUrl(searchRequest: SearchRequest): string {
    return `${getConfig().baseUrl}fhir/R4/${searchRequest.resourceType}${formatSearchQuery(searchRequest)}`;
  }

  /**
   * Returns the total number of matching results for a search request.
   * This ignores page number and page size.
   * @param searchRequest The search request.
   * @returns The total number of matching results.
   */
  async #getTotalCount(searchRequest: SearchRequest): Promise<number> {
    const client = getClient();
    const builder = new SelectQuery(searchRequest.resourceType).raw(
      `COUNT (DISTINCT "${searchRequest.resourceType}"."id")::int AS "count"`
    );

    this.#addDeletedFilter(builder);
    this.#addSecurityFilters(builder, searchRequest.resourceType);
    this.#addSearchFilters(builder, builder.predicate, searchRequest);
    const rows = await builder.execute(client);
    return rows[0].count as number;
  }

  /**
   * Adds filters to ignore soft-deleted resources.
   * @param builder The select query builder.
   */
  #addDeletedFilter(builder: SelectQuery): void {
    builder.where('deleted', Operator.EQUALS, false);
  }

  /**
   * Adds security filters to the select query.
   * @param builder The select query builder.
   * @param resourceType The resource type for compartments.
   */
  #addSecurityFilters(builder: SelectQuery, resourceType: string): void {
    if (publicResourceTypes.includes(resourceType)) {
      // No compartment restrictions for public resources.
      return;
    }

    if (this.#isSuperAdmin()) {
      // No compartment restrictions for admins.
      return;
    }

    this.#addProjectFilter(builder);
    this.#addAccessPolicyFilters(builder, resourceType);
  }

  /**
   * Adds the "project" filter to the select query.
   * @param builder The select query builder.
   */
  #addProjectFilter(builder: SelectQuery): void {
    if (this.#context.project) {
      builder.where('compartments', Operator.ARRAY_CONTAINS, [this.#context.project], 'UUID[]');
    }
  }

  /**
   * Adds access policy filters to the select query.
   * @param builder The select query builder.
   * @param resourceType The resource type being searched.
   */
  #addAccessPolicyFilters(builder: SelectQuery, resourceType: string): void {
    if (!this.#context.accessPolicy?.resource) {
      return;
    }

    const expressions: Expression[] = [];

    for (const policy of this.#context.accessPolicy.resource) {
      if (policy.resourceType === resourceType) {
        const policyCompartmentId = resolveId(policy.compartment);
        if (policyCompartmentId) {
          // Deprecated - to be removed
          // Add compartment restriction for the access policy.
          expressions.push(new Condition('compartments', Operator.ARRAY_CONTAINS, [policyCompartmentId], 'UUID[]'));
        }

        if (policy.criteria) {
          // Add subquery for access policy criteria.
          const searchRequest = parseSearchUrl(new URL(policy.criteria, 'https://api.medplum.com/'));
          const accessPolicyConjunction = new Conjunction([]);
          this.#addSearchFilters(builder, accessPolicyConjunction, searchRequest);
          expressions.push(accessPolicyConjunction);
        }
      }
    }

    if (expressions.length > 0) {
      builder.predicate.expressions.push(new Disjunction(expressions));
    }
  }

  /**
   * Adds all search filters as "WHERE" clauses to the query builder.
   * @param selectQuery The select query builder.
   * @param predicate The predicate conjunction.
   * @param searchRequest The search request.
   */
  #addSearchFilters(selectQuery: SelectQuery, predicate: Conjunction, searchRequest: SearchRequest): void {
    searchRequest.filters?.forEach((filter) => this.#addSearchFilter(selectQuery, predicate, searchRequest, filter));
  }

  /**
   * Adds a single search filter as "WHERE" clause to the query builder.
   * @param selectQuery The select query builder.
   * @param predicate The predicate conjunction.
   * @param searchRequest The search request.
   * @param filter The search filter.
   */
  #addSearchFilter(
    selectQuery: SelectQuery,
    predicate: Conjunction,
    searchRequest: SearchRequest,
    filter: Filter
  ): void {
    const resourceType = searchRequest.resourceType;

    if (this.#trySpecialSearchParameter(predicate, resourceType, filter)) {
      return;
    }

    const param = getSearchParameter(resourceType, filter.code);
    if (!param || !param.code) {
      return;
    }

    const lookupTable = this.#getLookupTable(param);
    if (lookupTable) {
      lookupTable.addWhere(selectQuery, predicate, filter);
      return;
    }

    const details = getSearchParameterDetails(getStructureDefinitions(), resourceType, param);
    if (filter.operator === FhirOperator.MISSING) {
      predicate.where(details.columnName, filter.value === 'true' ? Operator.EQUALS : Operator.NOT_EQUALS, null);
    } else if (param.type === 'string') {
      this.#addStringSearchFilter(predicate, details, filter);
    } else if (param.type === 'token') {
      this.#addTokenSearchFilter(predicate, resourceType, details, filter);
    } else if (param.type === 'reference') {
      this.#addReferenceSearchFilter(predicate, details, filter);
    } else if (param.type === 'quantity') {
      predicate.where(details.columnName, fhirOperatorToSqlOperator(filter.operator), parseFloat(filter.value));
    } else {
      predicate.where(details.columnName, fhirOperatorToSqlOperator(filter.operator), filter.value);
    }
  }

  /**
   * Returns true if the search parameter code is a special search parameter.
   *
   * See: https://www.hl7.org/fhir/search.html#all
   *
   * @param predicate The predicate conjunction.
   * @param resourceType The resource type.
   * @param filter The search filter.
   * @returns True if the search parameter is a special code.
   */
  #trySpecialSearchParameter(predicate: Conjunction, resourceType: string, filter: Filter): boolean {
    const code = filter.code;
    if (!code.startsWith('_')) {
      return false;
    }

    const op = fhirOperatorToSqlOperator(filter.operator);

    if (code === '_id') {
      this.#addTokenSearchFilter(predicate, resourceType, { columnName: 'id', type: SearchParameterType.TEXT }, filter);
    } else if (code === '_lastUpdated') {
      predicate.where({ tableName: resourceType, columnName: 'lastUpdated' }, op, filter.value);
    } else if (code === '_compartment' || code === '_project') {
      predicate.where('compartments', Operator.ARRAY_CONTAINS, [filter.value], 'UUID[]');
    }

    return true;
  }

  /**
   * Adds a string search filter as "WHERE" clause to the query builder.
   * @param predicate The select query predicate conjunction.
   * @param details The search parameter details.
   * @param filter The search filter.
   */
  #addStringSearchFilter(predicate: Conjunction, details: SearchParameterDetails, filter: Filter): void {
    if (filter.operator === FhirOperator.EXACT) {
      predicate.where(details.columnName, Operator.EQUALS, filter.value);
    } else {
      predicate.where(details.columnName, Operator.LIKE, '%' + filter.value + '%');
    }
  }

  /**
   * Adds a token search filter as "WHERE" clause to the query builder.
   * @param predicate The select query predicate conjunction.
   * @param resourceType The resource type.
   * @param details The search parameter details.
   * @param filter The search filter.
   */
  #addTokenSearchFilter(
    predicate: Conjunction,
    resourceType: string,
    details: SearchParameterDetails,
    filter: Filter
  ): void {
    const column = new Column(resourceType, details.columnName);
    const expressions = [];
    for (const valueStr of filter.value.split(',')) {
      const value = details.type === SearchParameterType.BOOLEAN ? valueStr === 'true' : valueStr;
      if (details.array) {
        expressions.push(new Condition(column, Operator.ARRAY_CONTAINS, value));
      } else if (filter.operator === FhirOperator.CONTAINS) {
        expressions.push(new Condition(column, Operator.LIKE, '%' + value + '%'));
      } else {
        expressions.push(new Condition(column, Operator.EQUALS, value));
      }
    }
    const disjunction = new Disjunction(expressions);
    if (filter.operator === FhirOperator.NOT_EQUALS || filter.operator === FhirOperator.NOT) {
      predicate.whereExpr(new Negation(disjunction));
    } else {
      predicate.whereExpr(disjunction);
    }
  }

  /**
   * Adds a reference search filter as "WHERE" clause to the query builder.
   * @param predicate The select query predicate conjunction.
   * @param details The search parameter details.
   * @param filter The search filter.
   */
  #addReferenceSearchFilter(predicate: Conjunction, details: SearchParameterDetails, filter: Filter): void {
    // TODO: Support reference queries (filter.value === 'Patient?identifier=123')
    if (details.array) {
      predicate.where(details.columnName, Operator.ARRAY_CONTAINS, filter.value);
    } else {
      predicate.where(details.columnName, Operator.EQUALS, filter.value);
    }
  }

  /**
   * Adds all "order by" clauses to the query builder.
   * @param builder The client query builder.
   * @param searchRequest The search request.
   */
  #addSortRules(builder: SelectQuery, searchRequest: SearchRequest): void {
    searchRequest.sortRules?.forEach((sortRule) => this.#addOrderByClause(builder, searchRequest, sortRule));
  }

  /**
   * Adds a single "order by" clause to the query builder.
   * @param builder The client query builder.
   * @param searchRequest The search request.
   * @param sortRule The sort rule.
   */
  #addOrderByClause(builder: SelectQuery, searchRequest: SearchRequest, sortRule: SortRule): void {
    if (sortRule.code === '_lastUpdated') {
      builder.orderBy('lastUpdated', !!sortRule.descending);
      return;
    }

    const resourceType = searchRequest.resourceType;
    const param = getSearchParameter(resourceType, sortRule.code);
    if (!param || !param.code) {
      return;
    }

    const lookupTable = this.#getLookupTable(param);
    if (lookupTable) {
      lookupTable.addOrderBy(builder, sortRule);
      return;
    }

    const details = getSearchParameterDetails(getStructureDefinitions(), resourceType, param);
    builder.orderBy(details.columnName, !!sortRule.descending);
  }

  /**
   * Writes the resource to the resource table.
   * This builds all search parameter columns.
   * This does *not* write the version to the history table.
   * @param resource The resource.
   */
  async #writeResource(resource: Resource): Promise<void> {
    const client = getClient();
    const resourceType = resource.resourceType;
    const meta = resource.meta as Meta;
    const content = stringify(resource);

    const columns: Record<string, any> = {
      id: resource.id,
      lastUpdated: meta.lastUpdated,
      deleted: false,
      compartments: this.#getCompartments(resource),
      content,
    };

    const searchParams = getSearchParameters(resourceType);
    if (searchParams) {
      for (const searchParam of Object.values(searchParams)) {
        this.#buildColumn(resource, columns, searchParam);
      }
    }

    await new InsertQuery(resourceType, columns).mergeOnConflict(true).execute(client);
  }

  /**
   * Writes a version of the resource to the resource history table.
   * @param resource The resource.
   */
  async #writeResourceVersion(resource: Resource): Promise<void> {
    const client = getClient();
    const resourceType = resource.resourceType;
    const meta = resource.meta as Meta;
    const content = stringify(resource);

    await new InsertQuery(resourceType + '_History', {
      id: resource.id,
      versionId: meta.versionId,
      lastUpdated: meta.lastUpdated,
      content,
    }).execute(client);
  }

  /**
   * Builds a list of compartments for the resource for writing.
   * FHIR compartments are used for two purposes.
   * 1) Search narrowing (i.e., /Patient/123/Observation searches within the patient compartment).
   * 2) Access controls.
   * @param resource The resource.
   * @returns The list of compartments for the resource.
   */
  #getCompartments(resource: Resource): string[] {
    const result = new Set<string>();

    if (resource.meta?.project) {
      result.add(resource.meta.project);
    }

    if (resource.meta?.account) {
      result.add(resolveId(resource.meta.account) as string);
    }

    const patientId = getPatientId(resource);
    if (patientId) {
      result.add(patientId);
    }

    return Array.from(result);
  }

  /**
   * Builds the columns to write for a given resource and search parameter.
   * If nothing to write, then no columns will be added.
   * Some search parameters can result in multiple columns (for example, Reference objects).
   * @param resource The resource to write.
   * @param columns The output columns to write.
   * @param searchParam The search parameter definition.
   */
  #buildColumn(resource: Resource, columns: Record<string, any>, searchParam: SearchParameter): void {
    if (searchParam.code?.startsWith('_') || searchParam.type === 'composite' || this.#isIndexTable(searchParam)) {
      return;
    }

    const details = getSearchParameterDetails(getStructureDefinitions(), resource.resourceType, searchParam);
    const values = evalFhirPath(searchParam.expression as string, resource);

    if (values.length > 0) {
      if (details.array) {
        columns[details.columnName] = values.map((v) => this.#buildColumnValue(searchParam, details, v));
      } else {
        columns[details.columnName] = this.#buildColumnValue(searchParam, details, values[0]);
      }
    } else {
      columns[details.columnName] = null;
    }
  }

  /**
   * Builds a single value for a given search parameter.
   * If the search parameter is an array, then this method will be called for each element.
   * If the search parameter is not an array, then this method will be called for the value.
   * @param searchParam The search parameter definition.
   * @param details The extra search parameter details.
   * @param value The FHIR resource value.
   * @returns The column value.
   */
  #buildColumnValue(searchParam: SearchParameter, details: SearchParameterDetails, value: any): any {
    if (details.type === SearchParameterType.BOOLEAN) {
      return value === true || value === 'true';
    }

    if (details.type === SearchParameterType.DATE) {
      return this.#buildDateColumn(value);
    }

    if (details.type === SearchParameterType.DATETIME) {
      return this.#buildDateTimeColumn(value);
    }

    if (searchParam.type === 'reference') {
      return this.#buildReferenceColumns(value);
    }

    if (searchParam.type === 'token') {
      return this.#buildTokenColumn(value);
    }

    if (searchParam.type === 'quantity') {
      return this.#buildQuantityColumn(value);
    }

    return typeof value === 'string' ? value : stringify(value);
  }

  /**
   * Builds the column value for a date parameter.
   * Tries to parse the date string.
   * Silently ignores failure.
   * @param value The FHIRPath result.
   * @returns The date string if parsed; undefined otherwise.
   */
  #buildDateColumn(value: any): string | undefined {
    if (typeof value === 'string') {
      try {
        const date = new Date(value);
        return date.toISOString().substring(0, 10);
      } catch (ex) {
        // Silent ignore
      }
    }
    return undefined;
  }

  /**
   * Builds the column value for a date/time parameter.
   * Tries to parse the date string.
   * Silently ignores failure.
   * @param value The FHIRPath result.
   * @returns The date/time string if parsed; undefined otherwise.
   */
  #buildDateTimeColumn(value: any): string | undefined {
    if (typeof value === 'string') {
      try {
        const date = new Date(value);
        return date.toISOString();
      } catch (ex) {
        // Silent ignore
      }
    }
    return undefined;
  }

  /**
   * Builds the columns to write for a Reference value.
   * @param value The property value of the reference.
   */
  #buildReferenceColumns(value: any): string | undefined {
    if (value) {
      if (typeof value === 'string') {
        // Handle "canonical" properties such as QuestionnaireResponse.questionnaire
        // This is a reference string that is not a FHIR reference
        return value;
      }
      if (typeof value === 'object') {
        // Handle normal "reference" properties
        return (value as Reference).reference;
      }
    }
    return undefined;
  }

  /**
   * Builds the column value to write a "code" search parameter.
   * The common cases are:
   *  1) The property value is a string, so return directly.
   *  2) The property value is a CodeableConcept.
   *  3) Otherwise fallback to stringify.
   * @param value The property value of the code.
   * @returns The value to write to the database column.
   */
  #buildTokenColumn(value: any): string | undefined {
    if (!value) {
      return undefined;
    }

    if (typeof value === 'string') {
      // If the value is a string, return the value directly
      return value;
    }

    if (typeof value === 'object') {
      const codeableConceptValue = this.#buildCodeableConceptColumn(value);
      if (codeableConceptValue) {
        return codeableConceptValue;
      }
    }

    // Otherwise, return a stringified version of the value
    return stringify(value);
  }

  /**
   * Builds a CodeableConcept column value.
   * @param value The property value of the code.
   * @returns The value to write to the database column.
   */
  #buildCodeableConceptColumn(value: any): string | undefined {
    // If the value is a CodeableConcept,
    // then use the following logic to determine the code:
    // 1) value.coding[0].code
    // 2) value.coding[0].display
    // 3) value.text
    if ('coding' in value) {
      const coding = value.coding;
      if (Array.isArray(coding) && coding.length > 0) {
        if (coding[0].code) {
          return coding[0].code;
        }

        if (coding[0].display) {
          return coding[0].display;
        }
      }
    }

    if ('text' in value) {
      return value.text as string;
    }

    return undefined;
  }

  /**
   * Builds a Quantity column value.
   * @param value The property value of the quantity.
   * @returns The numeric value if available; undefined otherwise.
   */
  #buildQuantityColumn(value: any): number | undefined {
    if (typeof value === 'object') {
      if ('value' in value) {
        const num = value.value;
        if (typeof num === 'number') {
          return num;
        }
      }
    }
    return undefined;
  }

  async #writeLookupTables(resource: Resource): Promise<void> {
    for (const lookupTable of lookupTables) {
      await lookupTable.indexResource(resource);
    }
  }

  async #deleteFromLookupTables(resource: Resource): Promise<void> {
    for (const lookupTable of lookupTables) {
      await lookupTable.deleteValuesForResource(resource);
    }
  }

  #isIndexTable(searchParam: SearchParameter): boolean {
    return !!this.#getLookupTable(searchParam);
  }

  #getLookupTable(searchParam: SearchParameter): LookupTable<unknown> | undefined {
    for (const lookupTable of lookupTables) {
      if (lookupTable.isIndexed(searchParam)) {
        return lookupTable;
      }
    }
    return undefined;
  }

  /**
   * Returns the last updated timestamp for the resource.
   * During historical data migration, some client applications are allowed
   * to override the timestamp.
   * @param resource The FHIR resource.
   * @returns The last updated date.
   */
  #getLastUpdated(existing: Resource | undefined, resource: Resource): string {
    if (!existing) {
      // If the resource has a specified "lastUpdated",
      // and there is no existing version,
      // and the current context is a ClientApplication (i.e., OAuth client credentials),
      // then allow the ClientApplication to set the date.
      const lastUpdated = resource.meta?.lastUpdated;
      if (lastUpdated && this.#canWriteMeta()) {
        return lastUpdated;
      }
    }

    // Otherwise, use "now"
    return new Date().toISOString();
  }

  /**
   * Returns the project ID for the resource.
   * If it is a public resource type, then returns the public project ID.
   * If it is a protected resource type, then returns the Medplum project ID.
   * Otherwise, by default, return the current context project ID.
   * @param resource The FHIR resource.
   * @returns The project ID.
   */
  #getProjectId(resource: Resource): string | undefined {
    if (publicResourceTypes.includes(resource.resourceType)) {
      return undefined;
    }

    if (protectedResourceTypes.includes(resource.resourceType)) {
      return undefined;
    }

    const submittedProjectId = resource.meta?.project;
    if (submittedProjectId && this.#canWriteMeta()) {
      // If the resource has an project (whether provided or from existing),
      // and the current context is allowed to write meta,
      // then use the provided value.
      return submittedProjectId;
    }

    return this.#context.project;
  }

  /**
   * Returns the author reference.
   * If the current context is allowed to write meta,
   * and the provided resource includes an author reference,
   * then use the provided value.
   * Otherwise uses the current context profile.
   * @param resource The FHIR resource.
   * @returns
   */
  #getAuthor(resource: Resource): Reference {
    // If the resource has an author (whether provided or from existing),
    // and the current context is allowed to write meta,
    // then use the provided value.
    const author = resource.meta?.author;
    if (author && this.#canWriteMeta()) {
      return author;
    }

    return this.#context.author;
  }

  /**
   * Returns the author reference string (resourceType/id).
   * If the current context is a ClientApplication, handles "on behalf of".
   * Otherwise uses the current context profile.
   * @param resource The FHIR resource.
   * @returns
   */
  async #getAccount(existing: Resource | undefined, updated: Resource): Promise<Reference | undefined> {
    const account = updated.meta?.account;
    if (account && this.#canWriteMeta()) {
      // If the user specifies an account, allow it if they have permission.
      return account;
    }

    if (this.#context.accessPolicy?.compartment) {
      // If the user access policy specifies a comparment, then use it as the account.
      return this.#context.accessPolicy?.compartment;
    }

    if (updated.resourceType !== 'Patient') {
      const patientId = getPatientId(updated);
      if (patientId) {
        // If the resource is in a patient compartment, then lookup the patient.
        try {
          const patient = await systemRepo.readResource('Patient', patientId);
          if (patient?.meta?.account) {
            // If the patient has an account, then use it as the resource account.
            return patient.meta.account;
          }
        } catch (err) {
          logger.debug('Error setting patient compartment', err);
        }
      }
    }

    // Otherwise, default to the existing value.
    return existing?.meta?.account ?? updated.meta?.account;
  }

  /**
   * Determines if the current user can manually set the ID field.
   * This is very powerful, and reserved for the system account.
   * @returns True if the current user can manually set the ID field.
   */
  #canSetId(): boolean {
    return this.#isSuperAdmin();
  }

  /**
   * Determines if the current user can manually set meta fields.
   * @returns True if the current user can manually set meta fields.
   */
  #canWriteMeta(): boolean {
    return this.#isSuperAdmin();
  }

  /**
   * Determines if the current user can read the specified resource type.
   * @param resourceType The resource type.
   * @returns True if the current user can read the specified resource type.
   */
  #canReadResourceType(resourceType: string): boolean {
    if (this.#isSuperAdmin()) {
      return true;
    }
    if (protectedResourceTypes.includes(resourceType)) {
      return false;
    }
    if (publicResourceTypes.includes(resourceType)) {
      return true;
    }
    if (!this.#context.accessPolicy) {
      return true;
    }
    if (this.#context.accessPolicy.resource) {
      for (const resourcePolicy of this.#context.accessPolicy.resource) {
        if (resourcePolicy.resourceType === resourceType || resourcePolicy.resourceType === '*') {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Determines if the current user can write the specified resource type.
   * @param resourceType The resource type.
   * @returns True if the current user can write the specified resource type.
   */
  #canWriteResourceType(resourceType: string): boolean {
    if (this.#isSuperAdmin()) {
      return true;
    }
    if (protectedResourceTypes.includes(resourceType)) {
      return false;
    }
    if (publicResourceTypes.includes(resourceType)) {
      return false;
    }
    if (!this.#context.accessPolicy) {
      return true;
    }
    if (this.#context.accessPolicy.resource) {
      for (const resourcePolicy of this.#context.accessPolicy.resource) {
        if (
          (resourcePolicy.resourceType === resourceType || resourcePolicy.resourceType === '*') &&
          !resourcePolicy.readonly
        ) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Removes hidden fields from a resource as defined by the access policy.
   * This should be called for any "read" operation.
   * @param input The input resource.
   */
  #removeHiddenFields<T extends Resource>(input: T): T {
    const policy = this.#getResourceAccessPolicy(input.resourceType);
    if (policy?.hiddenFields) {
      for (const field of policy.hiddenFields) {
        this.#removeField(input, field);
      }
    }
    return input;
  }

  /**
   * Overwrites readonly fields from a resource as defined by the access policy.
   * If no original (i.e., this is the first version), then blank them out.
   * This should be called for any "write" operation.
   * @param input The input resource.
   * @param original The previous version, if it exists.
   */
  #restoreReadonlyFields<T extends Resource>(input: T, original: T | undefined): T {
    const policy = this.#getResourceAccessPolicy(input.resourceType);
    if (policy?.readonlyFields) {
      for (const field of policy.readonlyFields) {
        this.#removeField(input, field);
        if (original) {
          const value = original[field as keyof T];
          if (value) {
            input[field as keyof T] = value;
          }
        }
      }
    }
    return input;
  }

  /**
   * Removes a field from the input resource.
   * Uses JSONPatch to process the remove operation, which supports nested fields.
   * @param input The input resource.
   * @param path The path to the field to remove.
   * @returns The new document with the field removed.
   */
  #removeField<T extends Resource>(input: T, path: string): T {
    const patch: Operation[] = [{ op: 'remove', path: `/${path.replaceAll('.', '/')}` }];
    return applyPatch(input, patch).newDocument;
  }

  #getResourceAccessPolicy(resourceType: string): AccessPolicyResource | undefined {
    if (this.#context.accessPolicy?.resource) {
      for (const resourcePolicy of this.#context.accessPolicy.resource) {
        if (resourcePolicy.resourceType === resourceType) {
          return resourcePolicy;
        }
      }
    }
    return undefined;
  }

  #isSuperAdmin(): boolean {
    return !!this.#context.superAdmin || this.#isAdminClient();
  }

  /**
   * Deprecated, for removal.
   * @deprecated
   */
  #isAdminClient(): boolean {
    const { adminClientId } = getConfig();
    return !!adminClientId && this.#context.author.reference === 'ClientApplication/' + adminClientId;
  }
}

/**
 * Tries to read a cache entry from Redis by resource type and ID.
 * @param resourceType The resource type.
 * @param id The resource ID.
 * @returns The cache entry if found; otherwise, undefined.
 */
async function getCacheEntry<T extends Resource>(resourceType: string, id: string): Promise<CacheEntry<T> | undefined> {
  const cachedValue = await getRedis().get(getCacheKey(resourceType, id));
  return cachedValue ? (JSON.parse(cachedValue) as CacheEntry<T>) : undefined;
}

/**
 * Writes a cache entry to Redis.
 * @param resource The resource to cache.
 */
async function setCacheEntry(resource: Resource): Promise<void> {
  await getRedis().set(
    getCacheKey(resource.resourceType, resource.id as string),
    JSON.stringify({ resource, projectId: resource.meta?.project })
  );
}

/**
 * Deletes a cache entry from Redis.
 * @param resourceType The resource type.
 * @param id The resource ID.
 */
async function deleteCacheEntry(resourceType: string, id: string): Promise<void> {
  await getRedis().del(getCacheKey(resourceType, id));
}

/**
 * Returns the redis cache key for the given resource type and resource ID.
 * @param resourceType The resource type.
 * @param id The resource ID.
 * @returns The Redis cache key.
 */
function getCacheKey(resourceType: string, id: string): string {
  return `${resourceType}/${id}`;
}

/**
 * Converts a FHIR search operator into a SQL operator.
 * Only works for simple conversions.
 * For complex conversions, need to build custom SQL.
 * @param fhirOperator The FHIR operator.
 * @returns The equivalent SQL operator.
 */
function fhirOperatorToSqlOperator(fhirOperator: FhirOperator): Operator {
  switch (fhirOperator) {
    case FhirOperator.EQUALS:
      return Operator.EQUALS;
    case FhirOperator.NOT_EQUALS:
      return Operator.NOT_EQUALS;
    case FhirOperator.GREATER_THAN:
    case FhirOperator.STARTS_AFTER:
      return Operator.GREATER_THAN;
    case FhirOperator.GREATER_THAN_OR_EQUALS:
      return Operator.GREATER_THAN_OR_EQUALS;
    case FhirOperator.LESS_THAN:
    case FhirOperator.ENDS_BEFORE:
      return Operator.LESS_THAN;
    case FhirOperator.LESS_THAN_OR_EQUALS:
      return Operator.LESS_THAN_OR_EQUALS;
    default:
      throw new Error(`Unknown FHIR operator: ${fhirOperator}`);
  }
}

/**
 * Creates a repository object for the user login object.
 * Individual instances of the Repository class manage access rights to resources.
 * Login instances contain details about user compartments.
 * This method ensures that the repository is setup correctly.
 * @param login The user login.
 * @param membership The active project membership.
 * @returns A repository configured for the login details.
 */
export async function getRepoForLogin(login: Login, membership: ProjectMembership): Promise<Repository> {
  let accessPolicy: AccessPolicy | undefined = undefined;

  if (membership.accessPolicy) {
    accessPolicy = await systemRepo.readReference(membership.accessPolicy);
  }

  return new Repository({
    project: resolveId(membership.project) as string,
    author: membership.profile as Reference,
    superAdmin: login.admin || login.superAdmin,
    accessPolicy,
  });
}

export const systemRepo = new Repository({
  superAdmin: true,
  author: {
    reference: 'system',
  },
});
