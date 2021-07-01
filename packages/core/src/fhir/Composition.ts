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
 * A set of healthcare-related information that is assembled together
 * into a single logical package that provides a single coherent
 * statement of meaning, establishes its own context and that has
 * clinical attestation with regard to who is making the statement. A
 * Composition defines the structure and narrative content necessary for
 * a document. However, a Composition alone does not constitute a
 * document. Rather, the Composition must be the first entry in a Bundle
 * where Bundle.type=document, and any other resources referenced from
 * Composition must be included as subsequent entries in the Bundle (for
 * example Patient, Practitioner, Encounter, etc.).
 */
export interface Composition {

  /**
   * This is a Composition resource
   */
  readonly resourceType: 'Composition';

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
   * A version-independent identifier for the Composition. This identifier
   * stays constant as the composition is changed over time.
   */
  readonly identifier?: Identifier;

  /**
   * The workflow/clinical status of this composition. The status is a
   * marker for the clinical standing of the document.
   */
  readonly status?: string;

  /**
   * Specifies the particular kind of composition (e.g. History and
   * Physical, Discharge Summary, Progress Note). This usually equates to
   * the purpose of making the composition.
   */
  readonly type?: CodeableConcept;

  /**
   * A categorization for the type of the composition - helps for indexing
   * and searching. This may be implied by or derived from the code
   * specified in the Composition Type.
   */
  readonly category?: CodeableConcept[];

  /**
   * Who or what the composition is about. The composition can be about a
   * person, (patient or healthcare practitioner), a device (e.g. a
   * machine) or even a group of subjects (such as a document about a herd
   * of livestock, or a set of patients that share a common exposure).
   */
  readonly subject?: Reference;

  /**
   * Describes the clinical encounter or type of care this documentation is
   * associated with.
   */
  readonly encounter?: Reference;

  /**
   * The composition editing time, when the composition was last logically
   * changed by the author.
   */
  readonly date?: Date | string;

  /**
   * Identifies who is responsible for the information in the composition,
   * not necessarily who typed it in.
   */
  readonly author?: Reference[];

  /**
   * Official human-readable label for the composition.
   */
  readonly title?: string;

  /**
   * The code specifying the level of confidentiality of the Composition.
   */
  readonly confidentiality?: string;

  /**
   * A participant who has attested to the accuracy of the
   * composition/document.
   */
  readonly attester?: CompositionAttester[];

  /**
   * Identifies the organization or group who is responsible for ongoing
   * maintenance of and access to the composition/document information.
   */
  readonly custodian?: Reference;

  /**
   * Relationships that this composition has with other compositions or
   * documents that already exist.
   */
  readonly relatesTo?: CompositionRelatesTo[];

  /**
   * The clinical service, such as a colonoscopy or an appendectomy, being
   * documented.
   */
  readonly event?: CompositionEvent[];

  /**
   * The root of the sections that make up the composition.
   */
  readonly section?: CompositionSection[];
}

/**
 * A set of healthcare-related information that is assembled together
 * into a single logical package that provides a single coherent
 * statement of meaning, establishes its own context and that has
 * clinical attestation with regard to who is making the statement. A
 * Composition defines the structure and narrative content necessary for
 * a document. However, a Composition alone does not constitute a
 * document. Rather, the Composition must be the first entry in a Bundle
 * where Bundle.type=document, and any other resources referenced from
 * Composition must be included as subsequent entries in the Bundle (for
 * example Patient, Practitioner, Encounter, etc.).
 */
export interface CompositionAttester {

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
   * The type of attestation the authenticator offers.
   */
  readonly mode?: string;

  /**
   * When the composition was attested by the party.
   */
  readonly time?: Date | string;

  /**
   * Who attested the composition in the specified way.
   */
  readonly party?: Reference;
}

/**
 * A set of healthcare-related information that is assembled together
 * into a single logical package that provides a single coherent
 * statement of meaning, establishes its own context and that has
 * clinical attestation with regard to who is making the statement. A
 * Composition defines the structure and narrative content necessary for
 * a document. However, a Composition alone does not constitute a
 * document. Rather, the Composition must be the first entry in a Bundle
 * where Bundle.type=document, and any other resources referenced from
 * Composition must be included as subsequent entries in the Bundle (for
 * example Patient, Practitioner, Encounter, etc.).
 */
