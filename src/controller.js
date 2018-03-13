'use strict';

const _ = require('lodash');

class Controller {
  constructor (config) {
    this._config = _.cloneDeep(config);
  }
}

Controller.isController = (instance) => {
  return (typeof instance === 'object' && typeof instance.handle === 'function');
};

module.exports = Controller;
