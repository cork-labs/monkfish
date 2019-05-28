import { ILogger } from '@cork-labs/monkfish-logger';

import { ICommandResult } from './command-result';
import { IContext } from './context';
import { IEvent } from './event';

export interface IEventListener {
  receive (event: IEvent, context: IContext, logger: ILogger): Promise<ICommandResult>;
}
