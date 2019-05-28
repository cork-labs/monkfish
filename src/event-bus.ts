import { ILogger } from '@cork-labs/monkfish-logger';

import { IContext } from './interfaces/context';
import { IEvent } from './interfaces/event';
import { IEventListener } from './interfaces/event-listener';

import { EventBusListeners } from './event-bus-listeners';

export class EventBus {

  private listeners: EventBusListeners = new EventBusListeners();

  public receive (event: IEvent, context: IContext, logger: ILogger): void {
    const listeners = this.listeners.resolve(event.name);
    listeners.forEach((listener: IEventListener) => {
      listener.receive(event, context, logger);
    });
  }

  public addListener (pattern: string, listener: IEventListener): void {
    this.listeners.add(pattern, listener);
  }

  public removeListener (pattern: string, listener: IEventListener): void {
    this.listeners.remove(pattern, listener);
  }

}
