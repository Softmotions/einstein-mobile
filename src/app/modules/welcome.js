'use strict';

import React, {Component} from 'react';
import {
  View,
  Button,
  StyleSheet
} from 'react-native';

import {connect} from 'react-redux';

class Welcome extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {game, _onNewGame, _onContinueGame} = this.props;
    return (
      <View style={styles.welcomeScreen}>
        <View style={styles.button}><Button title="New game" onPress={_onNewGame}/></View>
        {game && !game.finished ?
          <View style={styles.button}><Button title="Continue" onPress={_onContinueGame}/></View> :
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


export default connect(state => ({
    game: state.app.game
  }), dispatch => ({
    _onNewGame: () => dispatch({type: 'new'}),
    _onContinueGame: () => dispatch({type: 'continue'})
  })
)(Welcome);