/**
 * @author Vyacheslav Tyutyunkov (tve@softmotions.com)
 */
'use strict';

import React, {Component} from 'react';
import {StyleSheet, Text, View, CheckBox} from 'react-native';

import {connect} from 'react-redux';

import {i18n} from '../utils/i18n';

import {settingsUpdate} from '../actions/settings';

import {
  DONT_HIDE_POPUP,
  LONG_PRESS_SECOND_ACTION
} from '../constants/settings';

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
  constructor(props) {
    super(props);
    this.state = {...this.props.settings};
  }

  _onToggle = option => value => {
    this.setState({...this.props.settings, [option]: value});
    this.props._updateOption({[option]: value})
      .finally(() => this.setState({...this.props.settings}));
  };

  option = (option, name) => (
    <View style={{ flexDirection: 'row' }}>
      <CheckBox
        value={this.state[option]}
        onValueChange={this._onToggle(option)}
      />
      <Text style={styles.caption}>{i18n.settings.tr(name)}</Text>
    </View>
  );

  render = () => (
    <View style={styles.container}>
      <Text style={styles.caption}>{i18n.settings.tr('title')}</Text>
      {this.option(DONT_HIDE_POPUP, 'dont_hide')}
      {this.option(LONG_PRESS_SECOND_ACTION, 'long_press')}
    </View>
  );
}

export default connect(state => ({
  settings: state.settings,
}), dispatch => ({
  _updateOption: (update) => dispatch(settingsUpdate(update)),
}))(Settings);
