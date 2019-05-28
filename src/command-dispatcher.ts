import { ILogger } from '@cork-labs/monkfish-logger';

import { ICommandHandler } from '.';
import { ICommand } from './interfaces/command';
import { ICommandPostMiddleware } from './interfaces/command-post-middleware';
import { ICommandPreMiddleware } from './interfaces/command-pre-middleware';
import { ICommandResult } from './interfaces/command-result';
import { IContext } from './interfaces/context';

export class CommandDispatcher {

  // -- public

  public async dispatch (
    handler: ICommandHandler,
    command: ICommand,
    context: IContext,
    logger: ILogger
  ): Promise<ICommandResult> {

    const pre = handler.pre && handler.pre.slice(0);
    await this.preDispatch(command, context, logger, pre);

    const result = await handler.controller.handle(command, context, logger);

    const post = handler.post && handler.post.slice(0);
    this.postDispatch(result, command, context, logger, post);

    return result;
  }

  private async preDispatch (
    command: ICommand,
    context: IContext,
    logger: ILogger,
    pipeline?: ICommandPreMiddleware[]
  ): Promise<void> {
    const middleware = pipeline && pipeline.shift();
    if (!middleware) {
      return;
    }
    await middleware.handle(command, context, logger);
    await this.preDispatch(command, context, logger, pipeline);
  }

  private async postDispatch (
    result: ICommandResult,
    command: ICommand,
    context: IContext,
    logger: ILogger,
    pipeline?: ICommandPostMiddleware[]
  ): Promise<void> {
    const middleware = pipeline && pipeline.shift();
    if (!middleware) {
      return;
    }
    try {
      await middleware.handle(result, command, context, logger);
    } catch (err) {
      logger.error('monkfish.application.post-dispatch', { middleware: middleware.constructor.name }, err);
    }
    await this.postDispatch(result, command, context, logger, pipeline);
  }
}
