/*
 * Generated by com.medplum.generator.Generator
 * Do not edit manually.
 */

import { Extension } from './Extension';
import { Identifier } from './Identifier';
import { Meta } from './Meta';
import { Resource } from './Resource';
import { Signature } from './Signature';

/**
 * A container for a collection of resources.
 */
export interface Bundle {

  /**
   * This is a Bundle resource
   */
  readonly resourceType: 'Bundle';

  /**
   * The logical id of the resource, as used in the URL for the resource.
   * Once assigned, this value never changes.
   */
  readonly id?: string;

  /**
   * The metadata about the resource. This is content that is maintained by
   * the infrastructure. Changes to the content might not always be
   * associated with version changes to the resource.
   */
  readonly meta?: Meta;

  /**
   * A reference to a set of rules that were followed when the resource was
   * constructed, and which must be understood when processing the content.
   * Often, this is a reference to an implementation guide that defines the
   * special rules along with other profiles etc.
   */
  readonly implicitRules?: string;

  /**
   * The base language in which the resource is written.
   */
  readonly language?: string;

  /**
   * A persistent identifier for the bundle that won't change as a bundle
   * is copied from server to server.
   */
  readonly identifier?: Identifier;

  /**
   * Indicates the purpose of this bundle - how it is intended to be used.
   */
  readonly type?: string;

  /**
   * The date/time that the bundle was assembled - i.e. when the resources
   * were placed in the bundle.
   */
  readonly timestamp?: Date;

  /**
   * If a set of search matches, this is the total number of entries of
   * type 'match' across all pages in the search.  It does not include
   * search.mode = 'include' or 'outcome' entries and it does not provide a
   * count of the number of entries in the Bundle.
   */
  readonly total?: number;

  /**
   * A series of links that provide context to this bundle.
   */
  readonly link?: BundleLink[];

  /**
   * An entry in a bundle resource - will either contain a resource or
   * information about a resource (transactions and history only).
   */
  readonly entry?: BundleEntry[];

  /**
   * Digital Signature - base64 encoded. XML-DSig or a JWT.
   */
  readonly signature?: Signature;
}

/**
 * A container for a collection of resources.
 */
export interface BundleEntry {

  /**
   * Unique id for the element within a resource (for internal references).
   * This may be any string value that does not contain spaces.
   */
  readonly id?: string;

  /**
   * May be used to represent additional information that is not part of
   * the basic definition of the element. To make the use of extensions
   * safe and manageable, there is a strict set of governance  applied to
   * the definition and use of extensions. Though any implementer can
   * define an extension, there is a set of requirements that SHALL be met
   * as part of the definition of the extension.
   */
  readonly extension?: Extension[];

  /**
   * May be used to represent additional information that is not part of
   * the basic definition of the element and that modifies the
   * understanding of the element in which it is contained and/or the
   * understanding of the containing element's descendants. Usually
   * modifier elements provide negation or qualification. To make the use
   * of extensions safe and manageable, there is a strict set of governance
   * applied to the definition and use of extensions. Though any
   * implementer can define an extension, there is a set of requirements
   * that SHALL be met as part of the definition of the extension.
   * Applications processing a resource are required to check for modifier
   * extensions.
   *
   * Modifier extensions SHALL NOT change the meaning of any elements on
   * Resource or DomainResource (including cannot change the meaning of
   * modifierExtension itself).
   */
  readonly modifierExtension?: Extension[];

  /**
   * A series of links that provide context to this entry.
   */
  readonly link?: BundleLink[];

  /**
   * The Absolute URL for the resource.  The fullUrl SHALL NOT disagree
   * with the id in the resource - i.e. if the fullUrl is not a urn:uuid,
   * the URL shall be version-independent URL consistent with the
   * Resource.id. The fullUrl is a version independent reference to the
   * resource. The fullUrl element SHALL have a value except that:
   * * fullUrl can be empty on a POST (although it does not need to when
   * specifying a temporary id for reference in the bundle)
   * * Results from operations might involve resources that are not
   * identified.
   */
  readonly fullUrl?: string;

  /**
   * The Resource for the entry. The purpose/meaning of the resource is
   * determined by the Bundle.type.
   */
  readonly resource?: Resource;

