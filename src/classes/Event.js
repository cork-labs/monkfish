'use strict';

class Event {
  constructor (type, data) {
    this.type = type;
    Object.assign(this, data);
  }
}

module.exports = Event;
