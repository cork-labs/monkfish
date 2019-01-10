'use strict';

const _ = require('lodash');

const Middleware = require('./middleware');
const EventHandlerOptions = require('./event-handler-options');

class Module {
  constructor (config) {
    this._config = _.cloneDeep(config);

    this._modules = [];

    this._services = {};
    this._models = {};

    this._pre = [];
    this._post = [];
    this._handlers = [];
    this._middlewares = [];
    this._errorHandlers = [];
    this._errorMap = {};
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

  addService (name, service) {
    this._services[name] = service;
  }

  addModel (name, model) {
    this._models[name] = model;
  }

  addPreMiddleware (middleware) {
    this._pre.push(middleware);
  }

  addPostMiddleware (middleware) {
    this._post.push(middleware);
  }

  addHandler (eventType, options) {
    if (this._handlers.find(handler => handler.event === eventType)) {
      throw new Error(`Duplicate event ${eventType}.`);
    }

    const handler = new EventHandlerOptions(eventType, options);

    this._handlers.push(handler);
  }

  addMiddleware (middleware) {
    if (!Middleware.isMiddleware(middleware)) {
      throw new Error(`Invalid middleware ${middleware && middleware.constructor.name}.`);
    }
    this._middlewares.push(middleware);
  }

  addErrorHandler (errorHandler) {
    if (!Middleware.isMiddleware(errorHandler)) {
      throw new Error(`Invalid error handler ${errorHandler && errorHandler.constructor.name}.`);
    }
    this._errorHandlers.push(errorHandler);
  }

  addErrorMap (map) {
    this._errorMap = Object.assign(this._errorMap, map);
  }

  // -- getters

  getServices () {
    return this._modules.reduce((acc, mod) => {
      return Object.assign(acc, mod.getServices());
    }, Object.assign({}, this._services));
  }

  getService (name) {
    const service = this._services[name];
    if (!service) {
      throw new Error(`Unknown service ${name}.`);
    }
    return service;
  }

  getModels () {
    return this._modules.reduce((acc, mod) => {
      return Object.assign(acc, mod.getModels());
    }, Object.assign({}, this._models));
  }

  getModel (name) {
    const model = this._models[name];
    if (!model) {
      throw new Error(`Unknown model ${name}.`);
    }
    return model;
  }

  getMiddlewares () {
    return this._modules.reduce((acc, mod) => {
      return acc.concat(mod.getMiddlewares());
    }, []).concat(this._middlewares);
  }

  getHandlersOptions () {
    const handlers = this._modules.reduce((acc, mod) => {
      return acc.concat(mod.getHandlersOptions());
    }, []).concat(this._handlers);

    handlers.forEach((handler) => {
      handler.pre.unshift(...this._pre);
      handler.post.unshift(...this._post);
    });

    return handlers;
  }

  getErrorHandlers () {
    return this._modules.reduce((acc, mod) => {
      return acc.concat(mod.getErrorHandlers());
    }, []).concat(this._errorHandlers);
  }

  getErrorMap () {
    const errorMap = this._modules.reduce((acc, mod) => {
      return _.merge(acc, mod.getErrorMap());
    }, {}); 1;
    return _.merge(errorMap, this._errorMap);
  }
}

Module.isModule = (instance) => {
  return (typeof instance === 'object' && typeof instance.addModule === 'function');
};

module.exports = Module;
