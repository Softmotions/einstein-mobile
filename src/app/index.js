'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {StyleSheet, View, Button, Text} from 'react-native';

// todo navigation
import {NavigationExperimental, BackAndroid} from 'react-native';
const {
  CardStack: NavigationCardStack,
} = NavigationExperimental;

import Game from './modules/einstein';
import Welcome from './modules/Welcome';

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
        renderScene={(scene) => {
          switch (scene.scene.route.key) {
            case 'game':
              return (<Game />);

            default:
              return (
                <Welcome />
              )
          }
        }}/>
    );
  }
}

export default connect(state => ({
    navigationState: state.app.navigationState
  }),
  dispatch => ({
    _onNavigateBack: () => dispatch({type: 'back'})
  })
)(Application);