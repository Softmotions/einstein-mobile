'use strict';

import React, {Component} from 'react';
import {
  View,
  Button,
  Platform,
  TouchableHighlight,
  TouchableNativeFeedback,
  Image,
  Text,
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

import  {
    PLAYGAMES_LEADERBOARD_ID
} from '../constants/playgames';

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
    },

      googleButton: {
          backgroundColor: color,
          flexDirection: 'row',
          alignItems: 'center',
          borderColor: color,
          borderWidth: 1,
      },

      googleButtonText: {
          fontSize: 13,
          color: 'white',
          paddingLeft: 16,
          fontFamily: 'sans-serif-medium'
      },

      googleButtonImagePadding: {
          padding: 8,
          backgroundColor: 'white'
      },

      googleButtonImage: {
          height: 18,
          width: 18
      },

      googlePlayPanel: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 30,
          flexDirection: 'row',
          alignItems: 'center'
      },

      googlePlayIcon: {
          height: 24,
          width: 24
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
    let GoogleButton = TouchableHighlight;
    if (Platform.OS === 'android') {
        GoogleButton = TouchableNativeFeedback;
    }

    // todo: confirm new game!
    return (
      <View onLayout={this._rebuildStyles} style={styles.welcomeScreen}>
          <View style={styles.googlePlayPanel}>
              <GoogleButton onPress={() => PlayGames.showAchievements()}>
                  <Image style={styles.googlePlayIcon} source={{uri: 'games_achievements'}} />
              </GoogleButton>
              <GoogleButton onPress={() => PlayGames.showLeaderboard(PLAYGAMES_LEADERBOARD_ID)}>
                  <Image style={styles.googlePlayIcon} source={{uri: 'games_leaderboards'}} />
              </GoogleButton>
          </View>
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
          <View style={styles.buttonView}>
              {
                  !this.props.settings[PLAY_GAMES_LOGGED_IN_KEY] ?
                  <GoogleButton onPress={this._playGamesSignIn}>
                      <View style={styles.googleButton}>
                          <View style={styles.googleButtonImagePadding}>
                              <Image style={styles.googleButtonImage} source={{uri: 'googleicon.png'}}/>
                          </View>
                          <Text style={styles.googleButtonText}>Sign in with Google</Text>
                      </View>
                  </GoogleButton>:
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