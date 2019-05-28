import { ErrorSeverity } from '../types/error-severity';

export interface ICommandErrorMapOptions {
  name: string;
  severity: ErrorSeverity;
  details: boolean;
}
