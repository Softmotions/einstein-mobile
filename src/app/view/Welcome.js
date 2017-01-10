'use strict';

import React, {Component} from 'react';
import {
  View,
  Button,
  StyleSheet,
  InteractionManager
} from 'react-native';

import {connect} from 'react-redux';

import {gameNew, gameClear, gameResume} from '../actions/game';
import {navGame, navHelp, navStat} from '../actions/navigation';
import {statGameTry} from '../actions/statistic';

class Welcome extends Component {
  render() {
    let {game, _onNewGame, _onContinueGame, _onHelp, _onStat} = this.props;

    // todo: confirm new game!
    return (
      <View style={styles.welcomeScreen}>
        <View style={styles.button}>
          <Button color="grey" title="New game" onPress={_onNewGame}/>
        </View>
        <View style={styles.button}>
          <Button disabled={!game.game} color="grey" title="Continue" onPress={_onContinueGame}/>
        </View>
        <View style={styles.button}>
          <Button color="grey" title="Help" onPress={_onHelp}/>
        </View>
        <View style={styles.button}>
          <Button color="grey" title="Statistic" onPress={_onStat}/>
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
    game: state.game
  }), dispatch => ({
    _onNewGame: () => {
      dispatch(gameClear());
      dispatch(navGame());
      InteractionManager.runAfterInteractions(() => {
        dispatch(gameNew());
        dispatch(statGameTry());
      });
    },
    _onContinueGame: () => {
      dispatch(navGame());
      InteractionManager.runAfterInteractions(() => {
        dispatch(gameResume())
      });
    },
    _onHelp: () => dispatch(navHelp()),
    _onStat: () => dispatch(navStat()),
  })
)(Welcome);