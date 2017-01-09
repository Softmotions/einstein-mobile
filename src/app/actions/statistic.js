'use strict';

import {
  STAT_SET,
  STATISTIC_STORAGE_KEY,
  CLEAN_STATISTIC
} from '../constants/statistic';

import {AsyncStorage} from 'react-native';

const loadStat = () => dispatch =>
  AsyncStorage.getItem(STATISTIC_STORAGE_KEY)
    .then(stat => stat ? JSON.parse(stat) : CLEAN_STATISTIC)
    .then(stat => dispatch({type: STAT_SET, stat: stat}))
    .catch(err => {
      console.error('Error loading statistic', err);
      return Promise.resolve(CLEAN_STATISTIC);
    });

const clearStat = () => dispatch =>
  AsyncStorage.setItem(STATISTIC_STORAGE_KEY, JSON.stringify(CLEAN_STATISTIC))
    .then(() => dispatch({type: STAT_SET, stat: CLEAN_STATISTIC}))
    .catch(err => {
      console.error('Error loading statistic', err);
      return Promise.resolve(CLEAN_STATISTIC);
    });

const updateStat = (update) => dispatch => {
  AsyncStorage.getItem(STATISTIC_STORAGE_KEY)
    .then(stat => stat ? JSON.parse(stat) : CLEAN_STATISTIC)
    .then(stat => {
      Object.keys(update).forEach((k) => {
        let item = update[k];
        if (!item) {
          // nop, skip empty
        } else if (Array.isArray(item)) {
          stat[k] = (stat[k] || []).concat(item);
        } else if (Number.isInteger(item)) {
          stat[k] += item;
        } else {
          stat[k] = item;
        }
      });

      // todo: times limit
      // todo: check time duplicates
      (stat.times = stat.times || []).sort((a, b) => a.time - b.time);

      return AsyncStorage.setItem(STATISTIC_STORAGE_KEY, JSON.stringify(stat))
        .then(() => dispatch({type: STAT_SET, stat: stat}))
        .catch(err => {
          console.error('Save statistic error', err);
          return Promise.resolve(stat);
        });
    })
    .catch(err => {
      console.error('Error loading statistic', err);
      return Promise.resolve(CLEAN_STATISTIC);
    });
};

const statGameTry = () => updateStat({tries: 1});
const statGameFailed = () => updateStat({failed: 1});
const statGameSolved = (time) => updateStat({successfully: 1, times: [time]});

export {
  loadStat,
  clearStat,
  statGameTry,
  statGameFailed,
  statGameSolved
}