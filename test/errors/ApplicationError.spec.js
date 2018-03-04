'use strict';

const chai = require('chai');
const expect = chai.expect;
// const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const ApplicationError = require('../../src/ApplicationError');

describe('ApplicationError', function () {
  it('should be a function', function () {
    expect(ApplicationError).to.be.a('function');
  });

  describe('api', function () {
    beforeEach(function () {
      this.applicationError = new ApplicationError();
    });

    it('should...', function () {
      expect(true).to.equal(true);
    });
  });
});
