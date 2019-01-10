'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(sinonChai);

const EventMap = require('../src/event-map');

describe('EventMap', function () {
  it('should be a function', function () {
    expect(EventMap).to.be.a('function');
  });

  describe('api', function () {
    beforeEach(function () {
      this.middleware = {
        handle: sinon.stub()
      };
      this.middlewares = {
        'baz': this.middleware
      };
      this.eventMap = new EventMap(this.middlewares);
    });

    describe('addEventHandler()', function () {
      beforeEach(function () {
        this.handler = {
          event: 'foo',
          pre: [{name: 'qux'}]
        };
      });

      describe('when handler contains an unknown middleware', function () {
        it('should throw an error', function () {
          const fn = () => this.eventMap.addEventHandler(this.handler);
          return expect(fn).to.throw('Unknown middleware qux in event foo');
        });
      });

      describe('when event is duplicate', function () {
        beforeEach(function () {
          this.handler = {
            event: 'foo',
            pre: [],
            post: []
          };
          this.eventMap.addEventHandler(this.handler);
        });

        it('should throw an error', function () {
          const fn = () => this.eventMap.addEventHandler(this.handler);
          return expect(fn).to.throw('Duplicate');
        });
      });
    });

    describe('resolve()', function () {
      describe('when an unknown event is provided', function () {
        beforeEach(function () {
          this.event = {
            type: 'foobar'
          };
        });

        it('should reject', function () {
          const fn = () => this.eventMap.resolve(this.event);
          return expect(fn).to.throw('application.event.unknown');
        });
      });

      describe('when a known event is provided', function () {
        beforeEach(function () {
          this.handler = {
            event: 'foo',
            pre: [{name: 'baz'}],
            post: []
          };
          this.eventMap.addEventHandler(this.handler);
          this.event = {
            type: 'foo'
          };
          this.resolved = this.eventMap.resolve(this.event);
        });

        it('should return the handler', function () {
          expect(this.resolved).to.be.an('object');
          expect(this.resolved.event).to.equal(this.event.type);
        });

        it('should map the middleware', function () {
          expect(this.resolved.pre[0]).to.equal(this.middleware);
        });
      });
    });
  });
});
