'use strict';

const Dimensions = require('Dimensions');

class StyleConfig {

  constructor(size, width, height) {
    // TODO: orientation!
    // TODO: extract additional size calculations??
    this._size = size;
    this._width = width;
    this._height = height;

    this._border = 0.5;
    this._space = 1;

    const box = this.width - this.space * 2 - this.border * 2;
    this._groupSize = Math.floor((box - this.space * 7) / 6);
    this._itemSize = Math.floor(this.groupSize / 3);

    this._ruleBorder = 1;
    this._ruleSpace = 1;

    this._rule3Columns = 4;
    const ruleBox = Math.floor((this.width - this.ruleSpace * 2 * (this.rule3Columns - 1)) / this.rule3Columns);
    this._ruleItemSize = Math.floor((ruleBox - this.ruleSpace * 4 - this.ruleBorder * 2) / 3);
  }

  _width;
  _height;

  _size;
  _border;
  _space;
  _groupSize;
  _itemSize;
  _ruleBorder;
  _ruleSpace;
  _ruleItemSize;

  _rule3Columns;

  get size() {
    return this._size;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get border() {
    return this._border;
  }

  get space() {
    return this._space;
  }

  get fieldSize() {
    return this.groupSize * this.size + this.space * (this.size + 1) + this.border * 2
  }

  get fieldRowWidth() {
    return this.groupSize * this.size + this.space * (this.size - 1);
  }

  get fieldRowHeight() {
    return this.groupSize;
  }

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

  get rule3Columns() {
    return this._rule3Columns;
  }

  get rule3Rows() {
    return 4; // todo: calculate
  }

  get rule3Width() {
    return this.ruleItemSize * 3 + this.ruleSpace * 4 + this.ruleBorder * 2;
  }

  get rule3Height() {
    return this.ruleItemSize + this.ruleSpace * 2 + this.ruleBorder * 2;
  }

  get rule2Width() {
    return this.ruleItemSize + this.ruleSpace * 2 + this.ruleBorder * 2;
  }

  get rule2Height() {
    return this.ruleItemSize * 2 + this.ruleSpace * 3 + this.ruleBorder * 2;
  }

  get ruleItemSize() {
    return this._ruleItemSize;
  }

  get popupBoxWidth() {
    return this.groupSize * 3 + this.border * 2 + this.space * 2;
  }

  get popupBoxHeight() {
    return this.groupSize * 3 + this.border * 2 + this.space * 2;
  }

  get popupItemBoxWidth() {
    return this.groupSize;
  }

  get popupItemBoxHeight() {
    return this.groupSize;
  }

  get popupItemWidth() {
    return this.groupSize;
  }

  get popupItemHeight() {
    return this.groupSize;
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