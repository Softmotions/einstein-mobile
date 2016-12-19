'use strict';

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, View, Text, Button} from 'react-native';
import SideMenu from 'react-native-side-menu';

import Einstein from './src/einstein';

export default class Application extends Component {
  render() {
    const menu = <View></View>;
    return (
      <View style={{flex:1}}>
        {/*<SideMenu menu={menu}>*/}
        {/*<View style={styles.toolbar}><Text>Menu</Text></View>*/}
        <View style={styles.main}>
          <Einstein style={{flex:1}}/>
        </View>
        {/* </SideMenu> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    flex: 1,
  },

  toolbar: {
    height: 16,
    // flex: 1,
    backgroundColor: 'grey',
  },
});

AppRegistry.registerComponent('Einstein', () => Application);
