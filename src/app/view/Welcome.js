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
import {navGame, navHelp, navStats} from '../actions/navigation';
import {statsGameTry} from '../actions/statistics';
import {settingsUpdate} from '../actions/settings';

import {PLAY_GAMES_LOGGED_IN_KEY} from '../constants/settings';

import {PlayGames} from '../modules/native';

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

  _playGamesSignIn = () => {
    PlayGames.signIn()
      .then(() => {
          console.debug('Play Games sign in');
          this.props._onSettingsUpdate({[PLAY_GAMES_LOGGED_IN_KEY]: true});
        },
        (err) => {
          console.warn(err)
        });
  };

  _playGamesSignOut = () => {
    PlayGames.signOut()
      .then(() => {
        console.debug('Play Games sign out');
        this.props._onSettingsUpdate({[PLAY_GAMES_LOGGED_IN_KEY]: false});
      })
  };

  render() {
    let {game, _onNewGame, _onContinueGame, _onClearGame, _onHelp, _onStat} = this.props;
    let {styles} = this.state;

    // todo: confirm new game!
    return (
      <View onLayout={this._rebuildStyles} style={styles.welcomeScreen}>
        {/* TODO: header */}
        {/*<View style={{*/}
        {/*position: 'absolute',*/}
        {/*top: 0,*/}
        {/*left: 0,*/}
        {/*right: 0,*/}
        {/*height: 30,*/}
        {/*flexDirection: 'row',*/}
        {/*backgroundColor: 'grey'*/}
        {/*}}>*/}
        {/*</View>*/}
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
          {/* TODO: render google sign in button*/}
          <View style={styles.buttonView}>
            {
              !this.props.settings[PLAY_GAMES_LOGGED_IN_KEY] ?
                <Button color={color} title="Play games sign in" onPress={this._playGamesSignIn}/> :
                <Button color={color} title="Play games sign out" onPress={this._playGamesSignOut}/>
            }
          </View>
          {
            this.props.settings[PLAY_GAMES_LOGGED_IN_KEY] ?
              <Button title="inc" onPress={() => PlayGames.achievementUnlock('CgkIwoOo3q4YEAIQAQ')}/> :
              null
          }
        </View>
      </View>
    );
  }
}

export default connect(state => ({
    game: state.game,
    settings: state.settings
  }), dispatch => ({
    _onNewGame: () => {
      dispatch(navGame());
      InteractionManager.runAfterInteractions(() => dispatch(gameNew()).then(() => dispatch(statsGameTry())));
    },
    _onContinueGame: () => {
      dispatch(navGame());
      InteractionManager.runAfterInteractions(() => dispatch(gameResume()));
    },
    _onClearGame: () => dispatch(gameClear()),
    _onHelp: () => dispatch(navHelp()),
    _onStat: () => dispatch(navStats()),

    _onSettingsUpdate: (settings) => dispatch(settingsUpdate(settings))
  })
)(Welcome);