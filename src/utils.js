'use strict';

const Dimensions = require('Dimensions');

class StyleConfig {

  constructor(size, width, height) {
    this._size = size;
    this._border = 0.5;
    this._space = 1;

    // box
    let box = width - this._space * 2 - this._border * 2;
    this._groupSize = Math.floor((box - this._space * 7) / 6);
    this._itemSize = Math.floor(this._groupSize / 3);

    this._ruleBorder = 1;
    this._ruleSpace = 1;

    let ruleBox = Math.floor((width - this._ruleSpace * 3) / 4);
    this._ruleItemSize = Math.floor((ruleBox - this._ruleSpace * 4 - this._ruleBorder * 2) / 3);

    // TODO: build additional sizes
  }

  _border;
  _space;
  _groupSize;
  _itemSize;
  _ruleBorder;
  _ruleSpace;
  _ruleItemSize;

  get border() {
    return this._border;
  }

  get space() {
    return this._space;
  }

  // get fieldSize() {
  //   return this._groupSize * this._size + this._space * (this._size + 1) + this._border * 2
  // }

  get groupSize() {
    return this._groupSize;
  }

  get itemSize() {
    return this._itemSize;
  }

  get ruleBorder() {
    return this._ruleBorder;
  }

  get ruleSpace() {
    return this._ruleSpace;
  }

  get ruleItemSize() {
    return this._ruleItemSize;
  }
}

class StyleUtils {
  static build(size) {
    let {height, width} = Dimensions.get('window');

    // TODO orientation: landscape

    return new StyleConfig(size, width, height);
  }
}

export {
  StyleConfig,
  StyleUtils
}