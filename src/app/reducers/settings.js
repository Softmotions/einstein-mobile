'use strict';

import {handleActions} from 'redux-actions';

import {
  SETTINGS_SET,
  VIBRATE_ACTION_CHANGE,
} from '../constants/settings';

const initialSettings = {
  [VIBRATE_ACTION_CHANGE]: true,
};

export default handleActions({
  [SETTINGS_SET]: (state, action) => ({...initialSettings, ...action.settings})
}, {});