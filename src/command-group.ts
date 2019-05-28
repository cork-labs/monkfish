import { ICommandErrorMap } from './interfaces/command-error-map';
import { ICommandHandlerGroup } from './interfaces/command-group';
import { ICommandHandler } from './interfaces/command-handler';
import { ICommandPostMiddleware } from './interfaces/command-post-middleware';
import { ICommandPreMiddleware } from './interfaces/command-pre-middleware';

import { CommandHandler } from './command-handler';

export class CommandHandlerGroup implements ICommandHandlerGroup {
  public handlers: Array<ICommandHandler | ICommandHandlerGroup> = [];
  public pre: ICommandPreMiddleware[];
  public post: ICommandPostMiddleware[];
  public errorMap: ICommandErrorMap;

  constructor (options: ICommandHandlerGroup) {
    this.handlers = options.handlers;

    this.pre = options.pre || [];
    this.post = options.post || [];
    this.errorMap = options.errorMap || {};
  }

  public add (item: ICommandHandler | ICommandHandlerGroup) {
    this.handlers.push(item);
  }

  public flat (): ICommandHandler[] {

    const reducer = (handlers: ICommandHandler[], item: ICommandHandler | ICommandHandlerGroup): ICommandHandler[] => {
      const group = item as ICommandHandlerGroup;
      if (group.flat) {
        handlers.concat(group.flat().map((handler: ICommandHandler) => this.prepare(handler)));
      } else {
        handlers.push(this.prepare(item as ICommandHandler));
      }
      return handlers;
    };

    const start: ICommandHandler[] = [];
    return this.handlers.reduce(reducer, start);
  }

  private prepare (handler: ICommandHandler): ICommandHandler {
    const prepared = new CommandHandler(handler);

    if (this.pre.length) {
      prepared.pre = prepared.pre = [];
      prepared.pre.unshift(...this.pre);
    }

    if (this.post.length) {
      prepared.post = prepared.post = [];
      prepared.post.unshift(...this.post);
    }

    return prepared;
  }
}
