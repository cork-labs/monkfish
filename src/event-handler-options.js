'use strict';

const Controller = require('./controller');

class EventHandlerOptions {
  constructor (eventType, options) {
    if (typeof eventType !== 'string' || !eventType.match(/^[a-z]+(.[a-z]+)*$/)) {
      throw new Error(`Invalid event ${eventType}.`);
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

    this.event = eventType;
    this.pre = options.pre || [];
    this.post = options.post || [];
    this.controller = options.controller;
    this.errorMap = options.errorMap || {};
  }
}

module.exports = EventHandlerOptions;
