import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import 'sinon';
import sinonChai from 'sinon-chai';

import { Context } from './context';

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('Context', function t () {
  beforeEach(function t () {
    this.data = { foo: 'bar' };
    this.context = new Context(this.data);
  });

  it('should expose the data attributes', function t () {
    expect(this.context).to.deep.equal(this.data);
  });
});
