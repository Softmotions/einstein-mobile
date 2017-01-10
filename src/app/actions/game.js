'use strict';

import {
  GAME_CREATE,
  GAME_CLEAR,
  GAME_PAUSE,
  GAME_RESUME,
  GAME_TOGGLE_RULE,
} from '../constants/game';

const gameNew = () => ({type: GAME_CREATE});
const gameClear = () => ({type: GAME_CLEAR});
const gamePause = () => ({type: GAME_PAUSE});
const gameResume = () => ({type: GAME_RESUME});

const gameRuleToggle = (id) => ({type: GAME_TOGGLE_RULE, rule: {id: id}});

export {
  gameNew,
  gameClear,
  gamePause,
  gameResume,
  gameRuleToggle,
}