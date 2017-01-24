'use strict';

import {combineReducers} from 'redux';

import navigationReducers from './navigation';
import gameReducers from './game';
import statisticsReducers from './statistics';
import settingsReducers from './settings';

export default combineReducers({
  navigationState: navigationReducers,
  game: gameReducers,
  statistics: statisticsReducers,
  settings: settingsReducers
});