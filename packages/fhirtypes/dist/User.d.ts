/*
 * Generated by @medplum/generator
 * Do not edit manually.
 */

import { Meta } from './Meta';

/**
 * OAuth user.
 */
export interface User {

  /**
   * This is a User resource
   */
  readonly resourceType: 'User';

  /**
   * The logical id of the resource, as used in the URL for the resource.
   * Once assigned, this value never changes.
   */
  id?: string;

  /**
   * The metadata about the resource. This is content that is maintained by
   * the infrastructure. Changes to the content might not always be
   * associated with version changes to the resource.
   */
  meta?: Meta;

  /**
   * A reference to a set of rules that were followed when the resource was
   * constructed, and which must be understood when processing the content.
   * Often, this is a reference to an implementation guide that defines the
   * special rules along with other profiles etc.
   */
  implicitRules?: string;

  /**
   * The base language in which the resource is written.
   */
  language?: string;

  /**
   * The email address that uniquely identifies the user.  This email
   * address must be globally unique within the server.
   */
  email?: string;

  /**
   * Whether this user is a system administrator.
   */
  admin?: boolean;

  /**
   * Encrypted hash of the user's password.
   */
  passwordHash?: string;
}
