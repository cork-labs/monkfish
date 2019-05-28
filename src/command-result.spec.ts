import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import 'sinon';
import sinonChai from 'sinon-chai';

import { CommandResult } from './command-result';

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('CommandResult', function t () {

  describe('constructor', function t () {
    beforeEach(function t () {
      this.data = { foo: 'bar' };
      this.meta = { baz: 'qux' };
      this.result = new CommandResult(this.data, this.meta);
    });

    it('should expose data', function t () {
      expect(this.result.data).to.deep.equal(this.data);
    });

    it('should expose meta', function t () {
      expect(this.result.meta).to.deep.equal(this.meta);
    });
  });
});
