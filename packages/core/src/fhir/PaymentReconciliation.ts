/*
 * Generated by @medplum/generator
 * Do not edit manually.
 */

import { CodeableConcept } from './CodeableConcept';
import { Extension } from './Extension';
import { Identifier } from './Identifier';
import { Meta } from './Meta';
import { Money } from './Money';
import { Narrative } from './Narrative';
import { Period } from './Period';
import { Reference } from './Reference';
import { Resource } from './Resource';

/**
 * This resource provides the details including amount of a payment and
 * allocates the payment items being paid.
 */
export interface PaymentReconciliation {

  /**
   * This is a PaymentReconciliation resource
   */
  readonly resourceType: 'PaymentReconciliation';

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
   * A unique identifier assigned to this payment reconciliation.
   */
  readonly identifier?: Identifier[];

  /**
   * The status of the resource instance.
   */
  readonly status?: string;

  /**
   * The period of time for which payments have been gathered into this
   * bulk payment for settlement.
   */
  readonly period?: Period;

  /**
   * The date when the resource was created.
   */
  readonly created?: string;

  /**
   * The party who generated the payment.
   */
  readonly paymentIssuer?: Reference;

  /**
   * Original request resource reference.
   */
  readonly request?: Reference;

  /**
   * The practitioner who is responsible for the services rendered to the
   * patient.
   */
  readonly requestor?: Reference;

  /**
   * The outcome of a request for a reconciliation.
   */
  readonly outcome?: string;

  /**
   * A human readable description of the status of the request for the
   * reconciliation.
   */
  readonly disposition?: string;

  /**
   * The date of payment as indicated on the financial instrument.
   */
  readonly paymentDate?: string;

  /**
   * Total payment amount as indicated on the financial instrument.
   */
  readonly paymentAmount?: Money;

  /**
   * Issuer's unique identifier for the payment instrument.
   */
  readonly paymentIdentifier?: Identifier;

  /**
   * Distribution of the payment amount for a previously acknowledged
   * payable.
   */
  readonly detail?: PaymentReconciliationDetail[];

  /**
   * A code for the form to be used for printing the content.
   */
  readonly formCode?: CodeableConcept;

  /**
   * A note that describes or explains the processing in a human readable
   * form.
   */
  readonly processNote?: PaymentReconciliationProcessNote[];
}

/**
 * Distribution of the payment amount for a previously acknowledged
 * payable.
 */
export interface PaymentReconciliationDetail {

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
   * Unique identifier for the current payment item for the referenced
   * payable.
   */
  readonly identifier?: Identifier;

  /**
   * Unique identifier for the prior payment item for the referenced
   * payable.
   */
  readonly predecessor?: Identifier;

  /**
   * Code to indicate the nature of the payment.
   */
  readonly type?: CodeableConcept;

  /**
   * A resource, such as a Claim, the evaluation of which could lead to
   * payment.
   */
  readonly request?: Reference;

  /**
   * The party which submitted the claim or financial transaction.
   */
  readonly submitter?: Reference;

  /**
   * A resource, such as a ClaimResponse, which contains a commitment to
   * payment.
   */
  readonly response?: Reference;

  /**
   * The date from the response resource containing a commitment to pay.
   */
  readonly date?: string;

  /**
   * A reference to the individual who is responsible for inquiries
   * regarding the response and its payment.
   */
  readonly responsible?: Reference;

  /**
   * The party which is receiving the payment.
   */
  readonly payee?: Reference;

  /**
   * The monetary amount allocated from the total payment to the payable.
   */
  readonly amount?: Money;
}

/**
 * A note that describes or explains the processing in a human readable
 * form.
 */
export interface PaymentReconciliationProcessNote {

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
   * The business purpose of the note text.
   */
  readonly type?: string;

  /**
   * The explanation or description associated with the processing.
   */
  readonly text?: string;
}
