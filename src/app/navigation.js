'use strict';

import {handleActions} from 'redux-actions';
import {combineReducers} from 'redux';

import {NavigationExperimental} from 'react-native';
const {
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;


import {GameFactory} from './modules/controller';

const initialApp = {
  navigationState: {
    index: 0,
    routes: [{key: 'welcome'}]
  },
  game: null
};


const newGame = (navApp = initialApp) => {
  let {navigationState, game} = navApp;
  const route = {key: 'game'};

  game = GameFactory.generateGame(6);
  game.start();

  if (NavigationStateUtils.has(navigationState, route.key)) {
    navigationState = NavigationStateUtils.jumpTo(navigationState, route.key);
    // navigationState = NavigationStateUtils.replaceAt(navigationState, route.key, route);
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
  if (game && !game.finished) {
    navigationState = NavigationStateUtils.jumpTo(navigationState, 'game');
    game.resume();
    return {
      ...navApp,
      navigationState: navigationState
    };
  }
  return newGame(navApp);
};

export default combineReducers({
  app: handleActions({
    ['back']: (navApp = initialApp) => {
      let {navigationState, game} = navApp;

      // TODO: rewrite!

      navigationState = NavigationStateUtils.jumpTo(navigationState, 'welcome');

      // if (game && game.finished) {
      //   navigationState = NavigationStateUtils.pop(navigationState);
      // } else {
      //   navigationState = NavigationStateUtils.back(navigationState);
      // }

      if (game) {
        game.pause();
      }

      return {
        ...navApp,
        navigationState: navigationState,
        // game: game
      }
    },
    ['new']: newGame,
    ['continue']: continueGame,
    ['help']: (navApp = initialApp) => {
      let {navigationState} = navApp;
      const route = {key: 'help'};

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
    }
  }, initialApp)
});