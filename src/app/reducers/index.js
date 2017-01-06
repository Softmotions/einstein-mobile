'use strict';

import {handleActions} from 'redux-actions';
import {combineReducers} from 'redux';

import navigationReducers from './navigation';
import gameReducers from './game';

export default combineReducers({
  navigationState: navigationReducers,
  game: gameReducers,
});