'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(sinonChai);

const Application = require('../src/Application');

describe('Application', function () {
  it('should be a function', function () {
    expect(Application).to.be.a('function');
  });

  describe('api', function () {
    beforeEach(function () {
      this.eventHandler = {
        handle: sinon.stub()
      };
      this.errorHandler = {
        handle: sinon.stub()
      };
      this.logger = {
        info: sinon.spy(),
        error: sinon.spy()
      };
      this.application = new Application(this.eventHandler, this.errorHandler, this.logger);
    });

    describe('newContext()', function () {
      beforeEach(function () {
        this.data = { foo: 'bar' };
        this.context = this.application.newContext(this.data);
      });

      it('should return the context', function () {
        expect(this.context).to.be.an('object');
      });

      it('the context should contain the expected data', function () {
        expect(this.context).to.deep.equal(this.data);
      });
    });

    describe('newEvent()', function () {
      beforeEach(function () {
        this.type = 'foobar';
        this.data = { foo: 'bar' };
        this.event = this.application.newEvent(this.type, this.data);
      });

      it('should return the event', function () {
        expect(this.event).to.be.an('object');
      });

      it('the event should be of the expected type', function () {
        expect(this.event.type).to.equal(this.type);
      });

      it('the event should contain the expected data', function () {
        expect(this.event.data).to.deep.equal(this.data);
      });
    });

    describe('handle()', function () {
      beforeEach(function () {
        this.type = 'foobar';
        this.eventData = { foo: 'bar' };
        this.event = this.application.newEvent(this.type, this.eventData);

        this.contextData = { foo: 'bar' };
        this.context = this.application.newContext(this.contextData);
      });

      describe('when event handler resolves', function () {
        beforeEach(function () {
          this.eventHandlerResult = { foo: 'barbaz' };
          this.eventHandler.handle.resolves(this.eventHandlerResult);
          this.promise = this.application.handle(this.event, this.context, this.logger);
        });

        it('should resolve with the expected data', function () {
          return expect(this.promise).to.eventually.deep.equal(this.eventHandlerResult);
        });

        it('should invoke logger.info()', function () {
          const expectedData = {
            event: this.event,
            context: this.context
          };
          return this.promise.then(() => {
            expect(this.logger.info).to.have.been.calledWith(expectedData);
          });
        });
      });
    });

    describe('when event handler rejects', function () {
      beforeEach(function () {
        this.eventHandlerError = new Error('foobar');
        this.eventHandler.handle.rejects(this.eventHandlerError);
        this.errorHandler.handle.rejects(this.eventHandlerError);
        this.promise = this.application.handle(this.event, this.context, this.logger);
      });

      it('should reject with the expected data', function () {
        return expect(this.promise).to.be.rejectedWith(this.eventHandlerError);
      });

      it('should invoke logger.error()', function () {
        return this.promise.catch(() => {
          expect(this.logger.error).to.have.been.calledWith({ err: this.eventHandlerError });
        });
      });
    });

    describe('when event handler rejects and error handler rejects', function () {
      beforeEach(function () {
        this.eventHandlerError = new Error('foobar');
        this.eventHandler.handle.rejects(this.eventHandlerError);
        this.errorHandlerError = new Error('bazqux');
        this.errorHandler.handle.rejects(this.errorHandlerError);
        this.promise = this.application.handle(this.event, this.context, this.logger);
      });

      it('should reject with the expected data', function () {
        return expect(this.promise).to.be.rejectedWith(this.errorHandlerError);
      });

      it('should invoke logger.error()', function () {
        return this.promise.catch(() => {
          expect(this.logger.error).to.have.been.calledWith({ err: this.eventHandlerError });
        });
      });
    });
  });
});
