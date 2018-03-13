'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(sinonChai);

const Application = require('../src/application');

describe('Application', function () {
  it('should be a function', function () {
    expect(Application).to.be.a('function');
  });

  describe('api', function () {
    beforeEach(function () {
      this.logger = {
        info: sinon.spy(),
        error: sinon.spy()
      };
      this.config = {
        error: {
          map: {
            'Error': {
              name: 'bazqux',
              severity: 'warn'
            }
          }
        }
      };
      this.application = new Application(this.config);
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

    describe('addModule()', function () {
      describe('when invoked with an invalid module', function () {
        beforeEach(function () {
          this.module = {};
        });

        it('should throw an error', function () {
          const fn = () => this.application.addModule(this.module);
          expect(fn).to.throw('Invalid module');
        });
      });

      describe('when invoked with a repeated module', function () {
        beforeEach(function () {
          this.module = {
            addModule: sinon.spy()
          };
          this.application.addModule(this.module);
        });

        it('should throw an error', function () {
          const fn = () => this.application.addModule(this.module);
          expect(fn).to.throw('Duplicate module');
        });
      });
    });

    describe('start()', function () {
      describe('when invoked with zero modules', function () {
        beforeEach(function () {
          this.module = {};
        });

        it('should throw an error', function () {
          const fn = () => this.application.start();
          expect(fn).to.throw('zero modules');
        });
      });

      describe('when invoked with a a single module', function () {
        beforeEach(function () {
          this.module = {
            addModule: sinon.spy(),
            getMiddlewares: sinon.stub().returns([]),
            getHandlers: sinon.stub().returns([]),
            getErrorHandlers: sinon.stub().returns([])
          };
          this.application.addModule(this.module);
          this.promise = this.application.start();
        });

        it('should resolve', function () {
          return expect(this.promise).to.eventually.deep.equal(undefined);
        });
      });
    });

    describe('handle()', function () {
      describe('when called before start()', function () {
        beforeEach(function () {

        });
        it('should throw an error', function () {
          const fn = () => {
            this.application.handle();
          };
          return expect(fn).to.throw('not yet started');
        });
      });

      describe('when event is unknown', function () {
        beforeEach(function () {
          this.event = this.application.newEvent();
          this.context = this.application.newContext();
          this.module = {
            addModule: sinon.spy(),
            getMiddlewares: sinon.stub().returns([]),
            getHandlers: sinon.stub().returns([]),
            getErrorHandlers: sinon.stub().returns([])
          };
          this.application.addModule(this.module);
          return this.application.start();
        });

        it('should throw an error', function () {
          const fn = () => {
            this.application.handle(this.event, this.context, this.logger);
          };
          return expect(fn).to.throw('monkfish.application.event.unknown');
        });
      });

      describe('when event exists', function () {
        beforeEach(function () {
          this.controller = {
            handle: sinon.stub()
          };
          this.handler = {
            event: 'foobar',
            controller: this.controller,
            pre: [],
            post: []
          };
          this.type = 'foobar';
          this.eventData = { foo: 'bar' };
          this.event = this.application.newEvent(this.type, this.eventData);
          this.contextData = { foo: 'bar' };
          this.context = this.application.newContext(this.contextData);
          this.module = {
            addModule: sinon.spy(),
            getMiddlewares: sinon.stub().returns([]),
            getHandlers: sinon.stub().returns([this.handler]),
            getErrorHandlers: sinon.stub().returns([])
          };
          this.application.addModule(this.module);
          return this.application.start();
        });

        describe('when event handler resolves', function () {
          beforeEach(function () {
            return this.application.start()
              .then(() => {
                this.controllerResult = { foo: 'barbaz' };
                this.controller.handle.resolves(this.controllerResult);
                this.promise = this.application.handle(this.event, this.context, this.logger);
              });
          });

          it('should resolve with the expected data', function () {
            return expect(this.promise).to.eventually.deep.equal(this.controllerResult);
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

        describe('when event handler rejects', function () {
          beforeEach(function () {
            this.controllerError = new Error('foobar');
            this.controller.handle.rejects(this.controllerError);
            this.promise = this.application.handle(this.event, this.context, this.logger);
          });

          it('should invoke logger.error()', function () {
            return this.promise.catch(() => {
              expect(this.logger.error).to.have.been.calledWith({ err: this.controllerError });
            });
          });

          it('should reject with the expected error', function () {
            return expect(this.promise).to.be.rejectedWith('bazqux');
          });
        });
      });
    });
  });
});
