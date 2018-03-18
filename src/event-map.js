'use strict';

const _ = require('lodash');

const ApplicationError = require('./errors/application-error');

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

  addEventHandler (eventType, options) {
    if (this._map[eventType]) {
      throw new Error(`Duplicate event "${eventType}".`);
    }

    options = _.cloneDeep(options);

    options.pre = options.pre.map((middleware) => this._getMiddleware(middleware.name, eventType));

    const middlewaresErrorMap = options.pre.reduce((acc, middleware) => {
      const middlewareAllowedErrors = middleware.getAllowedErrors && middleware.getAllowedErrors();
      (middlewareAllowedErrors || []).forEach(error => {
        acc[error] = true;
      });
      return acc;
    }, {});
    options.errorMap = Object.assign(middlewaresErrorMap, options.errorMap);

    options.post = options.post.map((middleware) => this._getMiddleware(middleware.name, eventType));

    this._map[eventType] = Object.freeze(options);
  }

  resolve (event) {
    const eventType = event.type;
    const handler = this._map[eventType];

    if (!handler) {
      throw new ApplicationError('monkfish.application.event.unknown', 'error', {
        event: event.type
      });
    }

    return handler;
  }
}

module.exports = EventMap;
