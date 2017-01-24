'use strict';

import {
  SETTINGS_STORAGE_KEY,

  SETTINGS_SET
} from '../constants/settings';

import {AsyncStorage} from 'react-native';

const settingsLoad = () => dispatch =>
  AsyncStorage.getItem(SETTINGS_STORAGE_KEY)
    .then(settings => settings ? JSON.parse(settings) : {})
    .then(settings => {
      dispatch({type: SETTINGS_SET, settings: settings});
      return Promise.resolve(settings);
    })
    .catch(err => {
      console.error('Error loading settings', err);
      return Promise.resolve({});
    });


const settingsUpdate = (update) => dispatch => {
  AsyncStorage.getItem(SETTINGS_STORAGE_KEY)
    .then(settings => settings ? JSON.parse(settings) : {})
    .then(settings => ({
      ...settings,
      ...update
    }))
    .then(settings => {
      console.debug('update settings to: ', settings);
      return AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
        .then(() => {
          dispatch({type: SETTINGS_SET, settings: settings});
          return Promise.resolve(settings);
        })
        .catch(err => {
          console.error('Error saving settings', err);
          return Promise.resolve(settings);
        });
    })
    .catch(err => {
      console.error('Error loading settings', err);
      return Promise.resolve({});
    });
};

export {
  settingsLoad,
  settingsUpdate
}