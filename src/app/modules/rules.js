'use strict';

class Rule {
  constructor(field, rule) {
    field ? this._generate(field) : this._load(rule);
  }

  get type() {
    return 'abstract';
  }

  get viewType() {
    return 'abstract';
  }

  apply(game) {
    return false;
  }

  equals(rule) {
    return rule.type === this.type;
  }

  _generate(data) {
  }

  _load(rule) {
    Object.assign(this, rule);
  }

  save() {
    return {
      ...this,
      type: this.type
    };
  }
}

class OpenRule extends Rule {
  _row;
  _col;
  _val;

  get type() {
    return 'open';
  }

  get viewType() {
    return 'hidden';
  }

  apply(game) {
    if (!game.isSet(this._row, this._col)) {
      game.set(this._row, this._col, this._val);
      return true;
    }
    return false;
  }

  equals(rule) {
    return super.equals(rule) && this._row == rule._row && this._col == rule._col;
  }

  _generate(field) {
    this._row = Math.floor(Math.random() * field.size) % field.size;
    this._col = Math.floor(Math.random() * field.size) % field.size;
    this._val = field.value(this._row, this._col);
  }
}

class UnderRule extends Rule {
  _row1;
  _row2;
  _val1;
  _val2;

  get type() {
    return 'under';
  }

  get viewType() {
    return 'column';
  }

  apply(game) {
    let changed = false;

    for (let i = 0; i < game.size; ++i) {
      if ((!game.possible(this._row1, i, this._val1)) && game.possible(this._row2, i, this._val2)) {
        game.exclude(this._row2, i, this._val2);
        changed = true;
      }
      if ((!game.possible(this._row2, i, this._val2)) && game.possible(this._row1, i, this._val1)) {
        game.exclude(this._row1, i, this._val1);
        changed = true;
      }
    }

    return changed;
  }

  equals(rule) {
    return super.equals(rule) && (rule._row1 === this._row1) && (rule._row2 === this._row2) && (rule._val1 === this._val1);
  }

  _generate(field) {
    const col = Math.floor(Math.random() * field.size) % field.size;
    this._row1 = Math.floor(Math.random() * field.size) % field.size;
    do {
      this._row2 = Math.floor(Math.random() * field.size) % field.size;
    } while (this._row2 === this._row1);
    if (this._row1 > this._row2) {
      this._row1 += this._row2;
      this._row2 = this._row1 - this._row2;
      this._row1 = this._row1 - this._row2;
    }

    this._val1 = field.value(this._row1, col);
    this._val2 = field.value(this._row2, col);
  }

  get row1() {
    return this._row1;
  }

  get row2() {
    return this._row2;
  }

  get value1() {
    return this._val1;
  }

  get value2() {
    return this._val2;
  }
}

class NearRule extends Rule {
  _row1;
  _row2;
  _val1;
  _val2;

  get type() {
    return 'near';
  }

  get viewType() {
    return 'row';
  }

  apply(game) {
    let changed = false;
    const iapply = (game, j, i1, i2, v1, v2) => {
      let left, right;
      left = j === 0 ? false : game.possible(i2, j - 1, v2);
      right = j === game.size - 1 ? false : game.possible(i2, j + 1, v2);

      if (!left && !right && game.possible(i1, j, v1)) {
        game.exclude(i1, j, v1);
        return true;
      } else {
        return false;
      }
    };
    for (let i = 0; i < game.size; ++i) {
      changed |= iapply(game, i, this._row1, this._row2, this._val1, this._val2);
      changed |= iapply(game, i, this._row2, this._row1, this._val2, this._val1);
    }
    return changed;
  }

  equals(rule) {
    return super.equals(rule) &&
      ((rule._row1 === this._row1) && (rule._val1 === this._val1) && (rule._row2 === this._row2) && (rule._val2 === this._val2)) ||
      ((rule._row2 === this._row1) && (rule._val2 === this._val1) && (rule._row1 === this._row2) && (rule._val1 === this._val2));
  }

  _generate(field) {
    this._row1 = Math.floor(Math.random() * field.size) % field.size;
    this._row2 = Math.floor(Math.random() * field.size) % field.size;

    const col1 = Math.floor(Math.random() * field.size) % field.size;
    const col2 = col1 === 0 ? 1 : (col1 === field.size - 1 ? field.size - 2 : col1 + (Math.random() < 0.5 ? -1 : +1));

    this._val1 = field.value(this._row1, col1);
    this._val2 = field.value(this._row2, col2);
  }

  get row1() {
    return this._row1;
  }

  get row2() {
    return this._row2;
  }

  get value1() {
    return this._val1;
  }

  get value2() {
    return this._val2;
  }
}

class DirectionRule extends Rule {
  _row1;
  _row2;
  _val1;
  _val2;

  get type() {
    return 'direction';
  }

  get viewType() {
    return 'row';
  }

  apply(game) {
    let changed = false;

    let i;
    for (i = 0; i < game.size; ++i) {
      if (game.possible(this._row2, i, this._val2)) {
        game.exclude(this._row2, i, this._val2);
        changed = true;
      }
      if (game.possible(this._row1, i, this._val1)) {
        break;
      }
    }
    for (i = game.size - 1; i >= 0; --i) {
      if (game.possible(this._row1, i, this._val1)) {
        game.exclude(this._row1, i, this._val1);
        changed = true;
      }
      if (game.possible(this._row2, i, this._val2)) {
        break;
      }
    }

    return changed;
  }

