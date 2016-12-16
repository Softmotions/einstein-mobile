'use strict';

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, View, Text, Button} from 'react-native';

import Einstein from './src/einstein';

export default class Application extends Component {
  render() {
    return (
      <View style={styles.main}>
        <Einstein style={{flex:1}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    flex: 1,
  }
});

AppRegistry.registerComponent('Einstein', () => Application);
