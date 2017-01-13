'use strict';

import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet
} from 'react-native';

import {Loader} from './Loader';

import {connect} from 'react-redux';

import {loadStat} from '../actions/statistics';
import {formatTime} from './utils';

class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
    }
  }

  componentDidMount = () => this.props._loadStat().then(() => this.setState({ready: true}));

  renderPlaceholder = () => (
    <View style={{flex:1, alignItems: 'center', justifyContent:'center'}}>
      <Loader/>
    </View>
  );

  renderTimeInfo = (time, i) => (
    <View key={'time-info' + i}>
      <Text>{formatTime(time.time)}</Text>
    </View>
  );

  render = () => {
    let {ready} = this.state;
    let {statistics} = this.props;

    if (!ready) {
      return this.renderPlaceholder();
    }

    console.debug(statistics);

    return (
      <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
        <Text>TODO: Statistics!</Text>
        <Text>Total tries: {statistics.tries}</Text>
        <Text>Solved: {statistics.successfully}</Text>
        <Text>Failed: {statistics.failed}</Text>
        <Text>Best times:</Text>
        {statistics.times.map(this.renderTimeInfo)}
      </View>
    );
  }
}

export default connect(state => ({
  statistics: state.statistics
}), dispatch => ({
  _loadStat: () => dispatch(loadStat())
}))(Statistics);