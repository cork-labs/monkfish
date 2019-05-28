import { IEventListener } from './interfaces/event-listener';

interface IPatternListeners {
  regexp: RegExp;
  listeners: IEventListener[];
}

export class EventBusListeners {

  private map: { [pattern: string]: IPatternListeners } = { };

  // -- public

  public add (pattern: string, listener: IEventListener) {
    if (!this.map[pattern]) {
      this.map[pattern] = {
        regexp: new RegExp(pattern),
        listeners: []
      };
    }
    this.map[pattern].listeners.push(listener);
  }

  public remove (pattern: string, listener: IEventListener) {
    this.map[pattern].listeners = this.map[pattern].listeners.filter((l: IEventListener) => l !== listener);
    if (!this.map[pattern].listeners.length) {
      delete this.map[pattern];
    }
  }

  public resolve (name: string): IEventListener[] {
    const patterns = Object.keys(this.map);
    return patterns.reduce((resolved: IEventListener[], pattern: string): IEventListener[] => {
      const pat = this.map[pattern];
      const match = pat.regexp.test(name);
      return match ? resolved.concat(pat.listeners) : resolved;
    }, []);
  }
}
