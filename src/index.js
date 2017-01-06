'use strict';

import React, {Component} from 'react';
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import promiseMiddleware from 'redux-promise';
// import thunk from 'redux-thunk';

import reducers from './app/reducers';
import Application from './app';

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware)(createStore);
const store = createStoreWithMiddleware(reducers);

export default class Einstein extends Component {
  render() {
    return (
      <Provider store={store}>
        <Application/>
      </Provider>
    );
  }
};
