
import { ICommandController } from './interfaces/command-controller';
import { ICommandHandler } from './interfaces/command-handler';
import { ICommandPostMiddleware } from './interfaces/command-post-middleware';
import { ICommandPreMiddleware } from './interfaces/command-pre-middleware';

import { ICommandErrorMap } from './interfaces/command-error-map';

export class CommandHandler implements ICommandHandler {
  public name: string;
  public controller: ICommandController;
  public pre?: ICommandPreMiddleware[];
  public post?: ICommandPostMiddleware[];
  public errorMap?: ICommandErrorMap;

  constructor (options: ICommandHandler) {
    this.name = name;
    this.controller = options.controller;
    this.pre = options.pre;
    this.post = options.post;
    this.errorMap = options.errorMap;
  }
}
