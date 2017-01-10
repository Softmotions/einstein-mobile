'use strict';

import {handleActions} from 'redux-actions';

import {
  GAME_SET,
  GAME_CLEAR,
  GAME_PAUSE,
  GAME_RESUME,
  GAME_TOGGLE_RULE
} from '../constants/game';

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

const pauseGame = (state = initialGameState) => {
  let {game} = state;
  game && game.pause();

  return {
    ...state
  };
};

const resumeGame = (state = initialGameState) => {
  let {game} = state;
  game && game.resume();

  return {
    ...state
  };
};

const setGame = (state = initialGameState, action) => (action.game ? {
  ...state,
  game: action.game,
  rules: action.game.rules
    .map((rule, index) => ({
      ...initialRuleState,
      id: 'rule_' + index,
      rule: rule,
    }))
    .reduce((acc, item) => ({
      ...acc,
      [item.id]: item
    }), {})
} : clearGame(state));

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

export default handleActions({
  [GAME_TOGGLE_RULE]: toggleRule,

  [GAME_PAUSE]: pauseGame,
  [GAME_RESUME]: resumeGame,

  [GAME_SET]: setGame,
  [GAME_CLEAR]: clearGame,
}, initialGameState);