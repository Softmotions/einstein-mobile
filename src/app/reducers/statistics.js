'use strict';

import {handleActions} from 'redux-actions';

import {
  CLEAN_STATISTICS,
  STAT_SET,
} from '../constants/statistics';

export default handleActions({
  [STAT_SET]: (state, action) => ({...action.stat}),
}, CLEAN_STATISTICS);