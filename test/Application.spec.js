'use strict';

const chai = require('chai');
const expect = chai.expect;
// const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const Application = require('../src/Application');

describe('Application', function () {
  it('should be a function', function () {
    expect(Application).to.be.a('function');
  });

  describe('api', function () {
    beforeEach(function () {
      this.application = new Application();
    });

    it('should...', function () {
      expect(true).to.equal(true);
    });
  });
});
