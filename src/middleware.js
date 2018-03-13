'use strict';

const _ = require('lodash');

class Middleware {
  constructor (config) {
    this._config = _.cloneDeep(config);
  }
}

Middleware.isMiddleware = (instance) => {
  return (typeof instance === 'object' && typeof instance.handle === 'function');
};

module.exports = Middleware;
