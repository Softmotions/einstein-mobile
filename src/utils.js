'use strict';

const Dimensions = require('Dimensions');

class SizeConfig {

  constructor(group) {
    this._border = 0.5;
    this._space = 1;
    this._group = group - this._border * 2 - this._space;
    this._item = Math.floor(this._group / 3);
  }

  _ruleSpace = 1;
  _ruleItem = 30;
  _ruleBorder = 1;

  get group() {
    return this._group;
  }

  get item() {
    return this._item;
  }

  get space() {
    return this._space;
  }

  get border() {
    return this._border;
  }

  get ruleSpace() {
    return this._ruleSpace;
  }

  get ruleItem() {
    return this._ruleItem;
  }

  get ruleBorder() {
    return this._ruleBorder;
  }

// get group() {
  //   return 50;
  // }
  //
  // get item() {
  //   return 16;
  // }
  //
  // get space() {
  //   return 1;
  // }
  //
  // get border() {
  //   return 0.5;
  // }
  //
  // get ruleSpace() {
  //   return 1;
  // }
  //
  // get ruleItem() {
  //   return 30;
  // }
  //
  // get ruleBorder() {
  //   return 1;
  // }
}

class SizeUtils {
  static build() {
    let {height, width} = Dimensions.get('window');

    // TODO landscape

    let group = Math.floor(width / 6);

    return new SizeConfig(group);
  }
}

export {
  SizeConfig,
  SizeUtils
}