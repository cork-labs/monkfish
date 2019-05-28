import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(sinonChai);

import { CommandDispatcher } from './command-dispatcher';

describe('CommandDispatcher', function t () {
  beforeEach(function t () {
    this.controller = {
      handle: sinon.stub()
    };
    this.pre1 = {
      handle: sinon.stub()
    };
    this.pre2 = {
      handle: sinon.stub()
    };
    this.pre = [
      this.pre1,
      this.pre2
    ];
    this.post1 = {
      handle: sinon.stub()
    };
    this.post2 = {
      handle: sinon.stub()
    };
    this.post = [
      this.post1,
      this.post2
    ];
    this.logger = {
      info: sinon.spy(),
      error: sinon.spy()
    };
    this.handler = {
      controller: this.controller,
      pre: this.pre,
      post: this.post
    };
    this.CommandDispatcher = new CommandDispatcher();
  });

  describe('handle()', function t () {

    describe('given 2 pre interceptors and 2 post interceptors', function t () {

      beforeEach(function t () {
        this.controller = {
          handle: sinon.stub()
        };
        this.pre1 = {
          handle: sinon.stub()
        };
        this.pre2 = {
          handle: sinon.stub()
        };
        this.pre = [
          this.pre1,
          this.pre2
        ];
        this.post1 = {
          handle: sinon.stub()
        };
        this.post2 = {
          handle: sinon.stub()
        };
        this.post = [
          this.post1,
          this.post2
        ];
        this.logger = {
          info: sinon.spy(),
          error: sinon.spy()
        };
        this.handler = {
          controller: this.controller,
          pre: this.pre,
          post: this.post
        };
        this.CommandDispatcher = new CommandDispatcher();
      });

      beforeEach(function t () {
        this.event = {
          type: 'foo',
          data: {
            foo: 'bar'
          }
        };
        this.context = { baz: 'qux' };
      });

      describe('when controller resolves', function t () {
        beforeEach(function t () {
          this.result = { foo: 'bar' };
          this.controller.handle.resolves(this.result);
          this.promise = this.CommandDispatcher.dispatch(this.handler, this.event, this.context, this.logger);
        });

        it('should resolve with result', function t () {
          return expect(this.promise).to.eventually.equal(this.result);
        });

        it('should have called pre1.handle()', function t () {
          return this.promise.then(() => {
            expect(this.pre1.handle).to.have.callCount(1);
            expect(this.pre1.handle.args[0][0]).to.equal(this.event);
            expect(this.pre1.handle.args[0][1]).to.equal(this.context);
            expect(this.pre1.handle.args[0][2]).to.equal(this.logger);
          });
        });

        it('should have called pre2.handle()', function t () {
          return this.promise.then(() => {
            expect(this.pre2.handle).to.have.callCount(1);
          });
        });

        it('should have called post1.handle()', function t () {
          return this.promise.then(() => {
            expect(this.post1.handle).to.have.callCount(1);
            expect(this.post1.handle.args[0][0]).to.equal(this.result);
            expect(this.post1.handle.args[0][1]).to.equal(this.event);
            expect(this.post1.handle.args[0][2]).to.equal(this.context);
            expect(this.post1.handle.args[0][3]).to.equal(this.logger);
          });
        });

        it('should have called post2.handle()', function t () {
          return this.promise.then(() => {
            expect(this.post2.handle).to.have.callCount(1);
          });
        });
      });

      describe('when controller rejects', function t () {
        beforeEach(function t () {
          this.error = new Error('foobar');
          this.controller.handle.rejects(this.error);
          this.promise = this.CommandDispatcher.dispatch(this.handler, this.event, this.context, this.logger);
        });

        it('should reject with the error', function t () {
          return expect(this.promise).to.be.rejectedWith(this.error);
        });

        it('should have called pre1.handle()', function t () {
          return this.promise.catch(() => {
            expect(this.pre1.handle).to.have.callCount(1);
          });
        });

        it('should have called pre2.handle()', function t () {
          return this.promise.catch(() => {
            expect(this.pre2.handle).to.have.callCount(1);
          });
        });

        it('should not have called post1.handle()', function t () {
          return this.promise.catch(() => {
            expect(this.post1.handle).to.have.callCount(0);
          });
        });

        it('should not have called post2.handle()', function t () {
          return this.promise.catch(() => {
            expect(this.post2.handle).to.have.callCount(0);
          });
        });
      });

      describe('when a pre interceptor rejects', function t () {
        beforeEach(function t () {
          this.interceptorError = new Error('foobar');
          this.pre1.handle.rejects(this.interceptorError);
          this.pre2.handle.resolves();
          this.promise = this.CommandDispatcher.dispatch(this.handler, this.event, this.context, this.logger);
        });

        it('should reject', function t () {
          return expect(this.promise).to.be.rejectedWith('foobar');
        });

        it('should not have called pre2.handle()', function t () {
          return this.promise.catch(() => {
            expect(this.pre2.handle).to.have.callCount(0);
          });
        });
      });

      describe('when a post interceptor rejects', function t () {
        beforeEach(function t () {
          this.result = { foo: 'bar' };
          this.controller.handle.resolves(this.result);
          this.interceptorError = new Error('foobar');
          this.post1.handle.rejects(this.interceptorError);
          this.promise = this.CommandDispatcher.dispatch(this.handler, this.event, this.context, this.logger);
        });

        it('should reject', function t () {
          return expect(this.promise).to.eventually.equal(this.result);
        });

        it('should not have called pre2.handle()', function t () {
          return this.promise.catch(() => {
            expect(this.post2.handle).to.have.callCount(0);
          });
        });
      });
    });
  });
});
