'use strict';

import {
  NAVIGATION_BACK,
  NAVIGATION_GAME,
  NAVIGATION_HELP,
  NAVIGATION_STAT,
} from '../constants/navigation';

const navBack = () => ({type: NAVIGATION_BACK});
const navGame = () => ({type: NAVIGATION_GAME});
const navHelp = () => ({type: NAVIGATION_HELP});
const navStat = () => ({type: NAVIGATION_STAT});

export {
  navBack,
  navGame,
  navHelp,
  navStat,
}