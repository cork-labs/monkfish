'use strict';

const chai = require('chai');
const expect = chai.expect;

const Middleware = require('../src/middleware');

describe('Middleware', function () {
  it('should be a function', function () {
    expect(Middleware).to.be.a('function');
  });

  describe('isMiddleware()', function () {
    it('given a middleware-ish object', function () {
      it('should return true', function () {
        expect(Middleware.isMiddleware({ handle: () => {} })).to.equal(true);
      });
    });

    it('given a non object', function () {
      it('should return false', function () {
        expect(Middleware.isMiddleware('foo')).to.equal(false);
      });
    });

    it('given an non-middleware-ish object', function () {
      it('should return false', function () {
        expect(Middleware.isMiddleware({ })).to.equal(false);
      });
    });
  });
});
