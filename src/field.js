'use strict';

class Field {

  constructor(size) {
    this._size = Math.min(6, Math.max(3, size));

    this._data = [];
    for (let i = 0; i < this.size; ++i) {
      this._data[i] = [];

      let tmp = [];
      for (let j = 0; j < this.size; ++j) {
        tmp.push(j);
      }

      while (tmp.length > 0) {
        this._data[i].push(tmp.splice(Math.random() * tmp.length, 1)[0]);
      }
    }
  }

  get size() {
    return this._size;
  }

  value(row, col) {
    return this._data[row][col];
  }
}

class GameController {

  constructor(field) {
    this._field = field;
    this._init();
  }

  get size() {
    return this._field.size;
  }

  _init() {
    this._count = this.size * this.size;
    this._data = [];
    for (let i = 0; i < this.size; ++i) {
      this._data[i] = {
        cols: [],
        values: []
      };
      for (let j = 0; j < this.size; ++j) {
        let cols, values;
        this._data[i].values[j] = {
          possible: this.size,
          cols: cols = {}
        };
        this._data[i].cols[j] = {
          possible: this.size,
          values: values = {},
          defined: null
        };
        for (let k = 0; k < this.size; ++k) {
          cols[k] = true;
          values[k] = true;
        }
      }
    }
  }

  possible(row, col, val) {
    return (!this.isSet(row, col) && this._data[row].cols[col].values[val]) || this.is(row, col, val);
  }

  isSet(row, col) {
    return this.get(row, col) != null;
  }

  is(row, col, val) {
    return this.isSet(row, col) && this.get(row, col) == val;
  }

  get(row, col) {
    return this._data[row].cols[col].defined;
  }

  set(row, col, val) {
    if (!this.possible(row, col, val) || this.isSet(row, col)) {
      return;
    }

    if (this._field.value(row, col) != val) {
      this.stop();
      return;
    }

    --this._count;
    this._data[row].cols[col].possible = 0;
    this._data[row].values[val].possible = 0;
    this._data[row].cols[col].defined = val;
    for (let n = 0; n < this.size; ++n) {
      this._data[row].values[val].cols[n] = (n === col);
      this._data[row].values[n].possible -= (n !== val && this._data[row].cols[col].values[n] ? 1 : 0);
      this._data[row].values[n].cols[col] = (n === val);
    }
    for (let h = 0; h < this.size; ++h) {
      this.exclude(row, h, val);
    }

    this.checkSingle(row, col);

    if (this.solved) {
      this.stop();
    }
  }

  exclude(row, col, val) {
    if (!this.possible(row, col, val) || this.isSet(row, col)) {
      return;
    }

    if (this._field.value(row, col) === val) {
      this.stop();
      return;
    }

    --this._data[row].cols[col].possible;
    this._data[row].cols[col].values[val] = false;
    --this._data[row].values[val].possible;
    this._data[row].values[val].cols[col] = false;

    this.checkSingle(row, col);
  }

  checkSingle(row, col) {
    if (this._data[row].cols[col].possible == 1) {
      for (let h = 0; h < this.size; ++h) {
        if (this._data[row].cols[col].values[h]) {
          this.set(row, col, h);
          break;
        }
      }
    }

    for (let t = 0; t < this.size; ++t) {
      if (this._data[row].values[t].possible == 1) {
        for (let n = 0; n < this.size; ++n) {
          if (this._data[row].values[t].cols[n]) {
            this.set(row, n, t);
            break;
          }
        }
      }
    }
  }

  start() {
    this._active = true;
  }

  stop() {
    this._active = false;
  }

  pause() {

  }

  resume() {

  }

  get active() {
    return this._active;
  }

  get finished() {
    return !this.active;
  }

  get solved() {
    return this._count == 0;
  }

  get failed() {
    return !this.active && !this.solved;
  }

  get success() {
    return !this.active && this.solved;
  }
}


export {
  Field, GameController
}