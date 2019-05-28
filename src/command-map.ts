import { ErrorSeverity } from './enums/error-severity';
import { ApplicationError} from './errors/application-error';
import { ICommandHandler } from './interfaces/command-handler';

export class CommandMap {

  private map: { [name: string]: ICommandHandler } = { };

  // -- public

  public add (handler: ICommandHandler) {
    if (this.map[handler.name]) {
      throw new Error(`Duplicate command name ${handler.name}.`);
    }

    this.map[handler.name] = handler;
  }

  public resolve (name: string): ICommandHandler {
    const handler = this.map[name];

    if (!handler) {
      throw new ApplicationError('monkfish.application.command.unknown', ErrorSeverity.Error, {
        command: name
      });
    }

    return handler;
  }
}
