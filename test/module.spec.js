'use strict';

const chai = require('chai');
const expect = chai.expect;

const Module = require('../src/module');

describe('Module', function () {
  it('should be a function', function () {
    expect(Module).to.be.a('function');
  });

  describe('isModule()', function () {
    it('given a module-ish object', function () {
      it('should return true', function () {
        expect(Module.isModule({ addModule: () => {} })).to.equal(true);
      });
    });

    it('given a non object', function () {
      it('should return false', function () {
        expect(Module.isModule('foo')).to.equal(false);
      });
    });

    it('given an non-module-ish object', function () {
      it('should return false', function () {
        expect(Module.isModule({ })).to.equal(false);
      });
    });
  });

  describe('api', function () {
    beforeEach(function () {
      this.controller = {
        handle: () => {}
      };
      this.module = new Module();
    });

    describe('addModule()', function () {
      describe('when an invalid module is provided', function () {
        it('should throw an error', function () {
          const fn = () => this.module.addModule('foobar');
          return expect(fn).to.throw('Invalid module String');
        });
      });

      describe('when a duplicate module is provided', function () {
        beforeEach(function () {
          this.ModConstructor = class ModConstructor {
            addModule () {}
          };
          this.mod = new this.ModConstructor();
          this.module.addModule(this.mod);
        });

        it('should throw an error', function () {
          const fn = () => this.module.addModule(this.mod);
          return expect(fn).to.throw('Duplicate module ModConstructor');
        });
      });
    });

    describe('addPreMiddleware()', function () {
      describe('when an invalid middleware is provided', function () {
        it('should not throw an error', function () {
          const fn = () => this.module.addPreMiddleware({handle: () => {}});
          return expect(fn).not.to.throw('Invalid pre middleware String');
        });
      });
    });

    describe('addPostMiddleware()', function () {
      describe('when an invalid middleware is provided', function () {
        it('should throw an error', function () {
          const fn = () => this.module.addPostMiddleware({handle: () => {}});
          return expect(fn).not.to.throw('Invalid post middleware String');
        });
      });
    });

    describe('addHandler()', function () {
      describe('when an invalid event type is provided', function () {
        it('should throw an error', function () {
          const fn = () => this.module.addHandler(123);
          return expect(fn).to.throw('Invalid event 123');
        });
      });

      describe('when an invalid event pattern is provided', function () {
        it('should throw an error', function () {
          const fn = () => this.module.addHandler('FOO!');
          return expect(fn).to.throw('Invalid event FOO!');
        });
      });

      describe('when invalid options are provided', function () {
        it('should throw an error', function () {
          const fn = () => this.module.addHandler('foo.bar', 123);
          return expect(fn).to.throw('Invalid options');
        });
      });

      describe('when invalid controller is provided', function () {
        it('should throw an error', function () {
          const options = {
            controller: 123
          };
          const fn = () => this.module.addHandler('foo.bar', options);
          return expect(fn).to.throw('Invalid controller');
        });
      });

      describe('when invalid pre middleware is provided', function () {
        it('should throw an error', function () {
          const options = {
            controller: this.controller,
            pre: 123
          };
          const fn = () => this.module.addHandler('foo.bar', options);
          return expect(fn).to.throw('Invalid pre');
        });
      });

      describe('when invalid post middleware is provided', function () {
        it('should throw an error', function () {
          const options = {
            controller: this.controller,
            post: 123
          };
          const fn = () => this.module.addHandler('foo.bar', options);
          return expect(fn).to.throw('Invalid post');
        });
      });

      describe('when a duplicate event is provided', function () {
        beforeEach(function () {
          const options = {
            controller: this.controller
          };
          this.module.addHandler('foo.bar', options);
        });

        it('should throw an error', function () {
          const fn = () => this.module.addHandler('foo.bar');
          return expect(fn).to.throw('Duplicate event foo.bar');
        });
      });
    });

    describe('addMiddleware()', function () {
      describe('when an invalid middleware is provided', function () {
        it('should throw an error', function () {
          const fn = () => this.module.addMiddleware('foobar');
          return expect(fn).to.throw('Invalid middleware String');
        });
      });
    });

    describe('addErrorHandler()', function () {
      describe('when an invalid error handler is provided', function () {
        it('should throw an error', function () {
          const fn = () => this.module.addErrorHandler('foobar');
          return expect(fn).to.throw('Invalid error handler String');
        });
      });
    });

    describe('getService()', function () {
      describe('when an unknown service is requested', function () {
        it('should reject', function () {
          const fn = () => this.module.getService('foobar');
          return expect(fn).to.throw('Unknown service foobar');
        });
      });

      describe('when a known service is requested', function () {
        beforeEach(function () {
          this.service = {};
          this.module.addService('foobar', this.service);
          this.result = this.module.getService('foobar');
        });

        it('should return the service', function () {
          expect(this.result).to.equal(this.service);
        });
      });
    });

    describe('getModel()', function () {
      describe('when an unknown model is requested', function () {
        it('should reject', function () {
          const fn = () => this.module.getModel('foobar');
          return expect(fn).to.throw('Unknown model foobar');
        });
      });

      describe('when a known model is requested', function () {
        beforeEach(function () {
          this.model = {};
          this.module.addModel('foobar', this.model);
          this.result = this.module.getModel('foobar');
        });

        it('should return the model', function () {
          expect(this.result).to.equal(this.model);
        });
      });
    });

    describe('getErrorHandlers()', function () {
      beforeEach(function () {
        this.middleware1 = {
          handle: () => {}
        };
        this.middleware2 = {
          handle: () => {}
        };
        this.subModule = new Module();
        this.subModule.addErrorHandler(this.middleware1);
        this.module.addModule(this.subModule);
        this.module.addErrorHandler(this.middleware2);
        this.result = this.module.getErrorHandlers();
      });

      it('should return all error handlers', function () {
        expect(this.result).to.be.an('array');
        expect(this.result.length).to.equal(2);
      });

      it('should return child error handlers first', function () {
        expect(this.result[0]).to.equal(this.middleware1);
      });

      it('should return own error handlers last', function () {
        expect(this.result[1]).to.equal(this.middleware2);
      });
    });

    describe('getHandlers()', function () {
      beforeEach(function () {
        this.handler1 = {
          event: 'foobar',
          pre: ['foo'],
          controller: { handle: () => {} }
        };
        this.handler2 = {
          event: 'barqux',
          post: ['bar'],
          controller: { handle: () => {} }
        };
        this.middlewarePre = {
          handle: () => {}
        };
        this.middlewarePost = {
          handle: () => {}
        };
        this.module.addPreMiddleware(this.middlewarePre);
        this.module.addPostMiddleware(this.middlewarePost);
        this.subModule = new Module();
        this.subModule.addHandler(this.handler1.event, this.handler1);
        this.module.addModule(this.subModule);
        this.module.addHandler(this.handler2.event, this.handler2);
        this.result = this.module.getHandlers();
      });

      it('should return all handlers', function () {
        expect(this.result).to.be.an('array');
        expect(this.result.length).to.equal(2);
      });

      it('should return child handlers first', function () {
        expect(this.result[0].event).to.equal(this.handler1.event);
      });

      it('should return own handlers last', function () {
        expect(this.result[1].event).to.equal(this.handler2.event);
      });

      it('should prepend module pre middlewares to all handlers', function () {
        expect(this.result[0].pre[0]).to.equal(this.middlewarePre);
        expect(this.result[0].pre[1]).to.equal('foo');
        expect(this.result[1].pre[0]).to.equal(this.middlewarePre);
      });

      it('should prepend module post middlewares to all handlers', function () {
        expect(this.result[0].post[0]).to.equal(this.middlewarePost);
        expect(this.result[1].post[0]).to.equal(this.middlewarePost);
        expect(this.result[1].post[1]).to.equal('bar');
      });
    });

    describe('getMiddlewares()', function () {
      beforeEach(function () {
        this.middleware1 = {
          handle: () => {}
        };
        this.middleware2 = {
          handle: () => {}
        };
        this.subModule = new Module();
        this.subModule.addMiddleware(this.middleware1);
        this.module.addModule(this.subModule);
        this.module.addMiddleware(this.middleware2);
        this.result = this.module.getMiddlewares();
      });

      it('should return all middlewares', function () {
        expect(this.result).to.be.an('array');
        expect(this.result.length).to.equal(2);
      });

      it('should return child middlewares first', function () {
        expect(this.result[0]).to.equal(this.middleware1);
      });

      it('should return own middlewares last', function () {
        expect(this.result[1]).to.equal(this.middleware2);
      });
    });
  });
});
