export interface IEventData {
  [key: string]: any;
}

export interface IEvent {
  name: string;
  data: IEventData;
  date: Date;
}
