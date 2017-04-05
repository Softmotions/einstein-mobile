'use strict';

export class Solver {

  constructor(game) {
    this._game = game;
    this._rules = [];
  }

  get solved() {
    return this._game.solved;
  }

  get rules() {
    return this._rules;
  }

  set rules(rules) {
    this._rules = rules;
  }

  addRule(rule) {
    this._rules.push(rule);
  }

  solve() {
    let applied;
    do {
      applied = false;
      for (let i = 0; i < this._rules.length; ++i) {
        applied |= this._rules[i].apply(this._game);
      }
    } while (applied);

    return this.solved;
  }
}