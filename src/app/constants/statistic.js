'use strict';

const CLEAN_STATISTIC = {
  tries: 0,
  successfully: 0,
  failed: 0,
  times: []
};

const STATISTIC_STORAGE_KEY = '@Einstein:statistic';

const STAT_SET = 'STATISTIC_SET';

export {
  STATISTIC_STORAGE_KEY,
  STAT_SET,
  CLEAN_STATISTIC
}