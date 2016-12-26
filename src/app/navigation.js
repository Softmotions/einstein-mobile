'use strict';

import {handleActions} from 'redux-actions';
import {combineReducers} from 'redux';

import {NavigationExperimental} from 'react-native';
const {
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;


import {GameFactory} from './modules/controller';

const WELCOME_KEY = 'welcome';
const GAME_KEY = 'game';
const HELP_KEY = 'help';

const initialApp = {
  navigationState: {
    index: 0,
    routes: [{key: WELCOME_KEY}]
  },
  game: null
};


const safeJumpTo = (navigationState, route) =>
  NavigationStateUtils.has(navigationState, route.key) ?
    NavigationStateUtils.jumpTo(navigationState, route.key) :
    NavigationStateUtils.push(navigationState, route);

const back = (navApp = initialApp) => {
  let {navigationState, game} = navApp;

  if (game) {
    game.pause();
  }

  return {
    ...navApp,
    navigationState: NavigationStateUtils.jumpTo(navigationState, WELCOME_KEY),
  }
};

const newGame = (navApp = initialApp) => {
  let {navigationState, game} = navApp;
  const route = {key: GAME_KEY};

  game = GameFactory.generateGame(6);
  game.start();

  return {
    ...navApp,
    navigationState: safeJumpTo(navigationState, route),
    game
  }
};

const continueGame = (navApp = initialApp) => {
  let {navigationState, game} = navApp;
  const route = {key: GAME_KEY};

  if (game) {
    game.resume();
    return {
      ...navApp,
      navigationState: safeJumpTo(navigationState, route)
    };
  }
  return {
    ...navApp
  };
};

const help = (navApp = initialApp) => {
  let {navigationState} = navApp;
  const route = {key: HELP_KEY};

  return {
    ...navApp,
    navigationState: safeJumpTo(navigationState, route)
  }
};

export default combineReducers({
  app: handleActions({
    ['back']: back,
    ['new']: newGame,
    ['continue']: continueGame,
    ['help']: help
  }, initialApp)
});