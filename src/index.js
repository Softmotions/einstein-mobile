'use strict';

import React, {Component} from 'react';
import {AppState} from 'react-native';
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk';

import SplashScreen from 'react-native-splash-screen';

import reducers from './app/reducers';
import Application from './app';

import {gameLoad, gameSave} from './app/actions/game';
import {navToIndex} from './app/actions/navigation';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducers);

export default class Einstein extends Component {

  _handleAppStateChange = (currentAppState) => {
    let {game: {game}} = store.getState();
    if ('background' == currentAppState || 'inactive' == currentAppState) {
      store.dispatch(navToIndex());
      store.dispatch(gameSave(game));
    } else if ('active' == currentAppState) {
    }
  };

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

    store.dispatch(gameLoad()).then(
      () => SplashScreen.hide(),
      (err) => {
        console.error(err);
        SplashScreen.hide();
      }
    );
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  render = () => (
    <Provider store={store}>
      <Application/>
    </Provider>
  );
};
