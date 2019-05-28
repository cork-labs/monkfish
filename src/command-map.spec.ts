import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(sinonChai);

import { CommandMap } from './command-map';

describe.skip('CommandMap', function t () {
  beforeEach(function t () {
    this.middleware = {
      handle: sinon.stub()
    };
    this.middlewares = {
      baz: this.middleware
    };
    this.CommandMap = new CommandMap();
  });

  describe('add()', function t () {
    beforeEach(function t () {
      this.handler = {
        event: 'foo',
        pre: [{ name: 'qux' }]
      };
    });

    describe('when handler contains an unknown middleware', function t () {
      it('should throw an error', function t () {
        const fn = () => this.CommandMap.addEventHandler(this.handler);
        return expect(fn).to.throw('Unknown middleware qux in event foo');
      });
    });

    describe('when event is duplicate', function t () {
      beforeEach(function t () {
        this.handler = {
          event: 'foo',
          pre: [],
          post: []
        };
        this.CommandMap.addEventHandler(this.handler);
      });

      it('should throw an error', function t () {
        const fn = () => this.CommandMap.addEventHandler(this.handler);
        return expect(fn).to.throw('Duplicate');
      });
    });
  });

  describe('resolve()', function t () {
    describe('when an unknown event is provided', function t () {
      beforeEach(function t () {
        this.event = {
          type: 'foobar'
        };
      });

      it('should reject', function t () {
        const fn = () => this.CommandMap.resolve(this.event);
        return expect(fn).to.throw('application.event.unknown');
      });
    });

    describe('when a known event is provided', function t () {
      beforeEach(function t () {
        this.handler = {
          event: 'foo',
          pre: [{ name: 'baz' }],
          post: []
        };
        this.CommandMap.addEventHandler(this.handler);
        this.event = {
          type: 'foo'
        };
        this.resolved = this.CommandMap.resolve(this.event);
      });

      it('should return the handler', function t () {
        expect(this.resolved).to.be.an('object');
        expect(this.resolved.event).to.equal(this.event.type);
      });

      it('should map the middleware', function t () {
        expect(this.resolved.pre[0]).to.equal(this.middleware);
      });
    });
  });
});
