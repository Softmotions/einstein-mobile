'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {StyleSheet, View, Button, Text} from 'react-native';

import {Navigator} from 'react-native';

import {NavigationExperimental, BackAndroid} from 'react-native';
const {
  CardStack: NavigationCardStack,
} = NavigationExperimental;

import Welcome from './modules/Welcome';
import Help from './modules/Help';
import Game from './modules/Game';

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
    /*
     <Navigator initialRoute={{id: 'welcome', name: 'Welcome'}}
     configureScene={(route, routeStack) => Navigator.SceneConfigs.HorizontalSwipeJump}
     renderScene={(route, navigator) => {
     switch(route.id) {
     case 'game':
     return (<Game navigator={navigator}/>);

     case 'help':
     return (<Help navigator={navigator}/>);

     default:
     return (<Welcome navigator={navigator}/>);
     }
     }}
     />

     */

    return (
      <NavigationCardStack
        onNavigateBack={_onNavigateBack}
        navigationState={navigationState}
        gestureResponseDistance={150}
        renderScene={(scene) => {
            switch (scene.scene.route.key) {
              case 'game': return (<Game />);
              case 'help': return (<Help />);
              default: return (<Welcome />)
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