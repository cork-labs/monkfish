import { ICommand } from './interfaces/command';
import { ICommandData } from './interfaces/command';
import { ICommandParams } from './interfaces/command';

const _ = require('lodash');

export class Command implements ICommand {
  public name: string;
  public data: any;
  public params: any;
  public date: Date;

  constructor (name: string, data: ICommandData, params: ICommandParams, date: Date) {
    this.name = name;
    this.data = _.cloneDeep(data);
    this.params = _.cloneDeep(params);
    this.date = date;
  }
}
