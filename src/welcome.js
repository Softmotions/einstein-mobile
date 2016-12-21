'use strict';

import React, {Component} from 'react';
import {
  View,
  Button,
  StyleSheet
} from 'react-native';

export default class Welcome extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.welcomeScreen}>
        <View style={styles.button}><Button title="New game" onPress={this.props.onNewGame}/></View>
        {this.props.game && !this.props.game.finished ?
          <View style={styles.button}><Button title="Continue" onPress={this.props.onContinueGame}/></View> :
          null }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  welcomeScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  button: {
    margin: 5
  },
});