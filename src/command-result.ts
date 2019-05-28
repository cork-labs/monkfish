import { ICommandResult } from './interfaces/command-result';
import { ICommandResultData } from './interfaces/command-result';
import { ICommandResultMeta } from './interfaces/command-result';

const _ = require('lodash');

export class CommandResult implements ICommandResult {
  public data: ICommandResultData;
  public meta: ICommandResultMeta;

  constructor (data: ICommandResultData, meta: ICommandResultMeta) {
    this.data = _.cloneDeep(data); // @xx deep freeze
    this.meta = _.cloneDeep(meta);
  }
}
