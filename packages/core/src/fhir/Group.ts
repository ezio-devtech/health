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
import { Quantity } from './Quantity';
import { Range } from './Range';
import { Reference } from './Reference';
import { Resource } from './Resource';

/**
 * Represents a defined collection of entities that may be discussed or
 * acted upon collectively but which are not expected to act
 * collectively, and are not formally or legally recognized; i.e. a
 * collection of entities that isn't an Organization.
 */
export interface Group {

  /**
   * This is a Group resource
   */
  readonly resourceType: 'Group';

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
   * A unique business identifier for this group.
   */
  readonly identifier?: Identifier[];

  /**
   * Indicates whether the record for the group is available for use or is
   * merely being retained for historical purposes.
   */
  readonly active?: boolean;

  /**
   * Identifies the broad classification of the kind of resources the group
   * includes.
   */
  readonly type?: string;

  /**
   * If true, indicates that the resource refers to a specific group of
   * real individuals.  If false, the group defines a set of intended
   * individuals.
   */
  readonly actual?: boolean;

  /**
   * Provides a specific type of resource the group includes; e.g. &quot;cow&quot;,
   * &quot;syringe&quot;, etc.
   */
  readonly code?: CodeableConcept;

  /**
   * A label assigned to the group for human identification and
   * communication.
   */
  readonly name?: string;

  /**
   * A count of the number of resource instances that are part of the
   * group.
   */
  readonly quantity?: number;

  /**
   * Entity responsible for defining and maintaining Group characteristics
   * and/or registered members.
   */
  readonly managingEntity?: Reference;

  /**
   * Identifies traits whose presence r absence is shared by members of the
   * group.
   */
  readonly characteristic?: GroupCharacteristic[];

  /**
   * Identifies the resource instances that are members of the group.
   */
  readonly member?: GroupMember[];
}

/**
 * Represents a defined collection of entities that may be discussed or
 * acted upon collectively but which are not expected to act
 * collectively, and are not formally or legally recognized; i.e. a
 * collection of entities that isn't an Organization.
 */
export interface GroupCharacteristic {

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
   * A code that identifies the kind of trait being asserted.
   */
  readonly code?: CodeableConcept;

  /**
   * The value of the trait that holds (or does not hold - see 'exclude')
   * for members of the group.
   */
  readonly valueCodeableConcept?: CodeableConcept;

  /**
   * The value of the trait that holds (or does not hold - see 'exclude')
   * for members of the group.
   */
  readonly valueBoolean?: boolean;

  /**
   * The value of the trait that holds (or does not hold - see 'exclude')
   * for members of the group.
   */
  readonly valueQuantity?: Quantity;

  /**
   * The value of the trait that holds (or does not hold - see 'exclude')
   * for members of the group.
   */
  readonly valueRange?: Range;

  /**
   * The value of the trait that holds (or does not hold - see 'exclude')
   * for members of the group.
   */
  readonly valueReference?: Reference;

  /**
   * If true, indicates the characteristic is one that is NOT held by
   * members of the group.
   */
  readonly exclude?: boolean;

  /**
   * The period over which the characteristic is tested; e.g. the patient
   * had an operation during the month of June.
   */
  readonly period?: Period;
}

/**
 * Represents a defined collection of entities that may be discussed or
 * acted upon collectively but which are not expected to act
 * collectively, and are not formally or legally recognized; i.e. a
 * collection of entities that isn't an Organization.
 */
export interface GroupMember {

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
   * A reference to the entity that is a member of the group. Must be
   * consistent with Group.type. If the entity is another group, then the
   * type must be the same.
   */
  readonly entity?: Reference;

  /**
   * The period that the member was in the group, if known.
   */
  readonly period?: Period;

  /**
   * A flag to indicate that the member is no longer in the group, but
   * previously may have been a member.
   */
  readonly inactive?: boolean;
}
