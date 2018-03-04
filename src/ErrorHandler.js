'use strict';

const defaults = {
  map: {},
  default: {
    name: 'unexpected',
    severity: 'error'
  }
};

class ErrorHandler {

  constructor(fns, config) {
    this._config = Object.assign({}, defaults, config);

    this._fns = fns || [];
  }

  _didFail (error, event, context, logger, fns) {
    if (!fns.length) {
      return Promise.resolve();
    }
    const handler = fns.shift();
    return handler(error, event, context, logger)
      .catch((err) => logger.error({ err, handler: handler.name }, 'ErrorHandler::handle()'))
      .then(() => this._didFail(error, event, context, logger, fns));
  }

  _mapError (err) {
    const name = err && err.name;
    const error = this._config.map[name] ? this._config.map[name] : this._config.default;
    return ApplicationError.map(err, error.name, error.severity);
  }

  // -- public

  handle (err, event, context, logger) {
    const error = this._mapError(err);
    return this._didFail(error, event, context, logger, this._fns.slice(0))
      .finally(() => {
        throw err;
    });
  }
}
module.exports = ErrorHandler;
