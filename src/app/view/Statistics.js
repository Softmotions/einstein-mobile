'use strict';

import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet
} from 'react-native';

import {connect} from 'react-redux';

class Statistics extends Component {
  render = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>TODO: Statistics!</Text>
    </View>
  );
}

export default connect(state => ({}), dispatch => ({}))(Statistics);