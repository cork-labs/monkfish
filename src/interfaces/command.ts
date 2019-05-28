export interface ICommandData {
  [key: string]: any;
}

export interface ICommandParams {
  [key: string]: any;
}

export interface ICommand {
  name: string;
  data: ICommandData;
  params: ICommandData;
  date: Date;
}
