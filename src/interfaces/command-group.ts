import { ICommandHandler } from './command-handler';
import { ICommandPostMiddleware } from './command-post-middleware';
import { ICommandPreMiddleware } from './command-pre-middleware';

import { ICommandErrorMap } from './command-error-map';

export interface ICommandHandlerGroup {
  handlers: Array<ICommandHandler | ICommandHandlerGroup>;
  pre?: ICommandPreMiddleware[];
  post?: ICommandPostMiddleware[];
  errorMap?: ICommandErrorMap;

  flat (): ICommandHandler[];
}
