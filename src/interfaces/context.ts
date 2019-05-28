import { ICommand } from './command';
import { ICommandResult } from './command-result';

export interface IContext {
  command?: ICommand;
  [key: string]: any;
}
