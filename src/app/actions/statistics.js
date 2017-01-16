'use strict';

import {
  STAT_SET,
  STATISTICS_STORAGE_KEY,
  CLEAN_STATISTICS
} from '../constants/statistics';

import {AsyncStorage} from 'react-native';

const loadStat = () => dispatch =>
  AsyncStorage.getItem(STATISTICS_STORAGE_KEY)
    .then(stat => stat ? JSON.parse(stat) : CLEAN_STATISTICS)
    .then(stat => dispatch({type: STAT_SET, stat: stat}))
    .catch(err => {
      console.error('Error loading statistics', err);
      return Promise.resolve(CLEAN_STATISTICS);
    });

const clearStat = () => dispatch =>
  AsyncStorage.setItem(STATISTICS_STORAGE_KEY, JSON.stringify(CLEAN_STATISTICS))
    .then(() => dispatch({type: STAT_SET, stat: CLEAN_STATISTICS}))
    .catch(err => {
      console.error('Error clearing statistics', err);
      return Promise.resolve(CLEAN_STATISTICS);
    });

const updateStat = (update) => dispatch => {
  AsyncStorage.getItem(STATISTICS_STORAGE_KEY)
    .then(stat => stat ? JSON.parse(stat) : CLEAN_STATISTICS)
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

      (stat.times = stat.times || []).sort((a, b) => a.time != b.time ? a.time - b.time : a.date - b.date);
      stat.times = stat.times.reduce((acc, t) => acc.length == 0 || acc[acc.length - 1].time != t.time ? [...acc, t] : acc, []);
      stat.times = stat.times.slice(0, 15);

      return AsyncStorage.setItem(STATISTICS_STORAGE_KEY, JSON.stringify(stat))
        .then(() => dispatch({type: STAT_SET, stat: stat}))
        .catch(err => {
          console.error('Error saving statistics', err);
          return Promise.resolve(stat);
        });
    })
    .catch(err => {
      console.error('Error loading statistics', err);
      return Promise.resolve(CLEAN_STATISTICS);
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