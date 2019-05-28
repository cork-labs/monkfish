import { ILogger } from '@cork-labs/monkfish-logger';

import { ICommand } from './command';
import { ICommandErrorHandler } from './command-error-handler';
import { ICommandHandlerGroup } from './command-group';
import { ICommandHandler } from './command-handler';
import { ICommandResult } from './command-result';
import { IContext } from './context';

export interface ICommandBus {
  setDefaultErrorName (name: string): void;
  addErrorHandler (handler: ICommandErrorHandler): void;
  addHandler (handler: ICommandHandler): void;
  addHandlerGroup (group: ICommandHandlerGroup): void;
  handle (command: ICommand, context: IContext, logger: ILogger): Promise<ICommandResult>;
}
