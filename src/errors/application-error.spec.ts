import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import 'sinon';
import sinonChai from 'sinon-chai';

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(sinonChai);

import { ApplicationError } from './application-error';

describe('ApplicationError', function t () {

  describe('static wrap()', function t () {
    beforeEach(function t () {
      this.name = 'foo';
      this.severity = 'bar';
      this.details = { foo: 'bar' };
      this.parent = 'qux';
      this.error = new ApplicationError(this.name, this.severity, this.details, this.parent);

      this.newName = 'new foo';
      this.newSeverity = 'new bar';
      this.mappedError = ApplicationError.wrap(this.error, this.newName, this.newSeverity);
    });

    it('should store the new name', function t () {
      expect(this.mappedError.name).to.equal(this.newName);
    });

    it('should store the new severity', function t () {
      expect(this.mappedError.severity).to.equal(this.newSeverity);
    });

    it('should preserve the old details', function t () {
      expect(this.mappedError.details).to.equal(this.details);
    });

    it('should not preserve the old stack', function t () {
      expect(this.mappedError.stack).to.not.deep.equal(this.error.stack);
    });
  });

  describe('constructor', function t () {
    beforeEach(function t () {
      this.name = 'foo';
      this.severity = 'bar';
      this.details = { foo: 'bar' };
      this.parent = 'qux';
      this.error = new ApplicationError(this.name, this.severity, this.details, this.parent);
    });

    it('should expose the name', function t () {
      expect(this.error.name).to.equal(this.name);
    });

    it('should expose the severity', function t () {
      expect(this.error.severity).to.equal(this.severity);
    });

    it('should expose the details', function t () {
      expect(this.error.details).to.equal(this.details);
    });

    it('should expose the parent', function t () {
      expect(this.error.parent).to.equal(this.parent);
    });
  });
});
