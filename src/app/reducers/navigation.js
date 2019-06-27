'use strict';

import {handleActions} from 'redux-actions';

import {
  GAME_SCREEN_KEY,
  HELP_SCREEN_KEY,
  NAVIGATION_BACK,
  NAVIGATION_GAME,
  NAVIGATION_HELP,
  NAVIGATION_SETTINGS,
  NAVIGATION_STAT,
  NAVIGATION_TO_INDEX,
  SETTINGS_SCREEN_KEY,
  STAT_SCREEN_KEY,
  WELCOME_SCREEN_KEY,
} from '../constants/navigation';

import NavigationExperimental from 'react-native-navigation-experimental-compat';
const {
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

const initialNavigation = {
  index: 0,
  routes: [{key: WELCOME_SCREEN_KEY}],
};

const safeJumpTo = (navigationState, route) =>
  NavigationStateUtils.has(navigationState, route.key) ?
    NavigationStateUtils.jumpTo(navigationState, route.key) :
    NavigationStateUtils.push(navigationState, route);

const back = (navigationState) => NavigationStateUtils.pop(navigationState);

const navigationToIndex = (navigationState = initialNavigation) => NavigationStateUtils.reset(navigationState, initialNavigation.routes);
const navigationBack = (navigationState = initialNavigation) => back(navigationState);
const navigationGame = (navigationState = initialNavigation) => safeJumpTo(navigationState, {key: GAME_SCREEN_KEY});
const navigationHelp = (navigationState = initialNavigation) => safeJumpTo(navigationState, {key: HELP_SCREEN_KEY});
const navigationStat = (navigationState = initialNavigation) => safeJumpTo(navigationState, {key: STAT_SCREEN_KEY});
const navigationSettings = (navigationState = initialNavigation) => safeJumpTo(navigationState, {key: SETTINGS_SCREEN_KEY});

export default handleActions({
  [NAVIGATION_TO_INDEX]: navigationToIndex,
  [NAVIGATION_BACK]: navigationBack,
  [NAVIGATION_GAME]: navigationGame,
  [NAVIGATION_HELP]: navigationHelp,
  [NAVIGATION_STAT]: navigationStat,
  [NAVIGATION_SETTINGS]: navigationSettings,
}, initialNavigation);
