'use strict';

const chai = require('chai');
const expect = chai.expect;
// const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const Result = require('../../src/Result');

describe('Result', function () {
  it('should be a function', function () {
    expect(Result).to.be.a('function');
  });

  describe('api', function () {
    beforeEach(function () {
      this.result = new Result();
    });

    it('should...', function () {
      expect(true).to.equal(true);
    });
  });
});
