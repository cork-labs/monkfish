export interface ICommandResultData {
  [key: string]: any;
}

export interface ICommandResultMeta {
  [key: string]: any;
}

export interface ICommandResult {
  data: ICommandResultData;
  meta: ICommandResultMeta;
}
