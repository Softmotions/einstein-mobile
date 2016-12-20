'use strict';

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, View, Button, Text} from 'react-native';

// todo navigation
import {NavigationExperimental, BackAndroid} from 'react-native';
const {
  CardStack: NavigationCardStack,
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

import Game from './src/einstein';

class HelloView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {NavigationStateUtils.has(this.props.navigationState, 'game') ?
          <Button title="Continue" onPress={this.props.onContinueGame}/> :
          <Button title="New game" onPress={this.props.onNewGame}/> }
      </View>
    );
  }
}

export default class Application extends Component {
  constructor(props) {
    super(props);

    this.state = {
      navigationState: {
        index: 0,
        routes: [{key: 'welcome'}]
      }
    };

    this._onNavigationChange = this._onNavigationChange.bind(this);

    this._onNavigateBack = this._onNavigationChange.bind(null, 'back');
    this._onNewGame = this._onNavigationChange.bind(null, 'new');
    this._onContinueGame = this._onNavigationChange.bind(null, 'continue');
  }

  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', this._onNavigateBack);
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this._onNavigateBack);
  }

  _onNavigationChange(type) {
    let {navigationState} = this.state;

    // TODO: configure

    switch (type) {
      case 'continue':
        if (NavigationStateUtils.has(navigationState, 'game')) {
          navigationState = NavigationStateUtils.jumpTo(navigationState, 'game');
          break;
        }

      case 'new':
        const route = {key: 'game'};

        navigationState = NavigationStateUtils.has(navigationState, 'game') ?
          NavigationStateUtils.replaceAt(navigationState, route.key, route) :
          NavigationStateUtils.push(navigationState, route);
        break;

      case 'back':
        navigationState = NavigationStateUtils.back(navigationState);
        break;
    }

    if (this.state.navigationState !== navigationState) {
      this.setState({navigationState});
      return true;
    } else {
      return false;
    }
  }

  render() {
    return (
      <NavigationCardStack
        onExit={() => {return false;}}
        onNavigateBack={this._onNavigateBack}
        navigationState={this.state.navigationState}
        renderScene={(scene) => {
          switch (scene.scene.route.key) {
            case 'game':
              return (<Game/>);

            default:
              return (
                <HelloView onNewGame={this._onNewGame}
                           onContinueGame={this._onContinueGame}
                           navigationState={this.state.navigationState}/>
              )
          }
        }}/>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

AppRegistry.registerComponent('Einstein', () => Application);
