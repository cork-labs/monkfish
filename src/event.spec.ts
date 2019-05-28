import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import 'sinon';
import sinonChai from 'sinon-chai';

import { Event } from './event';

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('Event', function t () {

  describe('constructor', function t () {
    beforeEach(function t () {
      this.name = 'foo';
      this.data = { foo: 'bar' };
      this.params = { baz: 'qux' };
      this.event = new Event(this.name, this.data, this.params);
    });

    it('should expose the event name', function t () {
      expect(this.event.name).to.equal(this.name);
    });

    it('should expose the data', function t () {
      expect(this.event.data).to.be.an('object');
      expect(this.event.data).to.deep.equal(this.data);
    });
  });
});
