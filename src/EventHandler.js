'use strict';

const ApplicationError = require('./errors/ApplicationError');

class Application {
  constructor (controllers, preFns, postFns) {
    this._controllers = controllers;

    this._preFns = preFns || [];
    this._success = postFns || []
  }

  _willHandle (event, context, logger, handlers) {
    if (!handlers.length) {
      return Promise.resolve();
    }
    const handler = handlers.shift();
    return Promise.resolve(handler(event, context, logger))
      .catch((err) => logger.error({ err, handler: handler.name }, 'EventHandler::_willHandle()'))
      .then(() => this._willHandle(event, context, logger, handlers));
  }

  _resolveController (event) {
    const eventType = event.type;
    let controllerName;
    if (this._controllers[eventType]) {
      controllerName = eventType;
    } else {
      const eventClass = event.type.split('.')[0] + '.*';
      if (this._controllers[eventClass]) {
        controllerName = eventClass;
      }
    }
    if (controllerName) {
      const controller = this._controllers[controllerName].controller;
      const method = this._controllers[controllerName].method;
      return { handler, method };
    }
  }

  _handle (event, context, logger) {
    var resolved = this._resolveController(event);
    if (resolved || typeof resolved.handler[resolved.method] !== 'function') {
      const handlerStr = resolved && typeof resolved.handler === 'object' && resolved.handler.constructor && resolved.handler.constructor.name;
      const methodStr = resolved.method;
      throw new ApplicationError('application.event.invalid', 'error', {
        event: event.type,
        handler: handlerStr,
        method: methodStr
      });
    }
    return resolved.handler[resolved.method](event, context, logger)
      .then((result) => {
        return result;
      });
  }

  _didHandle (result, event, context, logger, handlers) {
    if (!handlers.length) {
      return Promise.resolve(result);
    }
    const handler = handlers.shift();
    return Promise.resolve(handler(result, event, context, logger))
      .catch((err) => logger.error({ err, handler: handler.name }, 'EventHandler::_didHandle()'))
      .then(() => this._didHandle(result, event, context, logger, handlers));
  }

  // -- public

  handle (event, context, logger) {
    return new Promise((resolve, reject) => {
      this._willHandle(event, context, logger, this._preFns.slice(0))
        .then(() => this._handle(event, context, logger))
        .then((result) => this._didHandle(result, event, context, logger, this._postFns.slice(0)))
        .then(resolve)
        .catch(reject);
    });
  }
}

module.exports = Application;
