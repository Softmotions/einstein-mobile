'use strict';

import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet
} from 'react-native';

import {connect} from 'react-redux';

class Help extends Component {
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>TODO: Help!</Text>
      </View>
    );
  }
}

export default connect(state => ({}), dispatch => ({}))(Help);