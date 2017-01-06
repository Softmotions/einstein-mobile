'use strict';

import {handleActions} from 'redux-actions';

import {WELCOME_SCREEN_KEY, GAME_SCREEN_KEY, HELP_SCREEN_KEY} from '../constants/navigation';
import {
  NAVIGATION_BACK,
  NAVIGATION_GAME,
  NAVIGATION_HELP
} from '../constants/navigation';

import {NavigationExperimental} from 'react-native';
const {
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

const initialNavigation = {
  index: 0,
  routes: [{key: WELCOME_SCREEN_KEY}]
};

const safeJumpTo = (navigationState, route) =>
  NavigationStateUtils.has(navigationState, route.key) ?
    NavigationStateUtils.jumpTo(navigationState, route.key) :
    NavigationStateUtils.push(navigationState, route);

// todo: ???
const backTo = (navigationState, route) => NavigationStateUtils.pop(navigationState);

const navigationBack = (navigationState = initialNavigation) => backTo(navigationState, {key: WELCOME_SCREEN_KEY});
const navigationGame = (navigationState = initialNavigation) => safeJumpTo(navigationState, {key: GAME_SCREEN_KEY});
const navigationHelp = (navigationState = initialNavigation) => safeJumpTo(navigationState, {key: HELP_SCREEN_KEY});

export default handleActions({
  [NAVIGATION_BACK]: navigationBack,
  [NAVIGATION_GAME]: navigationGame,
  [NAVIGATION_HELP]: navigationHelp
}, initialNavigation);
