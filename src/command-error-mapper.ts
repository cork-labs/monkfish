import { ICommandErrorMapOptions } from './interfaces/command-error-map-options';

import { ApplicationError } from './errors/application-error';
import { ICommandErrorMap } from './interfaces/command-error-map';

export class CommandErrorMapper {

  private errors: ICommandErrorMap = {};

  public merge (map: any) {
    this.errors = Object.assign(this.errors, map);
  }

  public set (name: string, options: ICommandErrorMapOptions) {
    this.errors[name] = options;
  }

  public get (name: string): ICommandErrorMapOptions | undefined {
    return this.errors[name];
  }

  public map (err: Error, errorMap: ICommandErrorMap, defaultError: ICommandErrorMapOptions): ApplicationError {
    try {
      const possible = Object.assign(this.errors, errorMap);
      const error = possible[err.name] || defaultError;
      return ApplicationError.wrap(err, error.name, error.severity);
    } catch (error) {
      return new ApplicationError(error.name, 'error', error.stack, err);
    }
  }
}
