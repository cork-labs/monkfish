import { ErrorSeverity } from '../enums/error-severity';

export class ApplicationError extends Error {

  public static wrap (err: Error, name: string, severity?: ErrorSeverity): ApplicationError {
    let errorSeverity = severity;
    if (!severity && err instanceof ApplicationError) {
      errorSeverity = err.severity || ErrorSeverity.Error;
    }
    const details = err instanceof ApplicationError && err.details;
    return new ApplicationError(name, errorSeverity, details, err);
  }

  public severity?: ErrorSeverity;
  public details?: any;
  public parent?: Error;

  constructor (name: string, severity?: ErrorSeverity, details?: any, parent?: Error) {
    super(name);
    this.name = name;
    this.severity = severity || ErrorSeverity.Error;
    this.details = details;
    this.parent = parent;
  }
}
