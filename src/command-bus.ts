import { ILogger } from '@cork-labs/monkfish-logger';

import { ICommand } from './interfaces/command';
import { ICommandBus } from './interfaces/command-bus';
import { ICommandErrorHandler } from './interfaces/command-error-handler';
import { ICommandErrorMapOptions } from './interfaces/command-error-map-options';
import { ICommandHandlerGroup } from './interfaces/command-group';
import { ICommandHandler } from './interfaces/command-handler';
import { ICommandResult } from './interfaces/command-result';
import { IContext } from './interfaces/context';

import { CommandDispatcher } from './command-dispatcher';
import { CommandErrorMapper } from './command-error-mapper';
import { CommandMap } from './command-map';
import { ErrorDispatcher } from './error-dispatcher';

export class CommandBus implements ICommandBus {

  private commandMap: CommandMap;
  private commandDispatcher: CommandDispatcher;
  private errorDispatcher: ErrorDispatcher;

  private errorMap: CommandErrorMapper;
  private defaultError: ICommandErrorMapOptions;
  private errorHandlers: ICommandErrorHandler[] = [];

  constructor () {
    this.commandMap = new CommandMap();
    this.commandDispatcher = new CommandDispatcher();
    this.errorDispatcher = new ErrorDispatcher();

    this.errorMap = new CommandErrorMapper();
    this.defaultError = {
      name: 'monkfish.command.bus.unexpected',
      severity: 'error',
      details: false
    };
  }

  public setDefaultErrorName (name: string): void {
    this.defaultError.name = name;
  }

  public addErrorHandler (handler: ICommandErrorHandler): void {
    this.errorHandlers.unshift(handler);
  }

  public addHandler (handler: ICommandHandler): void {
    this.commandMap.add(handler);
  }

  public addHandlerGroup (group: ICommandHandlerGroup): void {
    group.flat().forEach((handler: ICommandHandler) => this.addHandler(handler));
  }

  public async handle (command: ICommand, context: IContext, logger: ILogger): Promise<ICommandResult> {

    logger.info('monkfish.command-bus.handle', { command, context });

    const handler = this.commandMap.resolve(command.name);

    try {
      return this.commandDispatcher.dispatch(handler, command, context, logger);
    } catch (err) {
      logger.error('monkfish.command-bus.handle', { handler }, err);
      const errorMap = handler.errorMap || {};
      const error = this.errorMap.map(err, errorMap, this.defaultError);
      this.errorDispatcher.dispatch(error, context, logger, this.errorHandlers);
      throw error;
    }
  }
}
