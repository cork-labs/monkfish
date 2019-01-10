'use strict';

const asyncNoop = () => Promise.resolve();

class EventHandler {
  constructor (options, middlewareMapFn) {
    this.event = options.event;
    this.pre = (options.pre || []).map((middleware) => middlewareMapFn(middleware.name));
    this.post = (options.post || []).map(middlewareMapFn);
    this.controller = options.controller || { handle: asyncNoop };

    const controllerErrorMap = this._getControllerErrorMap(this.controller);
    const middlewaresErrorMap = this._getMiddlewaresErrorMap(this.pre);

    this.errorMap = Object.assign(middlewaresErrorMap, controllerErrorMap, options.errorMap);
  }

  _getControllerErrorMap (controller) {
    const allowedErrors = controller.getAllowedErrors && controller.getAllowedErrors();
    return (allowedErrors || []).reduce((acc, error) => {
      acc[error] = true;
      return acc;
    }, {});
  }

  _getMiddlewaresErrorMap (pre) {
    return pre.reduce((acc, middleware) => {
      const allowedErrors = middleware.getAllowedErrors && middleware.getAllowedErrors();
      (allowedErrors || []).forEach(error => {
        acc[error] = true;
      });
      return acc;
    }, {});
  }
}

module.exports = EventHandler;
