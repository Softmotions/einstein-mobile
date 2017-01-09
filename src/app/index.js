'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {StyleSheet, View, Button, Text} from 'react-native';

import {NavigationExperimental, BackAndroid} from 'react-native';
const {
  CardStack: NavigationCardStack,
} = NavigationExperimental;

import {WELCOME_SCREEN_KEY, GAME_SCREEN_KEY, HELP_SCREEN_KEY} from './constants/navigation';
import {NAVIGATION_BACK} from './constants/navigation';
import {GAME_PAUSE} from './constants/game';

import Welcome from './view/Welcome';
import Help from './view/Help';
import Game from './view/Game';

class Application extends Component {
  constructor(props) {
    super(props);
  }

  _navigateBack = () => {
    let {navigationState, _onNavigateBack} = this.props;
    _onNavigateBack();
    return navigationState.index !== 0;
  };

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this._navigateBack);
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this._navigateBack);
  }

  render() {
    let {navigationState, _onNavigateBack} = this.props;
    return (
      <NavigationCardStack
        onNavigateBack={_onNavigateBack}
        navigationState={navigationState}
        gestureResponseDistance={150}
        renderScene={(scene) => {
            switch (scene.scene.route.key) {
              case GAME_SCREEN_KEY: return (<Game />);
              case HELP_SCREEN_KEY: return (<Help />);
              default: return (<Welcome />)
            }
          }}/>
    );
  }
}

export default connect(state => ({
    navigationState: state.navigationState
  }),
  dispatch => ({
    _onNavigateBack: () => {
      dispatch({type: GAME_PAUSE});
      dispatch({type: NAVIGATION_BACK})
    }
  })
)(Application);