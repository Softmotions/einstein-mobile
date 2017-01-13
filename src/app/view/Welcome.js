'use strict';

import React, {Component} from 'react';
import {
  View,
  Button,
  StyleSheet,
  InteractionManager
} from 'react-native';

import {connect} from 'react-redux';

import {gameNew, gameResume, gameClear} from '../actions/game';
import {navGame, navHelp, navStat} from '../actions/navigation';
import {statGameTry} from '../actions/statistics';

class Welcome extends Component {
  render() {
    let {game, _onNewGame, _onContinueGame, _onClearGame, _onHelp, _onStat} = this.props;

    // todo: confirm new game!
    return (
      <View style={styles.welcomeScreen}>
        <View style={styles.buttonsView}>
          <View style={styles.buttonView}>
            <Button color="#013397ff" title="New game" onPress={_onNewGame} style={{flex: 1}}/>
          </View>
          <View style={styles.buttonView}>
            <Button disabled={!game.game} color="#013397ff" title="Continue" onPress={_onContinueGame}/>
          </View>
          { __DEV__ ?
            <View style={styles.buttonView}>
              <Button disabled={!game.game} color="#013397ff" title="Kill game" onPress={_onClearGame}/>
            </View> : null
          }
          <View style={styles.buttonView}>
            <Button color="#013397ff" title="Help" onPress={_onHelp}/>
          </View>
          <View style={styles.buttonView}>
            <Button color="#013397ff" title="Statistics" onPress={_onStat}/>
          </View>
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

  buttonsView: {
    flexDirection: 'column',
  },

  buttonView: {
    margin: 3,
  },
});


export default connect(state => ({
    game: state.game
  }), dispatch => ({
    _onNewGame: () => {
      dispatch(navGame());
      InteractionManager.runAfterInteractions(() => dispatch(gameNew()).then(() => dispatch(statGameTry())));
    },
    _onContinueGame: () => {
      dispatch(navGame());
      InteractionManager.runAfterInteractions(() => dispatch(gameResume()));
    },
    _onClearGame: () => dispatch(gameClear()),
    _onHelp: () => dispatch(navHelp()),
    _onStat: () => dispatch(navStat()),
  })
)(Welcome);