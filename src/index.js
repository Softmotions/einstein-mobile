'use strict';

import React, {Component} from 'react';
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk';

import SplashScreen from 'react-native-splash-screen';

import reducers from './app/reducers';
import Application from './app';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducers);

export default class Einstein extends Component {

  componentDidMount = () => SplashScreen.hide();

  render = () => (
    <Provider store={store}>
      <Application/>
    </Provider>
  );
};
