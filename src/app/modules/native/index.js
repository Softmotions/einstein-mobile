'use strict';

import {NativeModules} from 'react-native';

//noinspection JSUnresolvedVariable
const GameActivity = NativeModules.GameActivity;
//noinspection JSUnresolvedVariable
const PlayGames = NativeModules.PlayGames;
//noinspection JSUnresolvedVariable
const Locale = NativeModules.Locale;

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