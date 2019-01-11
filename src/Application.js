'use strict';

const _ = require('lodash');

const Module = require('./module');
const EventMap = require('./event-map');
const EventDispatcher = require('./event-dispatcher');
const ErrorDispatcher = require('./error-dispatcher');

const Event = require('./classes/event');
const Context = require('./classes/context');

const defaults = {
  error: {
    map: {},
    default: {
      name: 'unexpected',
      severity: 'error'
    }
  }
};

class Application {
  constructor (config) {
    this._config = _.merge({}, defaults, config);

    this._eventDispatcher = new EventDispatcher();
    this._errorDispatcher = new ErrorDispatcher();

    this._errorMap = {};
    this._started = null;

    this._modules = [];
  }

  _buildEventMap () {
    const middlewares = this._buildMiddlewares();
    this._eventMap = new EventMap(middlewares);

    this._modules.forEach((mod) => {
      const handlers = mod.getHandlersOptions();
      handlers.forEach((handlerOptions) => {
        this._eventMap.addEventHandler(handlerOptions);
      });
    });
  }

  _buildErrorMap () {
    const errorMap = this._modules.reduce((acc, mod) => {
      return _.merge(acc, mod.getErrorMap());
    }, {});
    this._errorMap = _.merge(errorMap, this._errorMap);
  }

  _buildErrorHAndlers () {
    this._errorHandlers = this._modules.reduce((acc, mod) => {
      const middlewares = mod.getErrorHandlers();
      return acc.concat(middlewares);
    }, []);
  }

  _buildMiddlewares () {
    return this._modules.reduce((acc, mod) => {
      const middlewares = mod.getMiddlewares();
      middlewares.forEach((middleware) => {
        if (acc[middleware.constructor.name]) {
          throw new Error(`Duplicate middleware ${middleware.constructor.name} in module ${mod.constructor.name}.`);
        }
        acc[middleware.constructor.name] = middleware;
      });
      return acc;
    }, {});
  }

  _build () {
    if (!this._modules.length) {
      throw new Error(`Application contains zero modules.`);
    }

    this._buildEventMap();
    this._buildErrorMap();
    this._buildErrorHAndlers();
  }

  // -- setup

  addModule (mod) {
    if (!(Module.isModule(mod))) {
      throw new Error(`Invalid module ${mod && mod.constructor.name}.`);
    }
    if (this._modules.find(item => item.constructor.name === mod.constructor.name)) {
      throw new Error(`Duplicate module ${mod.constructor.name}.`);
    }
    this._modules.push(mod);
  }

  addErrorMap (map) {
    this._errorMap = Object.assign(this._errorMap, map);
  }

  getServices () {
    return this._modules.reduce((acc, mod) => {
      return Object.assign(acc, mod.getServices());
    }, {});
  }

  getModels () {
    return this._modules.reduce((acc, mod) => {
      return Object.assign(acc, mod.getModels());
    }, {});
  }

  start () {
    this._started = new Date();
    this._build();
    return Promise.resolve();
  }

  // -- execute

  newContext (data) {
    return new Context(data);
  }

  newEvent (type, data) {
    return new Event(type, data);
  }

  handle (event, context, logger) {
    if (!this._started) {
      throw new Error('Application is not yet started.');
    }

    logger.info('monkfish.application.handle', { event, context });

    const handler = this._eventMap.resolve(event);
    const errorMap = Object.assign(this._errorMap, handler.errorMap);
    const defaultError = this._config.error.default;
    const errorMiddlewares = this._errorHandlers;

    return Promise.resolve()
      .then(() => this._eventDispatcher.dispatch(handler, event, context, logger))
      .catch((err) => {
        logger.error('monkfish.application.handle', { handler }, err);
        return this._errorDispatcher.dispatch(errorMap, defaultError, errorMiddlewares, err, event, context, logger);
      });
  }
}

module.exports = Application;
