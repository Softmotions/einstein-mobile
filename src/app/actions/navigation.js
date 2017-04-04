'use strict';

import {
  NAVIGATION_TO_INDEX,
  NAVIGATION_BACK,
  NAVIGATION_GAME,
  NAVIGATION_HELP,
  NAVIGATION_STAT,
  NAVIGATION_SETTINGS,
} from '../constants/navigation';

const navToIndex = () => ({type: NAVIGATION_TO_INDEX});
const navBack = () => ({type: NAVIGATION_BACK});
const navGame = () => ({type: NAVIGATION_GAME});
const navHelp = () => ({type: NAVIGATION_HELP});
const navStats = () => ({type: NAVIGATION_STAT});
const navSettings = () => ({type: NAVIGATION_SETTINGS});

export {
  navToIndex,
  navBack,
  navGame,
  navHelp,
  navStats,
  navSettings,
};