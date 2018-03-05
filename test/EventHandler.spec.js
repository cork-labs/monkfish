'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(sinonChai);

const EventHandler = require('../src/EventHandler');

describe('EventHandler', function () {
  it('should be a function', function () {
    expect(EventHandler).to.be.a('function');
  });

  describe('when instantiated without controllers()', function () {
    it('should reject', function () {
      const fn = () => {
        this.eventHandler = new EventHandler();
      };
      expect(fn).to.throw('Invalid arguments, controllers');
    });
  });

  describe('when instantiated without an invalid preFns arguments', function () {
    it('should reject', function () {
      const fn = () => {
        this.eventHandler = new EventHandler({}, 'ouch');
      };
      expect(fn).to.throw('Invalid arguments, pre');
    });
  });

  describe('when instantiated without an invalid postFns arguments', function () {
    it('should reject', function () {
      const fn = () => {
        this.eventHandler = new EventHandler({}, [], 'ouch');
      };
      expect(fn).to.throw('Invalid arguments, post');
    });
  });

  describe('api', function () {
    beforeEach(function () {
      this.controller = {
        handle: sinon.stub()
      };
      this.controllers = {
        foo: this.controller,
        bar: {},
        baz: 'invalid'
      };
      this.pre1 = sinon.stub();
      this.pre2 = sinon.stub();
      this.preChain = [
        this.pre1,
        this.pre2
      ];
      this.post1 = sinon.stub();
      this.post2 = sinon.stub();
      this.postChain = [
        this.post1,
        this.post2
      ];
      this.logger = {
        info: sinon.spy(),
        error: sinon.spy()
      };
      this.eventHandler = new EventHandler(this.controllers, this.preChain, this.postChain);
    });

    describe('handle() unknown event', function () {
      beforeEach(function () {
        this.event = {
          type: 'foobar'
        };
        this.promise = this.eventHandler.handle(this.event, this.context, this.logger);
      });

      it('should reject', function () {
        return expect(this.promise).to.be.rejectedWith('application.event.unknown');
      });

      it('should not called intercerptors', function () {
        return this.promise.catch(() => {
          expect(this.pre1).to.have.callCount(0);
        });
      });
    });

    describe('handle() invalid handler', function () {
      beforeEach(function () {
        this.event = {
          type: 'bar'
        };
        this.promise = this.eventHandler.handle(this.event, this.context, this.logger);
      });

      it('should reject', function () {
        return expect(this.promise).to.be.rejectedWith('application.handler.invalid');
      });
    });

    describe('handle() invalid handler', function () {
      beforeEach(function () {
        this.event = {
          type: 'baz'
        };
        this.promise = this.eventHandler.handle(this.event, this.context, this.logger);
      });

      it('should reject', function () {
        return expect(this.promise).to.be.rejectedWith('application.handler.invalid');
      });
    });

    describe('handle()', function () {
      beforeEach(function () {
        this.event = {
          type: 'foo',
          data: {
            foo: 'bar'
          }
        };
        this.context = { baz: 'qux' };
      });

      describe('when controller resolves', function () {
        beforeEach(function () {
          this.result = { foo: 'bar' };
          this.controllers.foo.handle.resolves(this.result);
          this.promise = this.eventHandler.handle(this.event, this.context, this.logger);
        });

        it('should resolve with result', function () {
          return expect(this.promise).to.eventually.equal(this.result);
        });

        it('should have called pre 1', function () {
          return this.promise.then(() => {
            expect(this.pre1).to.have.callCount(1);
            expect(this.pre1.args[0][0]).to.equal(this.event);
            expect(this.pre1.args[0][1]).to.equal(this.context);
            expect(this.pre1.args[0][2]).to.equal(this.logger);
          });
        });

        it('should have called pre 2', function () {
          return this.promise.then(() => {
            expect(this.pre2).to.have.callCount(1);
          });
        });

        it('should have called post 1', function () {
          return this.promise.then(() => {
            expect(this.post1).to.have.callCount(1);
            expect(this.post1.args[0][0]).to.equal(this.result);
            expect(this.post1.args[0][1]).to.equal(this.event);
            expect(this.post1.args[0][2]).to.equal(this.context);
            expect(this.post1.args[0][3]).to.equal(this.logger);
          });
        });

        it('should have called post 2', function () {
          return this.promise.then(() => {
            expect(this.post2).to.have.callCount(1);
          });
        });
      });

      describe('when controller rejects', function () {
        beforeEach(function () {
          this.error = new Error('foobar');
          this.controllers.foo.handle.rejects(this.error);
          this.promise = this.eventHandler.handle(this.event, this.context, this.logger);
        });

        it('should reject with the error', function () {
          return expect(this.promise).to.be.rejectedWith(this.error);
        });

        it('should have called pre 1', function () {
          return this.promise.catch(() => {
            expect(this.pre1).to.have.callCount(1);
          });
        });

        it('should have called pre 2', function () {
          return this.promise.catch(() => {
            expect(this.pre2).to.have.callCount(1);
          });
        });

        it('should not have called post 1', function () {
          return this.promise.catch(() => {
            expect(this.post1).to.have.callCount(0);
          });
        });

        it('should not have called post 2', function () {
          return this.promise.catch(() => {
            expect(this.post2).to.have.callCount(0);
          });
        });
      });

      describe('when a pre interceptor rejects', function () {
        beforeEach(function () {
          this.interceptorError = new Error('foobar');
          this.pre1.rejects(this.interceptorError);
          this.pre2.resolves();
          this.promise = this.eventHandler.handle(this.event, this.context, this.logger);
        });

        it('should reject', function () {
          return expect(this.promise).to.be.rejectedWith('foobar');
        });

        it('should not have called pre2', function () {
          return this.promise.catch(() => {
            expect(this.pre2).to.have.callCount(0);
          });
        });
      });

      describe('when a post interceptor rejects', function () {
        beforeEach(function () {
          this.result = { foo: 'bar' };
          this.controllers.foo.handle.resolves(this.result);
          this.interceptorError = new Error('foobar');
          this.post1.rejects(this.interceptorError);
          this.promise = this.eventHandler.handle(this.event, this.context, this.logger);
        });

        it('should reject', function () {
          return expect(this.promise).to.eventually.equal(this.result);
        });

        it('should not have called pre2', function () {
          return this.promise.catch(() => {
            expect(this.post2).to.have.callCount(0);
          });
        });
      });
    });
  });
});
