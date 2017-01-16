'use strict';

import React, {Component} from 'react';
import {
  View,
  Button,
  StyleSheet,
  Dimensions,
  InteractionManager
} from 'react-native';

import {connect} from 'react-redux';

import {gameNew, gameResume, gameClear} from '../actions/game';
import {navGame, navHelp, navStat} from '../actions/navigation';
import {statGameTry} from '../actions/statistics';

const color = '#013397ff';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      styles: this._buildStyles()
    }
  }

  _rebuildStyles = () => {
    this.setState({
      styles: this._buildStyles()
    });
  };

  _buildStyles = () => StyleSheet.create({
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
      width: Math.floor(Dimensions.get('window').width / 2)
    }
  });

  render() {
    let {game, _onNewGame, _onContinueGame, _onClearGame, _onHelp, _onStat} = this.props;
    let {styles} = this.state;

    // todo: confirm new game!
    return (
      <View onLayout={this._rebuildStyles} style={styles.welcomeScreen}>
        <View style={styles.buttonsView}>
          <View style={styles.buttonView}>
            <Button color={color} title="New game" onPress={_onNewGame}/>
          </View>
          <View style={styles.buttonView}>
            <Button disabled={!game.game} color={color} title="Continue" onPress={_onContinueGame}/>
          </View>
          { __DEV__ ?
            <View style={styles.buttonView}>
              <Button disabled={!game.game} color={color} title="Kill game" onPress={_onClearGame}/>
            </View> : null
          }
          <View style={styles.buttonView}>
            <Button color={color} title="Help" onPress={_onHelp}/>
          </View>
          <View style={styles.buttonView}>
            <Button color={color} title="Statistics" onPress={_onStat}/>
          </View>
        </View>
      </View>
    );
  }
}

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