export interface CompositionEvent {

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
   * This list of codes represents the main clinical acts, such as a
   * colonoscopy or an appendectomy, being documented. In some cases, the
   * event is inherent in the typeCode, such as a &quot;History and Physical
   * Report&quot; in which the procedure being documented is necessarily a
   * &quot;History and Physical&quot; act.
   */
  readonly code?: CodeableConcept[];

  /**
   * The period of time covered by the documentation. There is no assertion
   * that the documentation is a complete representation for this period,
   * only that it documents events during this time.
   */
  readonly period?: Period;

  /**
   * The description and/or reference of the event(s) being documented. For
   * example, this could be used to document such a colonoscopy or an
   * appendectomy.
   */
  readonly detail?: Reference[];
}

/**
 * A set of healthcare-related information that is assembled together
 * into a single logical package that provides a single coherent
 * statement of meaning, establishes its own context and that has
 * clinical attestation with regard to who is making the statement. A
 * Composition defines the structure and narrative content necessary for
 * a document. However, a Composition alone does not constitute a
 * document. Rather, the Composition must be the first entry in a Bundle
 * where Bundle.type=document, and any other resources referenced from
 * Composition must be included as subsequent entries in the Bundle (for
 * example Patient, Practitioner, Encounter, etc.).
 */
export interface CompositionRelatesTo {

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
   * The type of relationship that this composition has with anther
   * composition or document.
   */
  readonly code?: string;

  /**
   * The target composition/document of this relationship.
   */
  readonly targetIdentifier?: Identifier;

  /**
   * The target composition/document of this relationship.
   */
  readonly targetReference?: Reference;
}

/**
 * A set of healthcare-related information that is assembled together
 * into a single logical package that provides a single coherent
 * statement of meaning, establishes its own context and that has
 * clinical attestation with regard to who is making the statement. A
 * Composition defines the structure and narrative content necessary for
 * a document. However, a Composition alone does not constitute a
 * document. Rather, the Composition must be the first entry in a Bundle
 * where Bundle.type=document, and any other resources referenced from
 * Composition must be included as subsequent entries in the Bundle (for
 * example Patient, Practitioner, Encounter, etc.).
 */
export interface CompositionSection {

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
   * The label for this particular section.  This will be part of the
   * rendered content for the document, and is often used to build a table
   * of contents.
   */
  readonly title?: string;

  /**
   * A code identifying the kind of content contained within the section.
   * This must be consistent with the section title.
   */
  readonly code?: CodeableConcept;

  /**
   * Identifies who is responsible for the information in this section, not
   * necessarily who typed it in.
   */
  readonly author?: Reference[];

  /**
   * The actual focus of the section when it is not the subject of the
   * composition, but instead represents something or someone associated
   * with the subject such as (for a patient subject) a spouse, parent,
   * fetus, or donor. If not focus is specified, the focus is assumed to be
   * focus of the parent section, or, for a section in the Composition
   * itself, the subject of the composition. Sections with a focus SHALL
   * only include resources where the logical subject (patient, subject,
   * focus, etc.) matches the section focus, or the resources have no
   * logical subject (few resources).
   */
  readonly focus?: Reference;

  /**
   * A human-readable narrative that contains the attested content of the
   * section, used to represent the content of the resource to a human. The
   * narrative need not encode all the structured data, but is required to
   * contain sufficient detail to make it &quot;clinically safe&quot; for a human to
   * just read the narrative.
   */
  readonly text?: Narrative;

  /**
   * How the entry list was prepared - whether it is a working list that is
   * suitable for being maintained on an ongoing basis, or if it represents
   * a snapshot of a list of items from another source, or whether it is a
   * prepared list where items may be marked as added, modified or deleted.
   */
  readonly mode?: string;

  /**
   * Specifies the order applied to the items in the section entries.
   */
  readonly orderedBy?: CodeableConcept;

  /**
   * A reference to the actual resource from which the narrative in the
   * section is derived.
   */
  readonly entry?: Reference[];

  /**
   * If the section is empty, why the list is empty. An empty section
   * typically has some text explaining the empty reason.
   */
  readonly emptyReason?: CodeableConcept;

  /**
   * A nested sub-section within this section.
   */
  readonly section?: CompositionSection[];
}
