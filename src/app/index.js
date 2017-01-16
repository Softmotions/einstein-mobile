'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
  StyleSheet,
} from 'react-native';

import {NavigationExperimental, BackAndroid} from 'react-native';
const {
  CardStack: NavigationCardStack,
} = NavigationExperimental;

import {
  WELCOME_SCREEN_KEY,
  GAME_SCREEN_KEY,
  HELP_SCREEN_KEY,
  STAT_SCREEN_KEY,
} from './constants/navigation';

import Welcome from './view/Welcome';
import Game from './view/Game';
import Help from './view/Help';
import Statistics from './view/Statistics';

import {gamePause} from './actions/game';
import {navBack} from './actions/navigation';

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

  componentDidMount = () => BackAndroid.addEventListener('hardwareBackPress', this._navigateBack);

  componentWillUnmount = () => BackAndroid.removeEventListener('hardwareBackPress', this._navigateBack);

  render = () => (
    <NavigationCardStack
      onNavigateBack={this.props._onNavigateBack}
      navigationState={this.props.navigationState}
      gestureResponseDistance={150}
      renderScene={(scene) => {
            switch (scene.scene.route.key) {
              case GAME_SCREEN_KEY: return (<Game />);
              case HELP_SCREEN_KEY: return (<Help />);
              case STAT_SCREEN_KEY: return (<Statistics />);
              default: return (<Welcome />);
            }
          }}/>
  );
}

export default connect(state => ({
    navigationState: state.navigationState
  }),
  dispatch => ({
    _onNavigateBack: () => {
      dispatch(gamePause());
      dispatch(navBack());
    },
  })
)(Application);