'use strict';

import {combineReducers} from 'redux';

import navigationReducers from './navigation';
import gameReducers from './game';
import statisticReducers from './statistic';

export default combineReducers({
  navigationState: navigationReducers,
  game: gameReducers,
  statistic: statisticReducers,
});