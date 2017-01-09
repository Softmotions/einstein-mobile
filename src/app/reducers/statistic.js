'use strict';

import {handleActions} from 'redux-actions';

import {
  CLEAN_STATISTIC,
  STAT_SET,
} from '../constants/statistic';

export default handleActions({
  [STAT_SET]: (state, action) => ({...action.stat}),
}, CLEAN_STATISTIC);