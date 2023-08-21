/*
 * Generated by @medplum/generator
 * Do not edit manually.
 */

import { Bot } from './Bot';
import { Device } from './Device';
import { Endpoint } from './Endpoint';
import { Meta } from './Meta';
import { Reference } from './Reference';

/**
 * Configuration details for an instance of the Medplum agent
 * application.
 */
export interface Agent {

  /**
   * This is a Agent resource
   */
  readonly resourceType: 'Agent';

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
   * The human readable friendly name of the agent.
   */
  name?: string;

  /**
   * The status of the agent.
   */
  status?: 'active' | 'off' | 'error';

  /**
   * Optional device resource representing the device running the agent.
   */
  device?: Reference<Device>;

  /**
   * The settings for the agent.
   */
  setting?: AgentSetting[];

  /**
   * Details where to send notifications when resources are received that
   * meet the criteria.
   */
  channel?: AgentChannel[];
}

/**
 * Details where to send notifications when resources are received that
 * meet the criteria.
 */
export interface AgentChannel {

  /**
   * The channel endpoint definition including protocol and network binding
   * details.
   */
  endpoint?: Reference<Endpoint>;

  /**
   * The target resource where channel messages will be delivered.
   */
  targetReference?: Reference<Bot>;

  /**
   * The target resource where channel messages will be delivered.
   */
  targetUrl?: string;
}

/**
 * The settings for the agent.
 */
export interface AgentSetting {

  /**
   * The setting name.
   */
  name?: string;

  /**
   * The setting value.
   */
  valueString?: string;

  /**
   * The setting value.
   */
  valueBoolean?: boolean;

  /**
   * The setting value.
   */
  valueDecimal?: number;

  /**
   * The setting value.
   */
  valueInteger?: number;
}
