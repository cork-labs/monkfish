import { IEvent, IEventData } from './interfaces/event';

import _ from 'lodash';

export class Event implements IEvent {
  public name: string;
  public data: IEventData;
  public date: Date;

  constructor (name: string, data: IEventData, date: Date) {
    this.name = name;
    this.data = _.cloneDeep(data) || {};
    this.date = date;
  }
}
