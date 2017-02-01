'use strict';

import {AsyncStorage} from 'react-native';

import {
  GAME_SET,
  GAME_CLEAR,
  GAME_PAUSE,
  GAME_RESUME,
  GAME_TOGGLE_RULE,

  GAME_STORAGE_KEY
} from '../constants/game';

import {PLAYGAMES_ACHIEVEMENT_PUZZLE_LOVER} from '../constants/playgames';

import {PlayGames} from '../modules/native';

import {GameFactory} from '../modules/controller';

const gameClear = () => dispatch => Promise.resolve().then(() => dispatch({type: GAME_CLEAR}));

const gameSet = (game) => ({type: GAME_SET, game: game});

const gameNew = () => dispatch =>
  dispatch(gameClear())
    .then(() => new Promise((resolve, reject) => {
      let game = GameFactory.generateGame(6);
      game.start();
      PlayGames.achievementIncrement(PLAYGAMES_ACHIEVEMENT_PUZZLE_LOVER, 1);

      resolve(game);
    }).then(game => dispatch(gameSet(game))));

const gamePause = () => ({type: GAME_PAUSE});
const gameResume = () => ({type: GAME_RESUME});

const gameRuleToggle = (id) => ({type: GAME_TOGGLE_RULE, rule: {id: id}});

const gameSave = (game) => dispatch => game ?
  AsyncStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(GameFactory.saveGame(game)))
    .catch((err) => {
      console.error('Error saving game', err);
      return Promise.resolve();
    }) :
  AsyncStorage.removeItem(GAME_STORAGE_KEY)
    .catch((err) => {
      console.error('Error saving game', err);
      return Promise.resolve();
    });

const gameLoad = () => dispatch =>
  AsyncStorage.getItem(GAME_STORAGE_KEY)
    .then(game => {
      if (game) {
        dispatch(gameSet(GameFactory.loadGame(JSON.parse(game))))
      } else {
        dispatch(gameClear())
      }
    }, () => {
      console.warn('Error loading game from storage');
    });

export {
  gameNew,
  gameClear,
  gamePause,
  gameResume,
  gameRuleToggle,

  gameSave,
  gameLoad,
}