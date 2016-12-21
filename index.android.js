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
import {GameFactory} from './src/controller';

class HelloView extends Component {
  constructor(props) {
    super(props);
  }

  // todo
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={{margin: 5}}><Button title="New game" onPress={this.props.onNewGame}/></View>
        {this.props.game && !this.props.game.finished ?
          <View style={{margin: 5}}><Button title="Continue" onPress={this.props.onContinueGame} style={{margin: 10}}/></View> :
          null }
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
      },
      game: null
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
    let {navigationState, game} = this.state;

    // TODO: configure

    switch (type) {
      case 'continue':
        if (game) {
          navigationState = NavigationStateUtils.jumpTo(navigationState, 'game');
          break;
        }

      case 'new':
        const route = {key: 'game'};

        if (game) {
          navigationState = NavigationStateUtils.replaceAt(navigationState, route.key, route);
        } else {
          navigationState = NavigationStateUtils.push(navigationState, route);
        }
        game = GameFactory.generateGame(6);
        game.start();
        break;

      case 'back':
        navigationState = NavigationStateUtils.back(navigationState);
        if (game) {
          game.pause();
        }
        break;
    }

    if (this.state.navigationState !== navigationState || this.state.game !== game) {
      this.setState({navigationState, game});
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
              return (<Game game={this.state.game}/>);

            default:
              return (
                <HelloView onNewGame={this._onNewGame}
                           onContinueGame={this._onContinueGame}
                           game={this.state.game}
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
