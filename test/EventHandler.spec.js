'use strict';

const chai = require('chai');
const expect = chai.expect;
// const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const EventHandler = require('../src/EventHandler');

describe('EventHandler', function () {
  it('should be a function', function () {
    expect(EventHandler).to.be.a('function');
  });

  describe('api', function () {
    beforeEach(function () {
      this.eventHandler = new EventHandler();
    });

    it('should...', function () {
      expect(true).to.equal(true);
    });
  });
});
