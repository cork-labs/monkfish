'use strict';

const ErrorSeverity = require('../enums/error-severity');

class ApplicationError extends Error {
  constructor (name, severity, details, parent) {
    super(name);
    this.name = name;
    this.severity = severity || ErrorSeverity.ERROR;
    this.details = details;
    this.parent = parent;
  }
}

ApplicationError.wrap = (err, name, severity) => {
  name = name || err.name;
  severity = severity || err.severity;
  const ret = new ApplicationError(name, severity, err.details, err);
  return ret;
};

module.exports = ApplicationError;
