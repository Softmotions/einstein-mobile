'use strict';

import {
  STATS_SET,
  STATISTICS_STORAGE_KEY,
  CLEAN_STATISTICS
} from '../constants/statistics';

import {AsyncStorage} from 'react-native';

const loadStats = () => dispatch =>
  AsyncStorage.getItem(STATISTICS_STORAGE_KEY)
    .then(stats => stats ? JSON.parse(stats) : CLEAN_STATISTICS)
    .then(stats => dispatch({type: STATS_SET, stats: stats}))
    .catch(err => {
      console.error('Error loading statistics', err);
      return Promise.resolve(CLEAN_STATISTICS);
    });

const clearStats = () => dispatch =>
  AsyncStorage.setItem(STATISTICS_STORAGE_KEY, JSON.stringify(CLEAN_STATISTICS))
    .then(() => dispatch({type: STATS_SET, stats: CLEAN_STATISTICS}))
    .catch(err => {
      console.error('Error clearing statistics', err);
      return Promise.resolve(CLEAN_STATISTICS);
    });

const updateStats = (update) => dispatch => {
  AsyncStorage.getItem(STATISTICS_STORAGE_KEY)
    .then(stats => stats ? JSON.parse(stats) : CLEAN_STATISTICS)
    .then(stats => {
      Object.keys(update).forEach((k) => {
        let item = update[k];
        if (!item) {
          // nop, skip empty
        } else if (Array.isArray(item)) {
          stats[k] = (stats[k] || []).concat(item);
        } else if (Number.isInteger(item)) {
          stats[k] += item;
        } else {
          stats[k] = item;
        }
      });

      (stats.times = stats.times || []).sort((a, b) => a.time != b.time ? a.time - b.time : a.date - b.date);
      stats.times = stats.times.reduce((acc, t) => acc.length == 0 || acc[acc.length - 1].time != t.time ? [...acc, t] : acc, []);
      stats.times = stats.times.slice(0, 15);

      return AsyncStorage.setItem(STATISTICS_STORAGE_KEY, JSON.stringify(stats))
        .then(() => dispatch({type: STATS_SET, stats: stats}))
        .catch(err => {
          console.error('Error saving statistics', err);
          return Promise.resolve(stats);
        });
    })
    .catch(err => {
      console.error('Error loading statistics', err);
      return Promise.resolve(CLEAN_STATISTICS);
    });
};

const statsGameTry = () => updateStats({tries: 1});
const statsGameFailed = () => updateStats({failed: 1});
const statsGameSolved = (time) => updateStats({successfully: 1, times: [time]});

export {
  loadStats,
  clearStats,
  statsGameTry,
  statsGameFailed,
  statsGameSolved
}