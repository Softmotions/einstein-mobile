'use strict';

import React, {Component} from 'react';
import {
  View,
  Button,
  StyleSheet
} from 'react-native';

import {connect} from 'react-redux';

class Welcome extends Component {
  render() {
    let {game, _onNewGame, _onContinueGame, _onHelp} = this.props;

    // todo: confirm new game!
    return (
      <View style={styles.welcomeScreen}>
        <View style={styles.button}>
          <Button color="grey" title="New game" onPress={_onNewGame}/>
        </View>
        <View style={styles.button}>
          <Button disabled={!game} color="grey" title="Continue" onPress={_onContinueGame}/>
        </View>
        <View style={styles.button}>
          <Button color="grey" title="Help" onPress={_onHelp}/>
        </View>
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
    _onContinueGame: () => dispatch({type: 'continue'}),
    _onHelp: () => dispatch({type: 'help'}),
  })
)(Welcome);