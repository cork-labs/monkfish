'use strict';

const ApplicationError = require('./errors/application-error');
const EventHandler = require('./event-handler');

class EventMap {
  constructor (middlewares) {
    this._map = {};
    this._middlewares = Object.assign({}, middlewares);
  }

  _getMiddleware (name, eventType) {
    const middleware = this._middlewares[name];
    if (!middleware) {
      throw new Error(`Unknown middleware ${name} in event ${eventType}.`);
    }
    return middleware;
  }

  // -- public

  addEventHandler (handlerOptions) {
    if (this._map[handlerOptions.event]) {
      throw new Error(`Duplicate event "${handlerOptions.event}".`);
    }

    const mapMiddlewaresFn = (name) => {
      return this._getMiddleware(name, handlerOptions.event);
    };
    const handler = new EventHandler(handlerOptions, mapMiddlewaresFn);

    this._map[handler.event] = handler;
  }

  resolve (event) {
    const handler = this._map[event.type];

    if (!handler) {
      throw new ApplicationError('monkfish.application.event.unknown', 'error', {
        event: event.type
      });
    }

    return handler;
  }
}

module.exports = EventMap;
