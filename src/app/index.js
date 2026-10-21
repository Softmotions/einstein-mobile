'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {BackHandler, View} from 'react-native';
import {GAME_SCREEN_KEY, HELP_SCREEN_KEY, SETTINGS_SCREEN_KEY, STAT_SCREEN_KEY, WELCOME_SCREEN_KEY} from './constants/navigation';

import Welcome, {WelcomeHeader} from './view/Welcome';
import Game, {GameHeader} from './view/Game';
import Help from './view/Help';
import Statistics from './view/Statistics';
import Settings from './view/Settings';

import {DefaultHeader} from './view/header/index';

import {gamePause} from './actions/game';
import {navBack} from './actions/navigation';

import {i18n} from './utils/i18n';

class Application extends Component {

  _currentRoute = () => {
    const {navigationState} = this.props;
    return navigationState.routes[navigationState.index];
  };

  _navigateBack = () => {
    if (this.props.navigationState.index === 0) {
      return false;
    }
    this.props._onNavigateBack();
    return true;
  };

  componentDidMount = () => {
    this._backHandler = BackHandler.addEventListener('hardwareBackPress', this._navigateBack);
  };

  componentWillUnmount = () => {
    this._backHandler && this._backHandler.remove();
  };

  _renderHeader = (route) => {
    switch (route.key) {
      case GAME_SCREEN_KEY:
        return (<GameHeader setRef={(ref) => this._header = ref}/>);
      case WELCOME_SCREEN_KEY:
        return (<WelcomeHeader />);
      default: {
        const tr = i18n.tr(route.key);
        return (<DefaultHeader title={tr.has('title') ? tr.tr('title') : ''}/>);
      }
    }
  };

  _renderScene = (route) => {
    switch (route.key) {
      case GAME_SCREEN_KEY:
        return (<Game header={this._header}/>);
      case HELP_SCREEN_KEY:
        return (<Help />);
      case STAT_SCREEN_KEY:
        return (<Statistics />);
      case SETTINGS_SCREEN_KEY:
        return (<Settings />);
      default:
        return (<Welcome />);
    }
  };

  render = () => {
    const route = this._currentRoute();
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        {this._renderHeader(route)}
        <View style={{flex: 1}}>
          {this._renderScene(route)}
        </View>
      </View>
    );
  };
}

export default connect(state => ({
    navigationState: state.navigationState,
  }),
  dispatch => ({
    _onNavigateBack: () => {
      dispatch(gamePause());
      dispatch(navBack());
    },
  }),
)(Application);
