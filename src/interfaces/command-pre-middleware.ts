import { ILogger } from '@cork-labs/monkfish-logger';

import { ICommand } from './command';
import { IContext } from './context';

export interface ICommandPreMiddleware {
  handle (command: ICommand, context: IContext, logger: ILogger): Promise<void>;
}
