/**
 * @author Vyacheslav Tyutyunkov (tve@softmotions.com)
 */
'use strict';

import React, {Component} from 'react';
import {StyleSheet, View, Text, Switch} from 'react-native';

import {connect} from 'react-redux';

import {i18n} from '../utils/i18n';

import {settingsUpdate} from '../actions/settings';
import {OPTION_PRESS_EXCLUDE} from '../constants/settings';

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
      <View style={styles.settingsRow}>
        <Text style={styles.text}>{i18n.settings.tr('option_press_exclude')}</Text>
        <Switch value={!!this.props.settings[OPTION_PRESS_EXCLUDE]}
                onValueChange={(value) => this.props._updateOption({[OPTION_PRESS_EXCLUDE]: value})}/>
      </View>
    </View>
  );
}

export default connect(state => ({
  settings: state.settings,
}), dispatch => ({
  _updateOption: (update) => dispatch(settingsUpdate(update)),
}))(Settings);
