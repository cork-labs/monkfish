'use strict';

const chai = require('chai');
const expect = chai.expect;
// const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const ErrorHandler = require('../src/ErrorHandler');

describe('ErrorHandler', function () {
  it('should be a function', function () {
    expect(ErrorHandler).to.be.a('function');
  });

  describe('api', function () {
    beforeEach(function () {
      this.errorHandler = new ErrorHandler();
    });

    it('should...', function () {
      expect(true).to.equal(true);
    });
  });
});
