'use strict';

import React, {Component} from 'react';
import {AppState, DeviceEventEmitter} from 'react-native';
import {legacy_createStore as createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {thunk} from 'redux-thunk';

import reducers from './app/reducers';
import Application from './app';

import {gameLoad, gameSave, gamePause} from './app/actions/game';
import {navToIndex} from './app/actions/navigation';
import {settingsLoad, settingsUpdate} from './app/actions/settings';

import {PLAY_GAMES_LOGGED_IN_KEY} from './app/constants/settings';

import {PlayGames} from './app/modules/native';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducers);

export default class Einstein extends Component {

  _handleAppStateChange = (currentAppState) => {
    let {game: {game, rules}} = store.getState();
    if (game && ('background' == currentAppState || 'inactive' == currentAppState)) {
      store.dispatch(navToIndex());
      store.dispatch(gamePause());
      store.dispatch(gameSave(game, rules));
      console.log('saved');
    } else if ('active' == currentAppState) {
    }
  };

  _handleGoogleSignOut = (event) => {
    store.dispatch(settingsUpdate({[PLAY_GAMES_LOGGED_IN_KEY]: false}));
  };

  componentDidMount() {
    this._appStateSubscription = AppState.addEventListener('change', this._handleAppStateChange);
    this._signOutSubscription = DeviceEventEmitter.addListener('googleSignOut', this._handleGoogleSignOut);

    const loadGame = () => store.dispatch(gameLoad())
      .then(() => console.log('loaded'),
        (err) => console.error(err));

    const signIn = (signed) => {
      loadGame();
      if (!__DEV__) {
        PlayGames.signIn()
          .then(() => !signed ? store.dispatch(settingsUpdate({[PLAY_GAMES_LOGGED_IN_KEY]: true})) : Promise.resolve())
          .catch(err => console.warn('Play Games sign in failed', err));
      }
    };

    store.dispatch(settingsLoad())
      .then(settings => signIn(settings[PLAY_GAMES_LOGGED_IN_KEY]),
        err => signIn(false));
  }

  componentWillUnmount() {
    this._appStateSubscription && this._appStateSubscription.remove();
    this._signOutSubscription && this._signOutSubscription.remove();
  }

  render = () => (
    <Provider store={store}>
      <Application/>
    </Provider>
  );
};