  /**
   * Information about the search process that lead to the creation of this
   * entry.
   */
  readonly search?: BundleSearch;

  /**
   * Additional information about how this entry should be processed as
   * part of a transaction or batch.  For history, it shows how the entry
   * was processed to create the version contained in the entry.
   */
  readonly request?: BundleRequest;

  /**
   * Indicates the results of processing the corresponding 'request' entry
   * in the batch or transaction being responded to or what the results of
   * an operation where when returning history.
   */
  readonly response?: BundleResponse;
}

/**
 * A container for a collection of resources.
 */
export interface BundleLink {

  /**
   * Unique id for the element within a resource (for internal references).
   * This may be any string value that does not contain spaces.
   */
  readonly id?: string;

  /**
   * May be used to represent additional information that is not part of
   * the basic definition of the element. To make the use of extensions
   * safe and manageable, there is a strict set of governance  applied to
   * the definition and use of extensions. Though any implementer can
   * define an extension, there is a set of requirements that SHALL be met
   * as part of the definition of the extension.
   */
  readonly extension?: Extension[];

  /**
   * May be used to represent additional information that is not part of
   * the basic definition of the element and that modifies the
   * understanding of the element in which it is contained and/or the
   * understanding of the containing element's descendants. Usually
   * modifier elements provide negation or qualification. To make the use
   * of extensions safe and manageable, there is a strict set of governance
   * applied to the definition and use of extensions. Though any
   * implementer can define an extension, there is a set of requirements
   * that SHALL be met as part of the definition of the extension.
   * Applications processing a resource are required to check for modifier
   * extensions.
   *
   * Modifier extensions SHALL NOT change the meaning of any elements on
   * Resource or DomainResource (including cannot change the meaning of
   * modifierExtension itself).
   */
  readonly modifierExtension?: Extension[];

  /**
   * A name which details the functional use for this link - see
   * [http://www.iana.org/assignments/link-relations/link-relations.xhtml#link-relations-1](http://www.iana.org/assignments/link-relations/link-relations.xhtml#link-relations-1).
   */
  readonly relation?: string;

  /**
   * The reference details for the link.
   */
  readonly url?: string;
}

/**
 * A container for a collection of resources.
 */
export interface BundleRequest {

  /**
   * Unique id for the element within a resource (for internal references).
   * This may be any string value that does not contain spaces.
   */
  readonly id?: string;

  /**
   * May be used to represent additional information that is not part of
   * the basic definition of the element. To make the use of extensions
   * safe and manageable, there is a strict set of governance  applied to
   * the definition and use of extensions. Though any implementer can
   * define an extension, there is a set of requirements that SHALL be met
   * as part of the definition of the extension.
   */
  readonly extension?: Extension[];

  /**
   * May be used to represent additional information that is not part of
   * the basic definition of the element and that modifies the
   * understanding of the element in which it is contained and/or the
   * understanding of the containing element's descendants. Usually
   * modifier elements provide negation or qualification. To make the use
   * of extensions safe and manageable, there is a strict set of governance
   * applied to the definition and use of extensions. Though any
   * implementer can define an extension, there is a set of requirements
   * that SHALL be met as part of the definition of the extension.
   * Applications processing a resource are required to check for modifier
   * extensions.
   *
   * Modifier extensions SHALL NOT change the meaning of any elements on
   * Resource or DomainResource (including cannot change the meaning of
   * modifierExtension itself).
   */
  readonly modifierExtension?: Extension[];

  /**
   * In a transaction or batch, this is the HTTP action to be executed for
   * this entry. In a history bundle, this indicates the HTTP action that
   * occurred.
   */
  readonly method?: string;

  /**
   * The URL for this entry, relative to the root (the address to which the
   * request is posted).
   */
  readonly url?: string;

  /**
   * If the ETag values match, return a 304 Not Modified status. See the
   * API documentation for [&quot;Conditional Read&quot;](http.html#cread).
   */
  readonly ifNoneMatch?: string;

  /**
   * Only perform the operation if the last updated date matches. See the
   * API documentation for [&quot;Conditional Read&quot;](http.html#cread).
   */
  readonly ifModifiedSince?: Date;

