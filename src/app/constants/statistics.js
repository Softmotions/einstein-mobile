'use strict';

const CLEAN_STATISTICS = {
  tries: 0,
  successfully: 0,
  failed: 0,
  times: []
};

const STATISTICS_STORAGE_KEY = '@Einstein:statistics';

const STAT_SET = 'STATISTICS_SET';

export {
  STATISTICS_STORAGE_KEY,
  STAT_SET,
  CLEAN_STATISTICS
}