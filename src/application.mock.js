'use strict';

const Application = require('./application');

class Mockfish {
  constructor (config) {
    this.application = new Application(config);
  }

  addModule (mod) {
    this.application.addModule(mod);
  }

  start () {
    return this.application.start();
  }

  getServices () {
    return this.application.getServices();
  }

  getModels () {
    return this.application.getModels();
  }

  handle () {
    return this.application.handle.apply(this.application, arguments);
  }
}

module.exports = Mockfish;
