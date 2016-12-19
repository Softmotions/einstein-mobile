'use strict';

import {StyleSheet} from 'react-native';

const Dimensions = require('Dimensions');

export class StyleConfig {

  constructor(size) {
    const {height, width} = Dimensions.get('window');
    // todo: hardcoded!!!
    this._statusHeight = 24;

    // TODO: extract additional size calculations??
    this._size = size;
    this._width = width;
    this._height = height;

    this._border = 0.5;
    this._space = 1;

    const dimension = this.direction == 'row' ? this.height - this.statusHeight : this.width;
    const box = dimension - this.space * 2 - this.border * 2;
    this._groupSize = Math.floor((box - this.space * 7) / 6);
    this._itemSize = Math.floor(this.groupSize / 3);

    this._ruleBorder = 1;
    this._ruleSpace = 1;

    this._rule3Columns = this.direction == 'row' ? 3 : 4; // todo calculate
    const rulesWidth = this.direction == 'row' ? this.width - box : this.width;
    const rulesHeight = (this.direction == 'row' ? this.height : this.height - box) - this.statusHeight;

    const ruleBox = Math.floor((rulesWidth - this.ruleSpace * 2 * (this.rule3Columns - 1)) / this.rule3Columns);
    this._ruleItemSize = Math.floor((ruleBox - this.ruleSpace * 4 - this.ruleBorder * 2) / 3);

    this._rule3Rows = Math.floor((rulesHeight - this.rule2Height - this.ruleSpace) / (this.rule3Height + this.ruleSpace * 2));

    this._buildStyles();
  }

  _width;
  _height;
  _statusHeight;

  _size;
  _border;
  _space;
  _groupSize;
  _itemSize;
  _ruleBorder;
  _ruleSpace;
  _ruleItemSize;

  _rule3Columns;
  _rule3Rows;

  _styles; // compiled styles

  get size() {
    return this._size;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get statusHeight() {
    return this._statusHeight;
  }

  get direction() {
    return this.width > this.height ? 'row' : 'column';
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
    return this._rule3Rows;
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

  _buildStyles() {
    this._styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },

      field: {
        height: this.fieldSize,
        width: this.fieldSize,
        borderWidth: this.border,
        borderColor: '#000',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: this.space,
        margin: this.space,
      },

      row: {
        height: this.fieldRowHeight,
        width: this.fieldRowWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 0
      },

      groupItem: {
        height: this.groupSize,
        width: this.groupSize,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },

      groupItemsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },

      itemBox: {
        height: this.itemSize,
        width: this.itemSize,
      },

      item: {
        height: this.itemSize,
        width: this.itemSize,
        // borderWidth: this.border,
        // borderColor: '#000',
      },

      rules: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'column'
      },

      rule3: {
        height: this.rule3Height,
        width: this.rule3Width,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: this.ruleBorder,
        borderColor: '#000',
        padding: this.ruleSpace,
        margin: this.ruleSpace,
      },

      rule2: {
        height: this.rule2Height,
        width: this.rule2Width,
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderWidth: this.ruleBorder,
        borderColor: '#000',
        padding: this.ruleSpace,
        margin: this.ruleSpace,
      },

      ruleItem: {
        height: this.ruleItemSize,
        width: this.ruleItemSize,
      },

      modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.25)'
      },

      groupItemPopup: {
        flex: 1,
      },

      popupGroupItemBox: {
        height: this.popupBoxHeight,
        width: this.popupBoxWidth,
        backgroundColor: '#fff',
        borderWidth: this.border,
        borderColor: '#000',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },

      popupGroupItemsRow: {
        flexDirection: 'row',
      },

      popupItemBox: {
        height: this.popupItemBoxHeight,
        width: this.popupItemBoxWidth,
      },

      popupItem: {
        height: this.popupItemHeight,
        width: this.popupItemWidth,
        // borderWidth: this.border,
        // borderColor: '#000',
      },
    });
  }

  get styles() {
    return this._styles;
  }

  popupPosition(popup) {
    if (popup) {
      let top = (this.fieldSize - this.popupBoxHeight) / (this.size - 1) * popup.i;
      let left = (this.fieldSize - this.popupBoxWidth) / (this.size - 1) * popup.j;

      if (this.direction == 'row') {
        top += (this.height - this.fieldSize - this.statusHeight - this.space) / 2;
        // add margins
        left += this.space;
      } else {
        left += (this.width - this.fieldSize - this.space) / 2;
        // add margins
        top += this.space;
      }

      return StyleSheet.create({
        popupPosition: {
          top: Math.floor(top),
          left: Math.floor(left),
          position: 'absolute',
        }
      }).popupPosition;
    } else {
      return StyleSheet.create({popupPosition: {}}).popupPosition;
    }
  }
}