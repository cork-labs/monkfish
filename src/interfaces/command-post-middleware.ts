import { ILogger } from '@cork-labs/monkfish-logger';

import { ICommand } from './command';
import { ICommandResult } from './command-result';
import { IContext } from './context';

export interface ICommandPostMiddleware {
  handle (result: ICommandResult, command: ICommand, context: IContext, logger: ILogger): Promise<void>;
}
