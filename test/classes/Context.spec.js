'use strict';

const chai = require('chai');
const expect = chai.expect;
// const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const Context = require('../../src/classes/context');

describe('Context', function () {
  it('should be a function', function () {
    expect(Context).to.be.a('function');
  });

  describe('api', function () {
    beforeEach(function () {
      this.data = { foo: 'bar' };
      this.context = new Context(this.data);
    });

    it('should expose the data attributes', function () {
      expect(this.context).to.deep.equal(this.data);
    });
  });
});
