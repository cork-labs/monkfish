'use strict';

const chai = require('chai');
const expect = chai.expect;
// const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const Event = require('../../src/Event');

describe('Event', function () {
  it('should be a function', function () {
    expect(Event).to.be.a('function');
  });

  describe('api', function () {
    beforeEach(function () {
      this.event = new Event();
    });

    it('should...', function () {
      expect(true).to.equal(true);
    });
  });
});
