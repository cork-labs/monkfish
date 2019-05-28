import { ICommandController } from './command-controller';
import { ICommandPostMiddleware } from './command-post-middleware';
import { ICommandPreMiddleware } from './command-pre-middleware';

import { ICommandErrorMap } from './command-error-map';

export interface ICommandHandler {
  name: string;
  controller: ICommandController;
  pre?: ICommandPreMiddleware[];
  post?: ICommandPostMiddleware[];
  errorMap?: ICommandErrorMap;
}
