'use strict';

class ApplicationError extends Error {
  constructor (name, severity, details, parent) {
    super(name);
    this.name = name;
    this.severity = severity || 'error';
    this.details = details;
    this.parent = parent;
  }
}

ApplicationError.map = (err, name, severity) => {
  name = name || err.name;
  severity = severity || err.severity;
  const ret = new ApplicationError(name, severity, err.details);
  return ret;
};

module.exports = ApplicationError;
