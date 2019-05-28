import { ILogger } from '@cork-labs/monkfish-logger';

import { IContext } from './context';
import { IEvent } from './event';
import { IEventListener } from './event-listener';

export interface IEventBus {
  receive (event: IEvent, context: IContext, logger: ILogger): void;
  addListener (pattern: string, listener: IEventListener): void;
  removeListener (pattern: string, listener: IEventListener): void;
}
