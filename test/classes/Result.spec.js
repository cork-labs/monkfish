'use strict';

const chai = require('chai');
const expect = chai.expect;
// const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const Result = require('../../src/classes/Result');

describe('Result', function () {
  it('should be a function', function () {
    expect(Result).to.be.a('function');
  });

  describe('api', function () {
    beforeEach(function () {
      this.data = { foo: 'bar' };
      this.meta = { baz: 'qux' };
      this.result = new Result(this.data, this.meta);
    });

    it('should expose data', function () {
      expect(this.result.data).to.deep.equal(this.data);
    });

    it('should expose meta', function () {
      expect(this.result.meta).to.deep.equal(this.meta);
    });
  });
});
