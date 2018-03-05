'use strict';

const chai = require('chai');
const expect = chai.expect;
// const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const ApplicationError = require('../../src/errors/ApplicationError');

describe('ApplicationError', function () {
  it('should be a function', function () {
    expect(ApplicationError).to.be.a('function');
  });

  describe('map()', function () {
    beforeEach(function () {
      this.name = 'foo';
      this.severity = 'bar';
      this.details = { 'foo': 'bar' };
      this.parent = 'qux';
      this.error = new ApplicationError(this.name, this.severity, this.details, this.parent);

      this.newName = 'new foo';
      this.newSeverity = 'new bar';
      this.mappedError = ApplicationError.map(this.error, this.newName, this.newSeverity);
    });

    it('should store the new name', function () {
      expect(this.mappedError.name).to.equal(this.newName);
    });

    it('should store the new severity', function () {
      expect(this.mappedError.severity).to.equal(this.newSeverity);
    });

    it('should preserve the old details', function () {
      expect(this.mappedError.details).to.equal(this.details);
    });

    it('should preserve the old stack', function () {
      expect(this.mappedError.stack).to.deep.equal(this.error.stack);
    });
  });

  describe('api', function () {
    beforeEach(function () {
      this.name = 'foo';
      this.severity = 'bar';
      this.details = { 'foo': 'bar' };
      this.parent = 'qux';
      this.error = new ApplicationError(this.name, this.severity, this.details, this.parent);
    });

    it('should expose the name', function () {
      expect(this.error.name).to.equal(this.name);
    });

    it('should expose the severity', function () {
      expect(this.error.severity).to.equal(this.severity);
    });

    it('should expose the details', function () {
      expect(this.error.details).to.equal(this.details);
    });

    it('should expose the parent', function () {
      expect(this.error.parent).to.equal(this.parent);
    });
  });
});
