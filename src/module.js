'use strict';

const Controller = require('./controller');
const Middleware = require('./middleware');

class Module {
  constructor () {
    this._modules = [];

    this._services = {};
    this._models = {};

    this._pre = [];
    this._post = [];
    this._handlers = [];
    this._middlewares = [];
    this._errorHandlers = [];
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
    if (typeof eventType !== 'string' || !eventType.match(/^[a-z]+(.[a-z]+)*$/)) {
      throw new Error(`Invalid event ${eventType}.`);
    }
    if (this._handlers.find(handler => handler.event === eventType)) {
      throw new Error(`Duplicate event ${eventType}.`);
    }
    if (typeof options !== 'object') {
      throw new Error(`Invalid options for event ${eventType}.`);
    }
    if (!Controller.isController(options.controller)) {
      throw new Error(`Invalid controller for event ${eventType}.`);
    }
    if (options.pre && !Array.isArray(options.pre)) {
      throw new Error(`Invalid pre options for event ${eventType}.`);
    }
    if (options.post && !Array.isArray(options.post)) {
      throw new Error(`Invalid post options for event ${eventType}.`);
    }

    this._handlers.push({
      event: eventType,
      pre: options.pre || [],
      post: options.post || [],
      controller: options.controller
    });
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

  getHandlers () {
    const handlers = this._modules.reduce((acc, mod) => {
      return acc.concat(mod.getHandlers());
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
}

Module.isModule = (instance) => {
  return (typeof instance === 'object' && typeof instance.addModule === 'function');
};

module.exports = Module;
