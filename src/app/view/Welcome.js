'use strict';

import React, {Component} from 'react';
import {
  Button,
  Dimensions,
  Image,
  InteractionManager,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from 'react-native';

import {connect} from 'react-redux';

import {gameClear, gameNew, gameResume} from '../actions/game';
import {navGame, navHelp, navSettings, navStats} from '../actions/navigation';
import {statsGameTry} from '../actions/statistics';
import {settingsUpdate} from '../actions/settings';

import {i18n} from '../utils/i18n';

import {PLAY_GAMES_LOGGED_IN_KEY} from '../constants/settings';

import {PLAYGAMES_LEADERBOARD_ID, PLAYGAMES_LEADERBOARD_STACK_ID} from '../constants/playgames';

import {PlayGames} from '../modules/native';

import {Header} from './header';
import {ImageHeaderButton} from './header/buttons';

const color = '#013397ff';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      styles: this._buildStyles(),
    };
  }

  _rebuildStyles = () => {
    this.setState({
      styles: this._buildStyles(),
    });
  };

  _buildStyles = () => StyleSheet.create({
    welcomeScreen: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    buttonsView: {
      flexDirection: 'column',
    },

    buttonView: {
      margin: 3,
      width: Math.floor(Dimensions.get('window').width / 2),
    },

    googleButton: {
      backgroundColor: color,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 2,
      elevation: 4,
    },

    googleButtonText: {
      fontSize: 13,
      color: 'white',
      paddingLeft: 16,
      fontFamily: 'sans-serif-medium',
    },

    googleButtonImagePadding: {
      padding: 1,
    },

    googleButtonImage: {
      height: 33,
      width: 33,
    },
  });

  _playGamesSignIn = () => {
    PlayGames.signIn()
      .then(() => {
          console.debug('Play Games sign in');
          this.props._onSettingsUpdate({[PLAY_GAMES_LOGGED_IN_KEY]: true});
        },
        (err) => {
          console.warn(err);
        });
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
        <View style={styles.buttonView}>
          <Button color={color} title={i18n.button.tr('new')} onPress={_onNewGame}/>
        </View>
        <View style={styles.buttonView}>
          <Button disabled={!game.game} color={color} title={i18n.button.tr('continue')} onPress={_onContinueGame}/>
        </View>
        { __DEV__ ?
          <View style={styles.buttonView}>
            <Button disabled={!game.game} color={color} title="Kill game" onPress={_onClearGame}/>
          </View> : null
        }
        <View style={styles.buttonView}>
          <Button color={color} title={i18n.button.tr('help')} onPress={_onHelp}/>
        </View>
        <View style={styles.buttonView}>
          <Button color={color} title={i18n.button.tr('statistics')} onPress={_onStat}/>
        </View>
        {
          !this.props.settings[PLAY_GAMES_LOGGED_IN_KEY] ?
            <View style={styles.buttonView}>
              <GoogleButton onPress={this._playGamesSignIn}>
                <View style={styles.googleButton}>
                  <View style={styles.googleButtonImagePadding}>
                    <Image style={styles.googleButtonImage} source={{uri: 'google'}}/>
                  </View>
                  <Text style={styles.googleButtonText}>{i18n.button.tr('sign_in_google')}</Text>
                </View>
              </GoogleButton>
            </View> :
            null
        }
      </View>
    );
  }
}

const WelcomeHeader = connect(state => ({
  settings: state.settings,
}), dispatch => ({
  _onSettings: () => dispatch(navSettings()),
}))(class extends Header {
  _renderContent = () => (
    <View style={{flexDirection: 'row', flex: 1}}>
      {this.props.settings[PLAY_GAMES_LOGGED_IN_KEY] ?
        <ImageHeaderButton image='games_achievements'
                           action={() => PlayGames.showAchievements()}/> : null}
      {this.props.settings[PLAY_GAMES_LOGGED_IN_KEY] ?
        <ImageHeaderButton image='games_fastest_leaderboard'
                           action={() => PlayGames.showLeaderboard(PLAYGAMES_LEADERBOARD_ID)}/> : null}
      {this.props.settings[PLAY_GAMES_LOGGED_IN_KEY] ?
        <ImageHeaderButton image='games_leaderboards'
                           action={() => PlayGames.showLeaderboard(PLAYGAMES_LEADERBOARD_STACK_ID)}/> : null}
      <View style={{flex: 1}}/>
      {/*<IconHeaderButton icon={MIcon} name='more-vert' action={this.props._onSettings}/>*/}
    </View>
  );
});

export default connect(state => ({
    game: state.game,
    settings: state.settings,
  }), dispatch => ({
    _onNewGame: () => {
      dispatch(navGame());
      setTimeout(() => {
        InteractionManager.runAfterInteractions(() => dispatch(gameNew()).then(() => dispatch(statsGameTry())));
      }, 0);
    },
    _onContinueGame: () => {
      dispatch(navGame());
      setTimeout(() => {
        InteractionManager.runAfterInteractions(() => dispatch(gameResume()));
      }, 0);
    },
    _onClearGame: () => dispatch(gameClear()),
    _onHelp: () => dispatch(navHelp()),
    _onStat: () => dispatch(navStats()),

    _onSettingsUpdate: (settings) => dispatch(settingsUpdate(settings)),
  }),
)(Welcome);

export {
  WelcomeHeader,
};