  /**
   * Only perform the operation if the Etag value matches. For more
   * information, see the API section [&quot;Managing Resource
   * Contention&quot;](http.html#concurrency).
   */
  readonly ifMatch?: string;

  /**
   * Instruct the server not to perform the create if a specified resource
   * already exists. For further information, see the API documentation for
   * [&quot;Conditional Create&quot;](http.html#ccreate). This is just the query
   * portion of the URL - what follows the &quot;?&quot; (not including the &quot;?&quot;).
   */
  readonly ifNoneExist?: string;
}

/**
 * A container for a collection of resources.
 */
export interface BundleResponse {

  /**
   * Unique id for the element within a resource (for internal references).
   * This may be any string value that does not contain spaces.
   */
  readonly id?: string;

  /**
   * May be used to represent additional information that is not part of
   * the basic definition of the element. To make the use of extensions
   * safe and manageable, there is a strict set of governance  applied to
   * the definition and use of extensions. Though any implementer can
   * define an extension, there is a set of requirements that SHALL be met
   * as part of the definition of the extension.
   */
  readonly extension?: Extension[];

  /**
   * May be used to represent additional information that is not part of
   * the basic definition of the element and that modifies the
   * understanding of the element in which it is contained and/or the
   * understanding of the containing element's descendants. Usually
   * modifier elements provide negation or qualification. To make the use
   * of extensions safe and manageable, there is a strict set of governance
   * applied to the definition and use of extensions. Though any
   * implementer can define an extension, there is a set of requirements
   * that SHALL be met as part of the definition of the extension.
   * Applications processing a resource are required to check for modifier
   * extensions.
   *
   * Modifier extensions SHALL NOT change the meaning of any elements on
   * Resource or DomainResource (including cannot change the meaning of
   * modifierExtension itself).
   */
  readonly modifierExtension?: Extension[];

  /**
   * The status code returned by processing this entry. The status SHALL
   * start with a 3 digit HTTP code (e.g. 404) and may contain the standard
   * HTTP description associated with the status code.
   */
  readonly status?: string;

  /**
   * The location header created by processing this operation, populated if
   * the operation returns a location.
   */
  readonly location?: string;

  /**
   * The Etag for the resource, if the operation for the entry produced a
   * versioned resource (see [Resource Metadata and
   * Versioning](http.html#versioning) and [Managing Resource
   * Contention](http.html#concurrency)).
   */
  readonly etag?: string;

  /**
   * The date/time that the resource was modified on the server.
   */
  readonly lastModified?: Date;

  /**
   * An OperationOutcome containing hints and warnings produced as part of
   * processing this entry in a batch or transaction.
   */
  readonly outcome?: Resource;
}

/**
 * A container for a collection of resources.
 */
export interface BundleSearch {

  /**
   * Unique id for the element within a resource (for internal references).
   * This may be any string value that does not contain spaces.
   */
  readonly id?: string;

  /**
   * May be used to represent additional information that is not part of
   * the basic definition of the element. To make the use of extensions
   * safe and manageable, there is a strict set of governance  applied to
   * the definition and use of extensions. Though any implementer can
   * define an extension, there is a set of requirements that SHALL be met
   * as part of the definition of the extension.
   */
  readonly extension?: Extension[];

  /**
   * May be used to represent additional information that is not part of
   * the basic definition of the element and that modifies the
   * understanding of the element in which it is contained and/or the
   * understanding of the containing element's descendants. Usually
   * modifier elements provide negation or qualification. To make the use
   * of extensions safe and manageable, there is a strict set of governance
   * applied to the definition and use of extensions. Though any
   * implementer can define an extension, there is a set of requirements
   * that SHALL be met as part of the definition of the extension.
   * Applications processing a resource are required to check for modifier
   * extensions.
   *
   * Modifier extensions SHALL NOT change the meaning of any elements on
   * Resource or DomainResource (including cannot change the meaning of
   * modifierExtension itself).
   */
  readonly modifierExtension?: Extension[];

  /**
   * Why this entry is in the result set - whether it's included as a match
   * or because of an _include requirement, or to convey information or
   * warning information about the search process.
   */
  readonly mode?: string;

  /**
   * When searching, the server's search ranking score for the entry.
   */
  readonly score?: number;
}
