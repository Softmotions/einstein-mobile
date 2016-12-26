'use strict';

import {ruleFactory} from './rules';
import {Solver} from './solver';


class Field {
  _size;
  _data;

  constructor(size) {
    this._size = Math.min(6, Math.max(3, size));

    this._data = Array.from({length: this.size}, (v, k) => []);
    this._data.forEach((v) => {
      let tmp = Array.from({length: this.size}, (v, k) => k);
      Array.from({length: this.size})
        .forEach(() => v.push(tmp.splice(Math.random() * tmp.length, 1)[0]));
    }, this);
  }

  get size() {
    return this._size;
  }

  value(row, col) {
    return this._data[row][col];
  }
}

class GameController {

  _field;
  _rules;
  _count;
  _data;

  _active;
  _started;

  _time;
  _start;

  constructor(field) {
    this._field = field;
    this._init();
  }

  get size() {
    return this._field.size;
  }

  get field() {
    if (__DEV__) {
      return this._field;
    }
  }

  set rules(rules) {
    this._rules = rules;
  }

  get rules() {
    return this._rules;
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
    if (this._started) {
      return;
    }
    this._started = true;
    this._active = true;
    this._time = 0;
    this._start = new Date().getTime();
  }

  stop() {
    this._started = false;
    this._time += (new Date().getTime() - this._start);
  }

  pause() {
    if (!this.active) {
      return;
    }
    this._active = false;
    this._time += (new Date().getTime() - this._start);
  }

  resume() {
    if (this.active || this.finished) {
      return;
    }
    this._active = true;
    this._start = new Date().getTime();
  }

  get time() {
    const time = !this.active ? this._time : this._time + (new Date().getTime() - this._start);
    return Math.floor(time / 1000);
  }

  get active() {
    return this._started && this._active;
  }

  get finished() {
    return !this._started;
  }

  get solved() {
    return this._count == 0;
  }

  get failed() {
    return this.finished && !this.solved;
  }

  get success() {
    return this.finished && this.solved;
  }
}


class GameFactory {

  static generateGame(size) {
    let field = new Field(size);
    let game = new GameController(field);

    let solver = new Solver(new GameController(field));
    do {
      solver.addRule(ruleFactory.newRule(field));
    } while (!solver.solve());

    let rules = solver.rules;

    let solved;
    do {
      solved = false;
      for (let n = 0; n < rules.length; ++n) {
        solver = new Solver(new GameController(field));
        let trules = Array.from(rules);
        trules.splice(n, 1);
        solver.rules = trules;
        if (solver.solve()) {
          rules.splice(n, 1);
          solved = true;
          break;
        }
      }
    } while (solved);

    rules.filter((v) => v.type === 'open')
      .forEach((v) => v.apply(game));

    game.rules = rules.filter((v) => v.type !== 'open');
    return game;
  }
}

export {
  Field,
  GameController,
  GameFactory
}