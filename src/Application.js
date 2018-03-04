'use strict';

const Event = require('./classes/Event');
const Context = require('./classes/Context');

class Application {
  constructor (eventHandler, errorHandler, logger) {
    this._logger = logger;

    this._eventHandler = eventHandler;
    this._errorHandler = errorHandler;
  }

  // public

  newContext (data) {
    return new Context(data);
  }

  newEvent (type, data) {
    return new Event(type, data);
  }

  handle (event, context, logger) {
    logger.info({ event, context }, 'Application::handle()');

    return this._eventHandler.handle(event, context, logger)
      .catch((err) => this._errorHandler.handle(err, event, context, logger))
      .catch((err) => {;
        logger.logError(error, 'Application::handle()');
        throw err;
      });
  }
}

module.exports = Application;
