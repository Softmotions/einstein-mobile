'use strict';

const CLEAN_STATISTICS = {
  tries: 0,
  trySolved: false,
  successfully: 0,
  failed: 0,
  maxStack: 0,
  currentStack: 0,
  times: [],
  solvedDates: []
};

const STATISTICS_STORAGE_KEY = '@Einstein:statistics';

const STATS_SET = 'STATISTICS_SET';

export {
  STATISTICS_STORAGE_KEY,
  STATS_SET,
  CLEAN_STATISTICS
}