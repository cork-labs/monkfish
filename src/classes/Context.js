'use strict';

const _ = require('lodash');

class Context {
  constructor (data) {
    data = _.cloneDeep(data);
    Object.assign(this, data);
  }
}

module.exports = Context;
