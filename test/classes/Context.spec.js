'use strict';

const chai = require('chai');
const expect = chai.expect;
// const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const Context = require('../../src/Context');

describe('Context', function () {
  it('should be a function', function () {
    expect(Context).to.be.a('function');
  });

  describe('api', function () {
    beforeEach(function () {
      this.context = new Context();
    });

    it('should...', function () {
      expect(true).to.equal(true);
    });
  });
});
