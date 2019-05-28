import { ILogger } from '@cork-labs/monkfish-logger';

import { ICommand } from '..';
import { ICommandResult } from './command-result';
import { IContext } from './context';

export interface ICommandController {
  handle (command: ICommand, context: IContext, logger: ILogger): Promise<ICommandResult>;
}
