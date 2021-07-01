/*
 * Generated by @medplum/generator
 * Do not edit manually.
 */

import { Annotation } from './Annotation';
import { CodeableConcept } from './CodeableConcept';
import { Extension } from './Extension';
import { Identifier } from './Identifier';
import { Meta } from './Meta';
import { Narrative } from './Narrative';
import { Quantity } from './Quantity';
import { Reference } from './Reference';
import { Resource } from './Resource';

/**
 * Describes the event of a patient being administered a vaccine or a
 * record of an immunization as reported by a patient, a clinician or
 * another party.
 */
export interface Immunization {

  /**
   * This is a Immunization resource
   */
  readonly resourceType: 'Immunization';

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
   * A unique identifier assigned to this immunization record.
   */
  readonly identifier?: Identifier[];

  /**
   * Indicates the current status of the immunization event.
   */
  readonly status?: string;

  /**
   * Indicates the reason the immunization event was not performed.
   */
  readonly statusReason?: CodeableConcept;

  /**
   * Vaccine that was administered or was to be administered.
   */
  readonly vaccineCode?: CodeableConcept;

  /**
   * The patient who either received or did not receive the immunization.
   */
  readonly patient?: Reference;

  /**
   * The visit or admission or other contact between patient and health
   * care provider the immunization was performed as part of.
   */
  readonly encounter?: Reference;

  /**
   * Date vaccine administered or was to be administered.
   */
  readonly occurrenceDateTime?: string;

  /**
   * Date vaccine administered or was to be administered.
   */
  readonly occurrenceString?: string;

  /**
   * The date the occurrence of the immunization was first captured in the
   * record - potentially significantly after the occurrence of the event.
   */
  readonly recorded?: Date | string;

  /**
   * An indication that the content of the record is based on information
   * from the person who administered the vaccine. This reflects the
   * context under which the data was originally recorded.
   */
  readonly primarySource?: boolean;

  /**
   * The source of the data when the report of the immunization event is
   * not based on information from the person who administered the vaccine.
   */
  readonly reportOrigin?: CodeableConcept;

  /**
   * The service delivery location where the vaccine administration
   * occurred.
   */
  readonly location?: Reference;

  /**
   * Name of vaccine manufacturer.
   */
  readonly manufacturer?: Reference;

  /**
   * Lot number of the  vaccine product.
   */
  readonly lotNumber?: string;

  /**
   * Date vaccine batch expires.
   */
  readonly expirationDate?: Date | string;

  /**
   * Body site where vaccine was administered.
   */
  readonly site?: CodeableConcept;

  /**
   * The path by which the vaccine product is taken into the body.
   */
  readonly route?: CodeableConcept;

  /**
   * The quantity of vaccine product that was administered.
   */
  readonly doseQuantity?: Quantity;

  /**
   * Indicates who performed the immunization event.
   */
  readonly performer?: ImmunizationPerformer[];

  /**
   * Extra information about the immunization that is not conveyed by the
   * other attributes.
   */
  readonly note?: Annotation[];

  /**
   * Reasons why the vaccine was administered.
   */
  readonly reasonCode?: CodeableConcept[];

  /**
   * Condition, Observation or DiagnosticReport that supports why the
   * immunization was administered.
   */
  readonly reasonReference?: Reference[];

  /**
   * Indication if a dose is considered to be subpotent. By default, a dose
   * should be considered to be potent.
   */
  readonly isSubpotent?: boolean;

  /**
   * Reason why a dose is considered to be subpotent.
   */
  readonly subpotentReason?: CodeableConcept[];

  /**
   * Educational material presented to the patient (or guardian) at the
   * time of vaccine administration.
   */
  readonly education?: ImmunizationEducation[];

  /**
   * Indicates a patient's eligibility for a funding program.
   */
  readonly programEligibility?: CodeableConcept[];

  /**
   * Indicates the source of the vaccine actually administered. This may be
   * different than the patient eligibility (e.g. the patient may be
   * eligible for a publically purchased vaccine but due to inventory
   * issues, vaccine purchased with private funds was actually
   * administered).
   */
  readonly fundingSource?: CodeableConcept;

  /**
   * Categorical data indicating that an adverse event is associated in
   * time to an immunization.
   */
  readonly reaction?: ImmunizationReaction[];

  /**
   * The protocol (set of recommendations) being followed by the provider
   * who administered the dose.
   */
  readonly protocolApplied?: ImmunizationProtocolApplied[];
}

/**
 * Describes the event of a patient being administered a vaccine or a
 * record of an immunization as reported by a patient, a clinician or
 * another party.
 */
export interface ImmunizationEducation {

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
   * Identifier of the material presented to the patient.
   */
  readonly documentType?: string;

  /**
   * Reference pointer to the educational material given to the patient if
   * the information was on line.
   */
  readonly reference?: string;

  /**
   * Date the educational material was published.
   */
  readonly publicationDate?: Date | string;

  /**
   * Date the educational material was given to the patient.
   */
  readonly presentationDate?: Date | string;
}

/**
 * Describes the event of a patient being administered a vaccine or a
 * record of an immunization as reported by a patient, a clinician or
 * another party.
 */
export interface ImmunizationPerformer {

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
   * Describes the type of performance (e.g. ordering provider,
   * administering provider, etc.).
   */
  readonly function?: CodeableConcept;

  /**
   * The practitioner or organization who performed the action.
   */
  readonly actor?: Reference;
}

/**
 * Describes the event of a patient being administered a vaccine or a
 * record of an immunization as reported by a patient, a clinician or
 * another party.
 */
export interface ImmunizationProtocolApplied {

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
   * One possible path to achieve presumed immunity against a disease -
   * within the context of an authority.
   */
  readonly series?: string;

  /**
   * Indicates the authority who published the protocol (e.g. ACIP) that is
   * being followed.
   */
  readonly authority?: Reference;

  /**
   * The vaccine preventable disease the dose is being administered
   * against.
   */
  readonly targetDisease?: CodeableConcept[];

  /**
   * Nominal position in a series.
   */
  readonly doseNumberPositiveInt?: number;

  /**
   * Nominal position in a series.
   */
  readonly doseNumberString?: string;

  /**
   * The recommended number of doses to achieve immunity.
   */
  readonly seriesDosesPositiveInt?: number;

  /**
   * The recommended number of doses to achieve immunity.
   */
  readonly seriesDosesString?: string;
}

/**
 * Describes the event of a patient being administered a vaccine or a
 * record of an immunization as reported by a patient, a clinician or
 * another party.
 */
export interface ImmunizationReaction {

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
   * Date of reaction to the immunization.
   */
  readonly date?: Date | string;

  /**
   * Details of the reaction.
   */
  readonly detail?: Reference;

  /**
   * Self-reported indicator.
   */
  readonly reported?: boolean;
}
