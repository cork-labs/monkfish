import { ILogger } from '@cork-labs/monkfish-logger';

import { ICommandErrorHandler } from './interfaces/command-error-handler';
import { IContext } from './interfaces/context';

import { ApplicationError } from './errors/application-error';

export class ErrorDispatcher {

  public async dispatch (
    error: ApplicationError,
    context: IContext,
    logger: ILogger,
    middlewares: ICommandErrorHandler[]
  ) {
    await this.pipeline(error, context, logger, middlewares.slice(0));
    throw error;
  }

  private async pipeline (
    error: Error,
    context: IContext,
    logger: ILogger,
    middlewares: ICommandErrorHandler[]
  ): Promise<void> {
    const middleware = middlewares.shift();
    if (!middleware) {
      return;
    }
    try {
      await middleware.handle(error, context, logger);
    } catch (err) {
      logger.error('monkfish.application.error-dispatch', { middleware: middleware.constructor.name }, err);
    } finally {
      this.pipeline(error, context, logger, middlewares);
    }
  }
}
