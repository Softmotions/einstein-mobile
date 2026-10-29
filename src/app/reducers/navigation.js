'use strict';

import {handleActions} from '../utils/redux';

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

const initialNavigation = {
  index: 0,
  routes: [{key: WELCOME_SCREEN_KEY}],
};

// Minimal navigation stack, previously provided by NavigationExperimental StateUtils.
const has = (navigationState, key) => navigationState.routes.some(route => route.key === key);

const push = (navigationState, route) => ({
  ...navigationState,
  index: navigationState.routes.length,
  routes: [...navigationState.routes, route],
});

const jumpTo = (navigationState, key) => {
  const index = navigationState.routes.findIndex(route => route.key === key);
  return index === -1 ? navigationState : {...navigationState, index};
};

const pop = (navigationState) => {
  if (navigationState.index <= 0 || navigationState.routes.length <= 1) {
    return navigationState;
  }
  const routes = navigationState.routes.slice(0, -1);
  return {
    index: Math.min(navigationState.index, routes.length - 1),
    routes,
  };
};

const safeJumpTo = (navigationState, route) =>
  has(navigationState, route.key) ?
    jumpTo(navigationState, route.key) :
    push(navigationState, route);

const navigationToIndex = (navigationState = initialNavigation) => ({
  index: initialNavigation.index,
  routes: initialNavigation.routes,
});
const navigationBack = (navigationState = initialNavigation) => pop(navigationState);
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
