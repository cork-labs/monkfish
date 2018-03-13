'use strict';

const chai = require('chai');
const expect = chai.expect;
// const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const Event = require('../../src/classes/event');

describe('Event', function () {
  it('should be a function', function () {
    expect(Event).to.be.a('function');
  });

  describe('api', function () {
    beforeEach(function () {
      this.type = 'foo';
      this.data = { foo: 'bar' };
      this.event = new Event(this.type, this.data);
    });

    it('should expose the event type', function () {
      expect(this.event.type).to.equal(this.type);
    });

    it('should expose the data', function () {
      expect(this.event.data).to.be.an('object');
      expect(this.event.data).to.deep.equal(this.data);
    });
  });
});
