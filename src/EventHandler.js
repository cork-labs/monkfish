'use strict';

const ApplicationError = require('./errors/ApplicationError');

class Application {
  constructor (controllers, preFns, postFns) {
    if (typeof controllers !== 'object') {
      throw new Error('Invalid arguments, controllers must be an object.');
    }

    this._controllers = controllers;
    this._preFns = preFns || [];
    this._postFns = postFns || [];

    if (!Array.isArray(this._preFns)) {
      throw new Error('Invalid arguments, preFns must be an array.');
    }

    if (!Array.isArray(this._postFns)) {
      throw new Error('Invalid arguments, postFns must be an array.');
    }
  }

  _resolveController (event) {
    const eventType = event.type;
    const handler = this._controllers[eventType];
    if (!handler) {
      throw new ApplicationError('application.event.unknown', 'error', {
        event: event.type
      });
    }
    if (typeof handler !== 'object') {
      throw new ApplicationError('application.handler.invalid', 'error', {
        event: event.type,
        handler: typeof handler
      });
    }
    if (typeof handler.handle !== 'function') {
      throw new ApplicationError('application.handler.invalid', 'error', {
        event: event.type,
        handler: handler.constructor ? handler.constructor.name : 'unknown'
      });
    }
    return handler;
  }

  _willHandle (event, context, logger, handlers) {
    if (!handlers.length) {
      return Promise.resolve();
    }
    const handler = handlers.shift();
    return Promise.resolve()
      .then(() => handler(event, context, logger))
      .catch((err) => {
        logger.error({ err, handler: handler.name }, 'EventHandler::_willHandle()');
        throw err;
      })
      .then(() => this._willHandle(event, context, logger, handlers));
  }

  _handle (event, context, logger, handler) {
    return handler.handle(event, context, logger);
  }

  _didHandle (result, event, context, logger, handlers) {
    if (!handlers.length) {
      return Promise.resolve(result);
    }
    const handler = handlers.shift();
    return Promise.resolve()
      .then(() => handler(result, event, context, logger))
      .catch((err) => logger.error({ err, handler: handler.name }, 'EventHandler::_didHandle()'))
      .then(() => this._didHandle(result, event, context, logger, handlers));
  }

  // -- public

  handle (event, context, logger) {
    return new Promise((resolve, reject) => {
      var handler = this._resolveController(event);
      this._willHandle(event, context, logger, this._preFns.slice(0))
        .then(() => this._handle(event, context, logger, handler))
        .then((result) => this._didHandle(result, event, context, logger, this._postFns.slice(0)))
        .then(resolve)
        .catch(reject);
    });
  }
}

module.exports = Application;
