'use strict';

import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet
} from 'react-native';

import {connect} from 'react-redux';

import {loadStat} from '../actions/statistic';
import {formatTime} from './utils';

class Statistic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
    }
  }

  componentDidMount = () => this.props._loadStat().then(() => this.setState({ready: true}));

  renderPlaceholder = () => (
    <View>
      <Text>Loading...</Text>
    </View>
  );

  renderTimeInfo = (time, i) => (
    <View key={'time-info' + i}>
      <Text>{formatTime(time.time)}</Text>
    </View>
  );

  render = () => {
    let {ready} = this.state;
    let {statistic} = this.props;

    if (!ready) {
      return this.renderPlaceholder();
    }

    console.debug(statistic);

    return (
      <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
        <Text>TODO: Statistic!</Text>
        <Text>Total tries: {statistic.tries}</Text>
        <Text>Solved: {statistic.successfully}</Text>
        <Text>Failed: {statistic.failed}</Text>
        <Text>Best times:</Text>
        {statistic.times.map(this.renderTimeInfo)}
      </View>
    );
  }
}

export default connect(state => ({
  statistic: state.statistic
}), dispatch => ({
  _loadStat: () => dispatch(loadStat())
}))(Statistic);