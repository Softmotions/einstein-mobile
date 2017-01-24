'use strict';

import {handleActions} from 'redux-actions';

import {
  SETTINGS_SET
} from '../constants/settings';

export default handleActions({
  [SETTINGS_SET]: (state, action) => ({...action.settings})
}, {});