  equals(rule) {
    return super.equals(rule) &&
      (rule._row1 === this._row1) && (rule._val1 === this._val1) && (rule._row2 === this._row2) && (rule._val2 === this._val2);
  }

  _generate(field) {
    this._row1 = Math.floor(Math.random() * field.size) % field.size;
    this._row2 = Math.floor(Math.random() * field.size) % field.size;

    let col1 = Math.floor(Math.random() * field.size) % field.size;
    let col2;
    do {
      col2 = Math.floor(Math.random() * field.size) % field.size;
    } while (col2 === col1);
    if (col1 > col2) {
      col1 += col2;
      col2 = col1 - col2;
      col1 = col1 - col2;
    }

    this._val1 = field.value(this._row1, col1);
    this._val2 = field.value(this._row2, col2);
  }

  get row1() {
    return this._row1;
  }

  get row2() {
    return this._row2;
  }

  get value1() {
    return this._val1;
  }

  get value2() {
    return this._val2;
  }
}

class BetweenRule extends Rule {
  _row;
  _row1;
  _row2;
  _val;
  _val1;
  _val2;

  get type() {
    return 'between';
  }

  get viewType() {
    return 'row';
  }

  apply(game) {
    let changed = false;

    if (game.possible(this._row, 0, this._val)) {
      game.exclude(this._row, 0, this._val);
      changed = true;
    }

    if (game.possible(this._row, game.size - 1, this._val)) {
      game.exclude(this._row, game.size - 1, this._val);
      changed = true;
    }

    let loop, i;
    do {
      loop = false;

      for (i = 1; i < game.size - 1; ++i) {
        if (game.possible(this._row, i, this._val)) {
          if (!((game.possible(this._row1, i - 1, this._val1) && game.possible(this._row2, i + 1, this._val2)) ||
            (game.possible(this._row2, i - 1, this._val2) && game.possible(this._row1, i + 1, this._val1)))) {
            game.exclude(this._row, i, this._val);
            loop = true;
          }
        }
      }

      for (i = 0; i < game.size; ++i) {
        let left, right;

        if (game.possible(this._row2, i, this._val2)) {
          left = i < 2 ? false : (game.possible(this._row, i - 1, this._val) && game.possible(this._row1, i - 2, this._val1));
          right = i >= game.size - 2 ? false : (game.possible(this._row, i + 1, this._val) && game.possible(this._row1, i + 2, this._val1));
          if (!left && !right) {
            game.exclude(this._row2, i, this._val2);
            loop = true;
          }
        }

        if (game.possible(this._row1, i, this._val1)) {
          left = i < 2 ? false : (game.possible(this._row, i - 1, this._val) && game.possible(this._row2, i - 2, this._val2));
          right = i >= game.size - 2 ? false : (game.possible(this._row, i + 1, this._val) && game.possible(this._row2, i + 2, this._val2));
          if (!left && !right) {
            game.exclude(this._row1, i, this._val1);
            loop = true;
          }
        }
      }

      changed |= loop;
    } while (loop);

    return changed;
  }

  equals(rule) {
    return super.equals(rule) &&
      (rule._row === this._row) && (rule._val === this._val) &&
      (((rule._row1 === this._row1) && (rule._row2 === this._row2)) || ((rule._row1 === this._row2) && (rule._row2 === this._row1)));
  }

  _generate(field) {
    this._row = Math.floor(Math.random() * field.size) % field.size;
    this._row1 = Math.floor(Math.random() * field.size) % field.size;
    this._row2 = Math.floor(Math.random() * field.size) % field.size;

    const col = 1 + Math.floor(Math.random() * (field.size - 2)) % (field.size - 2);
    const delta = Math.random() < 0.5 ? 1 : -1;

    this._val = field.value(this._row, col);
    this._val1 = field.value(this._row1, col - delta);
    this._val2 = field.value(this._row2, col + delta);
  }

  get row1() {
    return this._row1;
  }

  get row2() {
    return this._row;
  }

  get row3() {
    return this._row2;
  }

  get value1() {
    return this._val1;
  }

  get value2() {
    return this._val;
  }

  get value3() {
    return this._val2;
  }
}

const RULE_WEIGHTS = [
  {rule: OpenRule, weight: 1},
  {rule: UnderRule, weight: 2},
  {rule: BetweenRule, weight: 3},
  {rule: DirectionRule, weight: 4},
  {rule: NearRule, weight: 4}
];

const RULE_MAP = {
  open: OpenRule,
  under: UnderRule,
  between: BetweenRule,
  direction: DirectionRule,
  near: NearRule,
};

class RuleFactory {
  _config;
  _factory;

  constructor(config) {
    this.applyConfig(config || RULE_WEIGHTS);
  }

  get config() {
    return this._config;
  }

  // config is not null array!
  applyConfig(config) {
    this._config = config;
    this._factory = [];
    config.forEach((rule) => {
      Array.from({length: rule.weight}).forEach(() => this._factory.push(rule.rule));
    });
  }

  newRule = (field) => new (this._factory[Math.floor(Math.random() * this._factory.length)])(field);
  static loadRule = (rule) => new (RULE_MAP[rule.type])(null, rule);
}

const ruleFactory = new RuleFactory();

export {
  ruleFactory,
  RuleFactory
}