import { ILogger } from '@cork-labs/monkfish-logger';

import { IContext } from './context';

import { ApplicationError } from '../errors/application-error';

export interface ICommandErrorHandler {
  handle (error: ApplicationError, context: IContext, logger: ILogger): Promise<void>;
}
