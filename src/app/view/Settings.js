/**
 * @author Vyacheslav Tyutyunkov (tve@softmotions.com)
 */
'use strict';

import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {connect} from 'react-redux';

import {i18n} from '../utils/i18n';

import {settingsUpdate} from '../actions/settings';

const mainColor = '#013397';
const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },

  text: {
    color: mainColor,
  },
  caption: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: mainColor,
  },

  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

});
class Settings extends Component {
  render = () => (
    <View style={styles.container}>
      <Text style={styles.caption}>{i18n.settings.tr('title')}</Text>
    </View>
  );
}

export default connect(state => ({
  settings: state.settings,
}), dispatch => ({
  _updateOption: (update) => dispatch(settingsUpdate(update)),
}))(Settings);
