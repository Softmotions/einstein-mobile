'use strict';

import {handleActions} from 'redux-actions';

import {GameFactory} from '../modules/controller';

const initialGameState = {
  game: null,
  rules: {},
};

const initialRuleState = {
  id: null,
  rule: null,
  visible: true,
};

const createGame = (state = initialGameState) => {
  let game = GameFactory.generateGame(6);
  return {
    ...state,
    game: game,
    rules: game.rules.map((rule, index) => {
      const id = 'rule_' + index;
      return {
        ...initialRuleState,
        id: id,
        rule: rule,
      }
    }).reduce((item, acc) => {
      return {
        ...acc,
        [item.id]: item,
      }
    }, {})
  }
};

const toggleRule = (state = initialGameState, action) => {
  let {rule: {id}} = action;
  let {rules: {[id]: rule}} = state;
  return {
    ...state,
    rules: {
      ...state.rules,
      [id]: {
        ...rule,
        visible: !rule.visible,
      }
    }
  }
};

// TODO: export constants
export default handleActions({
  ['GAME_TOGGLE_RULE']: toggleRule,
  ['GAME_CREATE']: createGame,
}, initialGameState);