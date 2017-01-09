'use strict';

import React, {Component} from 'react';
import {
  View,
  Button,
  StyleSheet,
  InteractionManager
} from 'react-native';

import {connect} from 'react-redux';

import {
  NAVIGATION_GAME,
  NAVIGATION_HELP,
  NAVIGATION_STAT
} from '../constants/navigation';

import {
  GAME_CREATE,
  GAME_CLEAR,
  GAME_RESUME
} from '../constants/game';

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
      // const handle = InteractionManager.createInteractionHandle();
      dispatch({type: GAME_CLEAR});
      dispatch({type: NAVIGATION_GAME});
      // InteractionManager.clearInteractionHandle(handle);
      InteractionManager.runAfterInteractions(() => {
        dispatch({type: GAME_CREATE})
      });
    },
    _onContinueGame: () => {
      // todo: create game if not exists?
      dispatch({type: NAVIGATION_GAME})
      InteractionManager.runAfterInteractions(() => {
        dispatch({type: GAME_RESUME})
      });
    },
    _onHelp: () => dispatch({type: NAVIGATION_HELP}),
    _onStat: () => dispatch({type: NAVIGATION_STAT}),
  })
)(Welcome);