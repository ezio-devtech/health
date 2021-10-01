/*
 * Generated by @medplum/generator
 * Do not edit manually.
 */

import { CodeableConcept } from './CodeableConcept';
import { Extension } from './Extension';
import { Identifier } from './Identifier';
import { Meta } from './Meta';
import { Narrative } from './Narrative';
import { Period } from './Period';
import { Reference } from './Reference';
import { Resource } from './Resource';

/**
 * A financial tool for tracking value accrued for a particular purpose.
 * In the healthcare field, used to track charges for a patient, cost
 * centers, etc.
 */
export interface Account {

  /**
   * This is a Account resource
   */
  readonly resourceType: 'Account';

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
   * A human-readable narrative that contains a summary of the resource and
   * can be used to represent the content of the resource to a human. The
   * narrative need not encode all the structured data, but is required to
   * contain sufficient detail to make it &quot;clinically safe&quot; for a human to
   * just read the narrative. Resource definitions may define what content
   * should be represented in the narrative to ensure clinical safety.
   */
  readonly text?: Narrative;

  /**
   * These resources do not have an independent existence apart from the
   * resource that contains them - they cannot be identified independently,
   * and nor can they have their own independent transaction scope.
   */
  readonly contained?: Resource[];

  /**
   * May be used to represent additional information that is not part of
   * the basic definition of the resource. To make the use of extensions
   * safe and manageable, there is a strict set of governance  applied to
   * the definition and use of extensions. Though any implementer can
   * define an extension, there is a set of requirements that SHALL be met
   * as part of the definition of the extension.
   */
  readonly extension?: Extension[];

  /**
   * May be used to represent additional information that is not part of
   * the basic definition of the resource and that modifies the
   * understanding of the element that contains it and/or the understanding
   * of the containing element's descendants. Usually modifier elements
   * provide negation or qualification. To make the use of extensions safe
   * and manageable, there is a strict set of governance applied to the
   * definition and use of extensions. Though any implementer is allowed to
   * define an extension, there is a set of requirements that SHALL be met
   * as part of the definition of the extension. Applications processing a
   * resource are required to check for modifier extensions.
   *
   * Modifier extensions SHALL NOT change the meaning of any elements on
   * Resource or DomainResource (including cannot change the meaning of
   * modifierExtension itself).
   */
  readonly modifierExtension?: Extension[];

  /**
   * Unique identifier used to reference the account.  Might or might not
   * be intended for human use (e.g. credit card number).
   */
  readonly identifier?: Identifier[];

  /**
   * Indicates whether the account is presently used/usable or not.
   */
  readonly status?: string;

  /**
   * Categorizes the account for reporting and searching purposes.
   */
  readonly type?: CodeableConcept;

  /**
   * Name used for the account when displaying it to humans in reports,
   * etc.
   */
  readonly name?: string;

  /**
   * Identifies the entity which incurs the expenses. While the immediate
   * recipients of services or goods might be entities related to the
   * subject, the expenses were ultimately incurred by the subject of the
   * Account.
   */
  readonly subject?: Reference[];

  /**
   * The date range of services associated with this account.
   */
  readonly servicePeriod?: Period;

  /**
   * The party(s) that are responsible for covering the payment of this
   * account, and what order should they be applied to the account.
   */
  readonly coverage?: AccountCoverage[];

  /**
   * Indicates the service area, hospital, department, etc. with
   * responsibility for managing the Account.
   */
  readonly owner?: Reference;

  /**
   * Provides additional information about what the account tracks and how
   * it is used.
   */
  readonly description?: string;

  /**
   * The parties responsible for balancing the account if other payment
   * options fall short.
   */
  readonly guarantor?: AccountGuarantor[];

  /**
   * Reference to a parent Account.
   */
  readonly partOf?: Reference;
}

/**
 * The party(s) that are responsible for covering the payment of this
 * account, and what order should they be applied to the account.
 */
export interface AccountCoverage {

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
   * The party(s) that contribute to payment (or part of) of the charges
   * applied to this account (including self-pay).
   *
   * A coverage may only be responsible for specific types of charges, and
   * the sequence of the coverages in the account could be important when
   * processing billing.
   */
  readonly coverage?: Reference;

  /**
   * The priority of the coverage in the context of this account.
   */
  readonly priority?: number;
}

/**
 * The parties responsible for balancing the account if other payment
 * options fall short.
 */
export interface AccountGuarantor {

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
   * The entity who is responsible.
   */
  readonly party?: Reference;

  /**
   * A guarantor may be placed on credit hold or otherwise have their role
   * temporarily suspended.
   */
  readonly onHold?: boolean;

  /**
   * The timeframe during which the guarantor accepts responsibility for
   * the account.
   */
  readonly period?: Period;
}
