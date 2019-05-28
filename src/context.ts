import { IContext } from './interfaces/context';

export class Context implements IContext {
  constructor (attributes: any) {
    Object.assign(this, attributes);
  }
}
