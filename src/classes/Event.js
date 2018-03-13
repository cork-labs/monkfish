'use strict';

const _ = require('lodash');

class Event {
  constructor (type, data, params) {
    this.type = type;
    this.data = _.cloneDeep(data) || {};
    this.params = _.cloneDeep(params) || {};
  }
}

module.exports = Event;
