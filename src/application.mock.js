'use strict';

const Application = require('./application');

class Mockfish {
  constructor (config) {
    this._application = new Application(config);
  }

  addModule (mod) {
    this._application.addModule(mod);
  }

  start () {
    return this._application.start();
  }

  getServices () {
    return this._application.getServices();
  }

  getModels () {
    return this._application.getModels();
  }

  handle () {
    return this._application.handle.apply(this._application, arguments);
  }
}

module.exports = Mockfish;
