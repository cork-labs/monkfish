'use strict';

const Application = require('./Application');
const EventHandler = require('./EventHandler');
const ErrorHandler = require('./ErrorHandler');

const Context = require('./classes/Context');
const Event = require('./classes/Event');
const Result = require('./classes/Result');

const ApplicationError = require('./errors/ApplicationError');

module.exports = {
  Application,
  EventHandler,
  ErrorHandler,
  classes: {
    Context,
    Event,
    Result
  },
  errors: {
    ApplicationError
  }
};
