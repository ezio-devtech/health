/*
 * Generated by @medplum/generator
 * Do not edit manually.
 */

import { Annotation } from './Annotation';
import { CodeableConcept } from './CodeableConcept';
import { Encounter } from './Encounter';
import { Extension } from './Extension';
import { Identifier } from './Identifier';
import { Meta } from './Meta';
import { Narrative } from './Narrative';
import { Patient } from './Patient';
import { Practitioner } from './Practitioner';
import { PractitionerRole } from './PractitionerRole';
import { Quantity } from './Quantity';
import { Reference } from './Reference';
import { Resource } from './Resource';

/**
 * An authorization for the provision of glasses and/or contact lenses to
 * a patient.
 */
export interface VisionPrescription {

  /**
   * This is a VisionPrescription resource
   */
  readonly resourceType: 'VisionPrescription';

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
   * A unique identifier assigned to this vision prescription.
   */
  readonly identifier?: Identifier[];

  /**
   * The status of the resource instance.
   */
  readonly status?: string;

  /**
   * The date this resource was created.
   */
  readonly created?: string;

  /**
   * A resource reference to the person to whom the vision prescription
   * applies.
   */
  readonly patient?: Reference<Patient>;

  /**
   * A reference to a resource that identifies the particular occurrence of
   * contact between patient and health care provider during which the
   * prescription was issued.
   */
  readonly encounter?: Reference<Encounter>;

  /**
   * The date (and perhaps time) when the prescription was written.
   */
  readonly dateWritten?: string;

  /**
   * The healthcare professional responsible for authorizing the
   * prescription.
   */
  readonly prescriber?: Reference<Practitioner | PractitionerRole>;

  /**
   * Contain the details of  the individual lens specifications and serves
   * as the authorization for the fullfillment by certified professionals.
   */
  readonly lensSpecification?: VisionPrescriptionLensSpecification[];
}

/**
 * Contain the details of  the individual lens specifications and serves
 * as the authorization for the fullfillment by certified professionals.
 */
export interface VisionPrescriptionLensSpecification {

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
   * Identifies the type of vision correction product which is required for
   * the patient.
   */
  readonly product?: CodeableConcept;

  /**
   * The eye for which the lens specification applies.
   */
  readonly eye?: string;

  /**
   * Lens power measured in dioptres (0.25 units).
   */
  readonly sphere?: number;

  /**
   * Power adjustment for astigmatism measured in dioptres (0.25 units).
   */
  readonly cylinder?: number;

  /**
   * Adjustment for astigmatism measured in integer degrees.
   */
  readonly axis?: number;

  /**
   * Allows for adjustment on two axis.
   */
  readonly prism?: VisionPrescriptionLensSpecificationPrism[];

  /**
   * Power adjustment for multifocal lenses measured in dioptres (0.25
   * units).
   */
  readonly add?: number;

  /**
   * Contact lens power measured in dioptres (0.25 units).
   */
  readonly power?: number;

  /**
   * Back curvature measured in millimetres.
   */
  readonly backCurve?: number;

  /**
   * Contact lens diameter measured in millimetres.
   */
  readonly diameter?: number;

  /**
   * The recommended maximum wear period for the lens.
   */
  readonly duration?: Quantity;

  /**
   * Special color or pattern.
   */
  readonly color?: string;

  /**
   * Brand recommendations or restrictions.
   */
  readonly brand?: string;

  /**
   * Notes for special requirements such as coatings and lens materials.
   */
  readonly note?: Annotation[];
}

/**
 * Allows for adjustment on two axis.
 */
export interface VisionPrescriptionLensSpecificationPrism {

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
   * Amount of prism to compensate for eye alignment in fractional units.
   */
  readonly amount?: number;

  /**
   * The relative base, or reference lens edge, for the prism.
   */
  readonly base?: string;
}
