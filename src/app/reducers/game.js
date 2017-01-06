'use strict';

import {handleActions} from 'redux-actions';

import {
  GAME_CLEAR,
  GAME_CREATE,
  GAME_TOGGLE_RULE
} from '../constants/game';

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

const clearGame = (state = initialGameState) => ({
  ...state,
  game: null,
  rules: {}
});

const createGame = (state = initialGameState) => {
  let game = GameFactory.generateGame(6);
  game.start();

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
    }).reduce((acc, item) => ({...acc, [item.id]: item}), {})
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
  [GAME_TOGGLE_RULE]: toggleRule,
  [GAME_CLEAR]: clearGame,
  [GAME_CREATE]: createGame,
}, initialGameState);