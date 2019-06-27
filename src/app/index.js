'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {BackHandler} from 'react-native';
import NavigationExperimental from 'react-native-navigation-experimental-compat';
import {GAME_SCREEN_KEY, HELP_SCREEN_KEY, SETTINGS_SCREEN_KEY, STAT_SCREEN_KEY, WELCOME_SCREEN_KEY} from './constants/navigation';

import Welcome, {WelcomeHeader} from './view/Welcome';
import Game, {GameHeader} from './view/Game';
import Help from './view/Help';
import Statistics from './view/Statistics';
import Settings from './view/Settings';

import {DefaultHeader} from './view/header/index';

import {gamePause} from './actions/game';
import {navBack} from './actions/navigation';
const {
  CardStack: NavigationCardStack,
} = NavigationExperimental;

import {i18n} from './utils/i18n';

class Application extends Component {
  constructor(props) {
    super(props);
  }

  _navigateBack = () => {
    let {navigationState, _onNavigateBack} = this.props;
    _onNavigateBack();
    console.debug('Navigation back', navigationState);
    return navigationState.index !== 0;
  };

  componentDidMount = () => BackHandler.addEventListener('hardwareBackPress', this._navigateBack);

  componentWillUnmount = () => BackHandler.removeEventListener('hardwareBackPress', this._navigateBack);

  render = () => (
    <NavigationCardStack
      onNavigateBack={this.props._onNavigateBack}
      navigationState={this.props.navigationState}
      enableGestures={false}
      renderHeader={({scene}) => {
        switch (scene.route.key) {
          case GAME_SCREEN_KEY:
            return (<GameHeader setRef={(ref) => this._header = ref}/>);
          case WELCOME_SCREEN_KEY:
            return (<WelcomeHeader />);
          default:
            const tr = i18n.tr(scene.route.key);
            return (<DefaultHeader title={tr.has('title') ? tr.tr('title') : ''}/>);
        }
      }}
      renderScene={({scene}) => {
        switch (scene.route.key) {
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
      }}/>
  );
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