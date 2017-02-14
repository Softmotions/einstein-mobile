'use strict';

import {
  STATS_SET,
  STATISTICS_STORAGE_KEY,
  CLEAN_STATISTICS
} from '../constants/statistics';

import {AsyncStorage} from 'react-native';

const STATISTICS_ITEMS_COUNT = 50;

const statsLoad = () => dispatch =>
  AsyncStorage.getItem(STATISTICS_STORAGE_KEY)
    .then(stats => stats ? JSON.parse(stats) : CLEAN_STATISTICS)
    .then(stats => dispatch({type: STATS_SET, stats: stats}))
    .catch(err => {
      console.error('Error loading statistics', err);
      return Promise.resolve(CLEAN_STATISTICS);
    });

const statsClear = () => dispatch =>
  AsyncStorage.setItem(STATISTICS_STORAGE_KEY, JSON.stringify(CLEAN_STATISTICS))
    .then(() => dispatch({type: STATS_SET, stats: CLEAN_STATISTICS}))
    .catch(err => {
      console.error('Error clearing statistics', err);
      return Promise.resolve(CLEAN_STATISTICS);
    });

const updateStats = (update) => dispatch =>
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
        } else if (typeof item == 'function') {
          item.call(stats, stats);
        } else {
          stats[k] = item;
        }
      });

      (stats.times = stats.times || []).sort((a, b) => a.time != b.time ? a.time - b.time : a.date - b.date);
      stats.times = stats.times.reduce((acc, t) => {
        if (acc.length != 0 && acc[acc.length - 1].time == t.time) {
          acc[acc.length - 1].repeats = (acc[acc.length - 1].repeats || 1) + (t.repeats || 1);
          return acc;
        } else {
          return [...acc, t];
        }
      }, []);
      stats.times = stats.times.slice(0, STATISTICS_ITEMS_COUNT);

      return AsyncStorage.setItem(STATISTICS_STORAGE_KEY, JSON.stringify(stats))
        .then(() => {
          dispatch({type: STATS_SET, stats: stats});
          return Promise.resolve(stats);
        })
        .catch(err => {
          console.error('Error saving statistics', err);
          return Promise.resolve(stats);
        });
    })
    .catch(err => {
      console.error('Error loading statistics', err);
      return Promise.resolve(CLEAN_STATISTICS);
    });

const statsGameTry = () => updateStats({
  tries: 1, stack: (stats) => {
    if (!stats.trySolved) {
      stats.currentStack = 0;
    }
    stats.trySolved = false;
  }
});
const statsGameFailed = () => updateStats({
  failed: 1, stack: (stats) => {
    stats.currentStack = 0;
  }
});
const statsGameSolved = (time) => updateStats({
  successfully: 1, times: [time], solvedDates: [time.date], stack: (stats) => {
    stats.trySolved = true;
    stats.currentStack++;
    stats.maxStack = Math.max(stats.currentStack, stats.maxStack);
  }
});

export {
  statsLoad,
  statsClear,
  statsGameTry,
  statsGameFailed,
  statsGameSolved
}