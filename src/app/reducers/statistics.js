'use strict';

import {handleActions} from 'redux-actions';

import {
  CLEAN_STATISTICS,
  STATS_SET,
} from '../constants/statistics';

export default handleActions({
  [STATS_SET]: (state, action) => ({...action.stats}),
}, CLEAN_STATISTICS);