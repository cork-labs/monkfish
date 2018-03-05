'use strict';

const _ = require('lodash');

class Result {
  constructor (data, meta) {
    this._data = _.cloneDeep(data);
    this._meta = _.cloneDeep(meta);
  }

  get data () {
    return this._data;
  }

  get meta () {
    return this._meta;
  }
}

module.exports = Result;
