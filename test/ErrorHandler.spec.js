'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(sinonChai);

const ErrorHandler = require('../src/ErrorHandler');

describe('ErrorHandler', function () {
  it('should be a function', function () {
    expect(ErrorHandler).to.be.a('function');
  });

  describe('api', function () {
    beforeEach(function () {
      this.interceptor1 = sinon.stub();
      this.interceptor2 = sinon.stub();
      this.errorChain = [
        this.interceptor1,
        this.interceptor2
      ];
      this.logger = {
        info: sinon.spy(),
        error: sinon.spy()
      };
      this.errorHandler = new ErrorHandler(this.errorChain, this.logger);
    });

    describe('handle()', function () {
      beforeEach(function () {
        this.error = new Error('foobar');
        this.event = {
          type: 'foobar',
          data: {
            foo: 'bar'
          }
        };
        this.context = { baz: 'qux' };
      });

      describe('when all interceptors resolve', function () {
        beforeEach(function () {
          this.interceptor1.resolves();
          this.interceptor2.resolves();
          this.promise = this.errorHandler.handle(this.error, this.event, this.context, this.logger);
        });

        it('should reject', function () {
          return expect(this.promise).to.be.rejectedWith('unexpected');
        });

        it('should have called interceptor 1', function () {
          return this.promise.catch(() => {
            expect(this.interceptor1).to.have.callCount(1);
            expect(this.interceptor1.args[0][0]).to.be.an('error');
            expect(this.interceptor1.args[0][0].name).to.equal('unexpected');
            expect(this.interceptor1.args[0][1]).to.equal(this.event);
            expect(this.interceptor1.args[0][2]).to.equal(this.context);
            expect(this.interceptor1.args[0][3]).to.equal(this.logger);
          });
        });

        it('should have called interceptor 2', function () {
          return this.promise.catch(() => {
            expect(this.interceptor2).to.have.callCount(1);
          });
        });

        it('should reject with the default error', function () {
          return this.promise.catch((err) => {
            expect(err.name).to.equal('unexpected');
            expect(err.message).to.equal('unexpected');
            expect(err.severity).to.equal('error');
            expect(err.details).to.equal(undefined);
            expect(err.parent).to.equal(undefined);
          });
        });
      });

      describe('when an interceptor rejects', function () {
        beforeEach(function () {
          this.interceptorError = new Error('foobar');
          this.interceptor1.rejects(this.interceptorError);
          this.interceptor2.resolves();
          this.promise = this.errorHandler.handle(this.error, this.event, this.context, this.logger);
        });

        it('should reject', function () {
          return expect(this.promise).to.be.rejectedWith('unexpected');
        });

        it('should have called all interceptor1', function () {
          return this.promise.catch(() => {
            expect(this.interceptor1).to.have.callCount(1);
            expect(this.interceptor1.args[0][0]).to.be.an('error');
            expect(this.interceptor1.args[0][0].name).to.equal('unexpected');
            expect(this.interceptor1.args[0][1]).to.equal(this.event);
            expect(this.interceptor1.args[0][2]).to.equal(this.context);
            expect(this.interceptor1.args[0][3]).to.equal(this.logger);
          });
        });

        it('should still call interceptor2', function () {
          return this.promise.catch(() => {
            expect(this.interceptor2).to.have.callCount(1);
          });
        });
      });
    });
  });
});
