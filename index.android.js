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
import Welcome from './src/welcome';
import {GameFactory} from './src/controller';

export default class Application extends Component {
  constructor(props) {
    super(props);

    // // TODO: debug
    // let game = GameFactory.generateGame(6);
    // game.start();
    //
    // this.state = {
    //   navigationState: {
    //     index: 0,
    //     routes: [{key: 'game'}]
    //   },
    //   game: game
    // };

    // release:
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

  componentDidMount() {
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
        if (game && !game.finished) {
          navigationState = NavigationStateUtils.jumpTo(navigationState, 'game');
          break;
        }

      case 'new':
        const route = {key: 'game'};

        game = GameFactory.generateGame(6);
        game.start();

        if (NavigationStateUtils.has(navigationState, route.key)) {
          navigationState = NavigationStateUtils.replaceAt(navigationState, route.key, route);
        } else {
          navigationState = NavigationStateUtils.push(navigationState, route);
        }
        break;

      case 'back':
        if (game && game.finished) {
          navigationState = NavigationStateUtils.pop(navigationState);
        } else {
          navigationState = NavigationStateUtils.back(navigationState);
        }

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
        onNavigateBack={this._onNavigateBack}
        navigationState={this.state.navigationState}
        renderScene={(scene) => {
          switch (scene.scene.route.key) {
            case 'game':
              return (<Game game={this.state.game}/>);

            default:
              return (
                <Welcome onNewGame={this._onNewGame}
                         onContinueGame={this._onContinueGame}
                         game={this.state.game}
                         navigationState={this.state.navigationState}/>
              )
          }
        }}/>
    );
  }
}

AppRegistry.registerComponent('Einstein', () => Application);
