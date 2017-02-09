'use strict';

import React, {Component} from 'react';
import {AppState, DeviceEventEmitter} from 'react-native';
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk';

import SplashScreen from 'react-native-splash-screen';

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
    let {game: {game}} = store.getState();
    if ('background' == currentAppState || 'inactive' == currentAppState) {
      store.dispatch(navToIndex());
      store.dispatch(gamePause());
      store.dispatch(gameSave(game));
    } else if ('active' == currentAppState) {
    }
  };

  _handleGoogleSignOut = (event) => {
    store.dispatch(settingsUpdate({[PLAY_GAMES_LOGGED_IN_KEY]: false}))
  };

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

    const loadGame = () => store.dispatch(gameLoad())
      .then(() => {
          SplashScreen.hide();
        },
        (err) => {
          console.error(err);
          SplashScreen.hide();
        }
      );
    store.dispatch(settingsLoad())
      .then((settings) => {
        if (settings[PLAY_GAMES_LOGGED_IN_KEY]) {
          PlayGames.signIn()
            .then(() => {
                loadGame()
              },
              (err) => {
                loadGame();
              }
            )
        } else {
          loadGame();
        }
      });
  }

  componentWillMount() {
    DeviceEventEmitter.addListener('googleSignOut', this._handleGoogleSignOut);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    DeviceEventEmitter.removeListener('googleSignOut', this._handleGoogleSignOut);
  }

  render = () => (
    <Provider store={store}>
      <Application/>
    </Provider>
  );
};
