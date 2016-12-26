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


const back = (navApp = initialApp) => {
  let {navigationState, game} = navApp;

  navigationState = NavigationStateUtils.jumpTo(navigationState, WELCOME_KEY);

  if (game) {
    game.pause();
  }

  return {
    ...navApp,
    navigationState: navigationState,
  }
};

const newGame = (navApp = initialApp) => {
  let {navigationState, game} = navApp;
  const route = {key: GAME_KEY};

  game = GameFactory.generateGame(6);
  game.start();

  if (NavigationStateUtils.has(navigationState, route.key)) {
    navigationState = NavigationStateUtils.jumpTo(navigationState, route.key);
  } else {
    navigationState = NavigationStateUtils.push(navigationState, route);
  }

  return {
    ...navApp,
    navigationState: navigationState,
    game: game
  }
};

const continueGame = (navApp = initialApp) => {
  let {navigationState, game} = navApp;
  if (game) {
    navigationState = NavigationStateUtils.jumpTo(navigationState, GAME_KEY);
    game.resume();
    return {
      ...navApp,
      navigationState: navigationState
    };
  }
  return {
    ...navApp
  };
};

const help = (navApp = initialApp) => {
  let {navigationState} = navApp;
  const route = {key: HELP_KEY};

  if (NavigationStateUtils.has(navigationState, route.key)) {
    navigationState = NavigationStateUtils.jumpTo(navigationState, route.key);
    // navigationState = NavigationStateUtils.replaceAt(navigationState, route.key, route);
  } else {
    navigationState = NavigationStateUtils.push(navigationState, route);
  }

  return {
    ...navApp,
    navigationState
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