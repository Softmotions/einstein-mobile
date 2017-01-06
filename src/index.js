'use strict';

import React, {Component} from 'react';
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk';

import reducers from './app/reducers';
import Application from './app';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducers);

export default class Einstein extends Component {
  render = () => (
    <Provider store={store}>
      <Application/>
    </Provider>
  );
};
