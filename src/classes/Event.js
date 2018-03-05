'use strict';

const _ = require('lodash');

class Event {
  constructor (type, data) {
    this.type = type;
    this.data = _.cloneDeep(data, {});
  }
}

module.exports = Event;
