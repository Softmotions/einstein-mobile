'use strict';

import NativeModule from 'softmotions-einstein-native';

const {
  GameActivity,
  PlayGames,
  Locale
} = NativeModule;

class LocaleModule {
  static getString(name) {
    return Locale[name];
  }
}

export {
  GameActivity,
  PlayGames,
  LocaleModule
}