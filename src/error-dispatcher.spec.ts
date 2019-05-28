import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(sinonChai);

import { ILogger } from '@cork-labs/monkfish-logger';

import { IContext } from '../src/interfaces/context';

import { ErrorSeverity } from '../src/enums/error-severity';
import { ErrorDispatcher } from './error-dispatcher';
import { ApplicationError } from './errors/application-error';
import { ICommandErrorHandler } from './interfaces/command-error-handler';

describe('ErrorDispatcher', function t () {
  let subject: ErrorDispatcher;

  describe('dispatch()', function t () {
    let error: Error;
    let context: IContext;
    let logger: ILogger;
    let middleware1: ICommandErrorHandler;
    let middleware2: ICommandErrorHandler;
    let middlewares: ICommandErrorHandler[];
    let handle1: sinon.SinonStub;
    let handle2: sinon.SinonStub;
    let promise: Promise<void>;

    beforeEach(function t () {
      subject = new ErrorDispatcher();
      error = new Error('foobar');
      context = { qux: 'quux' } as IContext;
      logger = {
        child: sinon.spy()
      } as unknown as ILogger;
      middleware1 = {
        handle: sinon.stub()
      };
      handle1 = middleware1.handle as sinon.SinonStub;
      middleware2 = {
        handle: sinon.stub()
      };
      handle2 = middleware2.handle as sinon.SinonStub;
      middlewares = [middleware1, middleware2];
    });

    describe.only('when all middlewares resolve', function t () {
      beforeEach(function t () {
        handle1.resolves();
        handle2.resolves();
        promise = subject.dispatch(
          error,
          context,
          logger,
          middlewares
        );
      });

      it('should have called middleware 1', function t () {
        return promise.catch(() => {
          expect(handle1).to.have.callCount(1);
          expect(handle1.args[0][0]).to.be.an('error');
          expect(handle1.args[0][0].name).to.equal('Error');
          expect(handle1.args[0][0].message).to.equal('foobar');
          expect(handle1.args[0][1]).to.equal(context);
          expect(handle1.args[0][2]).to.equal(logger);
        });
      });

      it('should have called middleware 2', function t () {
        return promise.catch(() => {
          expect(handle2).to.have.callCount(1);
        });
      });

      it('should reject with the original error', function t () {
        return promise.catch((err: ApplicationError) => {
          expect(err.name).to.equal('Foobar');
          expect(err.message).to.equal('foobar');
          expect(err.severity).to.equal(ErrorSeverity.Error);
          expect(err.details).to.equal(undefined);
          expect(err.parent).to.equal(error);
        });
      });
    });

    describe('when a middleware rejects', function t () {
      beforeEach(function t () {
        error = new Error('foobar');
        handle1.rejects(error);
        handle2.resolves();
        promise = subject.dispatch(
          error,
          context,
          logger,
          middlewares
        );
      });

      it('should reject', function t () {
        return expect(promise).to.be.rejectedWith('bazqux');
      });

      it('should have called middleware1', function t () {
        return promise.catch(() => {
          expect(handle1).to.have.callCount(1);
          expect(handle1.args[0][0]).to.be.an('error');
          expect(handle1.args[0][0].name).to.equal('Error');
          expect(handle1.args[0][0].message).to.equal('foobar');
          expect(handle1.args[0][1]).to.equal(context);
          expect(handle1.args[0][2]).to.equal(logger);
        });
      });

      it('should no longer call middleware2', function t () {
        return promise.catch(() => {
          expect(handle2).to.have.callCount(0);
        });
      });
    });
  });
});
