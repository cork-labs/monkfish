'use strict';

const Application = require('./application');
const Module = require('./module');
const Controller = require('./Controller');
const Middleware = require('./middleware');
const EventMap = require('./event-map');
const EventDispatcher = require('./event-dispatcher');
const ErrorDispatcher = require('./error-dispatcher');

const Context = require('./classes/context');
const Event = require('./classes/event');
const Result = require('./classes/result');

const ApplicationError = require('./errors/application-error');

const ErrorSeverity = require('./enums/error-severity');

const ApplicationMock = require('./application.mock');

module.exports = {
  Application,
  Module,
  Controller,
  Middleware,
  EventMap,
  EventDispatcher,
  ErrorDispatcher,
  classes: {
    Context,
    Event,
    Result
  },
  errors: {
    ApplicationError
  },
  enums: {
    ErrorSeverity
  },
  ApplicationMock: ApplicationMock
};
