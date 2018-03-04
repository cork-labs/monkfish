'use strict';

class Result {
  constructor (data, meta) {
    this._data = data;
    this._meta = meta;
  }

  get data () {
    return this._data;
  }

  get meta () {
    return this._meta;
  }
}

module.exports = Result;
