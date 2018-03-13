'use strict';

const ApplicationError = require('./errors/application-error');

class ErrorDispatcher {
  _dispatch (error, event, context, logger, pipeline) {
    if (!pipeline.length) {
      return Promise.resolve();
    }
    const handler = pipeline.shift();
    return Promise.resolve()
      .then(() => handler(error, event, context, logger))
      .catch((err) => logger.error({ err, handler: handler.name }, 'monkfish.application.error-dispatch'))
      .then(() => this._dispatch(error, event, context, logger, pipeline));
  }

  _mapError (errorMap, defaultError, err) {
    const name = err && err.name;
    const error = errorMap[name] ? errorMap[name] : defaultError;
    return ApplicationError.map(err, error.name, error.severity);
  }

  // -- public

  dispatch (errorMap, defaultError, middlewares, err, event, context, logger) {
    const error = this._mapError(errorMap, defaultError, err);
    return this._dispatch(error, event, context, logger, middlewares.slice(0))
      .then(() => {
        throw error;
      });
  }
}
module.exports = ErrorDispatcher;
