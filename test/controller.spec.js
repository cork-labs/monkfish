'use strict';

const chai = require('chai');
const expect = chai.expect;

const Controller = require('../src/controller');

describe('Controller', function () {
  it('should be a function', function () {
    expect(Controller).to.be.a('function');
  });

  describe('isController()', function () {
    it('given a controller-ish object', function () {
      it('should return true', function () {
        expect(Controller.isController({ handle: () => {} })).to.equal(true);
      });
    });

    it('given a non object', function () {
      it('should return false', function () {
        expect(Controller.isController('foo')).to.equal(false);
      });
    });

    it('given an non-controller-ish object', function () {
      it('should return false', function () {
        expect(Controller.isController({ })).to.equal(false);
      });
    });
  });
});
