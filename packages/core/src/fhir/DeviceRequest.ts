/*
 * Generated by @medplum/generator
 * Do not edit manually.
 */

import { Annotation } from './Annotation';
import { CareTeam } from './CareTeam';
import { ClaimResponse } from './ClaimResponse';
import { CodeableConcept } from './CodeableConcept';
import { Condition } from './Condition';
import { Coverage } from './Coverage';
import { Device } from './Device';
import { DiagnosticReport } from './DiagnosticReport';
import { DocumentReference } from './DocumentReference';
import { Encounter } from './Encounter';
import { Extension } from './Extension';
import { Group } from './Group';
import { HealthcareService } from './HealthcareService';
import { Identifier } from './Identifier';
import { Location } from './Location';
import { Meta } from './Meta';
import { Narrative } from './Narrative';
import { Observation } from './Observation';
import { Organization } from './Organization';
import { Patient } from './Patient';
import { Period } from './Period';
import { Practitioner } from './Practitioner';
import { PractitionerRole } from './PractitionerRole';
import { Provenance } from './Provenance';
import { Quantity } from './Quantity';
import { Range } from './Range';
import { Reference } from './Reference';
import { RelatedPerson } from './RelatedPerson';
import { Resource } from './Resource';
import { Timing } from './Timing';

/**
 * Represents a request for a patient to employ a medical device. The
 * device may be an implantable device, or an external assistive device,
 * such as a walker.
 */
export interface DeviceRequest {

  /**
   * This is a DeviceRequest resource
   */
  readonly resourceType: 'DeviceRequest';

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
   * Identifiers assigned to this order by the orderer or by the receiver.
   */
  readonly identifier?: Identifier[];

  /**
   * The URL pointing to a FHIR-defined protocol, guideline, orderset or
   * other definition that is adhered to in whole or in part by this
   * DeviceRequest.
   */
  readonly instantiatesCanonical?: string[];

  /**
   * The URL pointing to an externally maintained protocol, guideline,
   * orderset or other definition that is adhered to in whole or in part by
   * this DeviceRequest.
   */
  readonly instantiatesUri?: string[];

  /**
   * Plan/proposal/order fulfilled by this request.
   */
  readonly basedOn?: Reference<Resource>[];

  /**
   * The request takes the place of the referenced completed or terminated
   * request(s).
   */
  readonly priorRequest?: Reference<Resource>[];

  /**
   * Composite request this is part of.
   */
  readonly groupIdentifier?: Identifier;

  /**
   * The status of the request.
   */
  readonly status?: string;

  /**
   * Whether the request is a proposal, plan, an original order or a reflex
   * order.
   */
  readonly intent?: string;

  /**
   * Indicates how quickly the {{title}} should be addressed with respect
   * to other requests.
   */
  readonly priority?: string;

  /**
   * The details of the device to be used.
   */
  readonly codeReference?: Reference<Device>;

  /**
   * The details of the device to be used.
   */
  readonly codeCodeableConcept?: CodeableConcept;

  /**
   * Specific parameters for the ordered item.  For example, the prism
   * value for lenses.
   */
  readonly parameter?: DeviceRequestParameter[];

  /**
   * The patient who will use the device.
   */
  readonly subject?: Reference<Patient | Group | Location | Device>;

  /**
   * An encounter that provides additional context in which this request is
   * made.
   */
  readonly encounter?: Reference<Encounter>;

  /**
   * The timing schedule for the use of the device. The Schedule data type
   * allows many different expressions, for example. &quot;Every 8 hours&quot;;
   * &quot;Three times a day&quot;; &quot;1/2 an hour before breakfast for 10 days from
   * 23-Dec 2011:&quot;; &quot;15 Oct 2013, 17 Oct 2013 and 1 Nov 2013&quot;.
   */
  readonly occurrenceDateTime?: string;

  /**
   * The timing schedule for the use of the device. The Schedule data type
   * allows many different expressions, for example. &quot;Every 8 hours&quot;;
   * &quot;Three times a day&quot;; &quot;1/2 an hour before breakfast for 10 days from
   * 23-Dec 2011:&quot;; &quot;15 Oct 2013, 17 Oct 2013 and 1 Nov 2013&quot;.
   */
  readonly occurrencePeriod?: Period;

  /**
   * The timing schedule for the use of the device. The Schedule data type
   * allows many different expressions, for example. &quot;Every 8 hours&quot;;
   * &quot;Three times a day&quot;; &quot;1/2 an hour before breakfast for 10 days from
   * 23-Dec 2011:&quot;; &quot;15 Oct 2013, 17 Oct 2013 and 1 Nov 2013&quot;.
   */
  readonly occurrenceTiming?: Timing;

  /**
   * When the request transitioned to being actionable.
   */
  readonly authoredOn?: string;

  /**
   * The individual who initiated the request and has responsibility for
   * its activation.
   */
  readonly requester?: Reference<Device | Practitioner | PractitionerRole | Organization>;

  /**
   * Desired type of performer for doing the diagnostic testing.
   */
  readonly performerType?: CodeableConcept;

  /**
   * The desired performer for doing the diagnostic testing.
   */
  readonly performer?: Reference<Practitioner | PractitionerRole | Organization | CareTeam | HealthcareService | Patient | Device | RelatedPerson>;

  /**
   * Reason or justification for the use of this device.
   */
  readonly reasonCode?: CodeableConcept[];

  /**
   * Reason or justification for the use of this device.
   */
  readonly reasonReference?: Reference<Condition | Observation | DiagnosticReport | DocumentReference>[];

  /**
   * Insurance plans, coverage extensions, pre-authorizations and/or
   * pre-determinations that may be required for delivering the requested
   * service.
   */
  readonly insurance?: Reference<Coverage | ClaimResponse>[];

  /**
   * Additional clinical information about the patient that may influence
   * the request fulfilment.  For example, this may include where on the
   * subject's body the device will be used (i.e. the target site).
   */
  readonly supportingInfo?: Reference<Resource>[];

  /**
   * Details about this request that were not represented at all or
   * sufficiently in one of the attributes provided in a class. These may
   * include for example a comment, an instruction, or a note associated
   * with the statement.
   */
  readonly note?: Annotation[];

  /**
   * Key events in the history of the request.
   */
  readonly relevantHistory?: Reference<Provenance>[];
}

/**
 * Specific parameters for the ordered item.  For example, the prism
 * value for lenses.
 */
export interface DeviceRequestParameter {

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
   * A code or string that identifies the device detail being asserted.
   */
  readonly code?: CodeableConcept;

  /**
   * The value of the device detail.
   */
  readonly valueCodeableConcept?: CodeableConcept;

  /**
   * The value of the device detail.
   */
  readonly valueQuantity?: Quantity;

  /**
   * The value of the device detail.
   */
  readonly valueRange?: Range;

  /**
   * The value of the device detail.
   */
  readonly valueBoolean?: boolean;
}
