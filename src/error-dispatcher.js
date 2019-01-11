'use strict';

const ApplicationError = require('./errors/application-error');
const ErrorSeverity = require('./enums/error-severity');

class ErrorDispatcher {
  _dispatch (error, event, context, logger, pipeline) {
    if (!pipeline.length) {
      return Promise.resolve();
    }
    const handler = pipeline.shift();
    return Promise.resolve()
      .then(() => handler(error, event, context, logger))
      .catch((err) => logger.error('monkfish.application.error-dispatch', { handler: handler.name }, err))
      .then(() => this._dispatch(error, event, context, logger, pipeline));
  }

  _mapError (errorMap, defaultError, err) {
    try {
      const name = err && err.name;
      const error = errorMap[name] ? errorMap[name] : defaultError;
      return ApplicationError.wrap(err, error.name, error.severity);
    } catch (err) {
      return new ApplicationError(err.name, ErrorSeverity.ERROR, err.stack, err);
    }
  }

  // -- public

  dispatch (errorMap, defaultError, middlewares, err, event, context, logger) {
    const error = this._mapError(errorMap, defaultError, err);
    return this._dispatch(error, event, context, logger, middlewares.slice(0))
      .then(() => {
        return Promise.reject(error);
      });
  }
}
module.exports = ErrorDispatcher;
