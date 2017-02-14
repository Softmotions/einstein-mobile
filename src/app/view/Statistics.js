'use strict';

import React, {Component} from 'react';
import {
  View,
  ScrollView,
  ListView,
  Text,
  Image,
  Button,
  Alert,
  StyleSheet
} from 'react-native';

import {Loader} from './Loader';

import {connect} from 'react-redux';

import {statsLoad, statsClear} from '../actions/statistics';
import {formatTime, formatDate} from './utils';
import {i18n} from '../utils/i18n';

const mainColor = '#013397';
const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1
  },

  separator: {
    flexDirection: 'row',
    padding: 15
  },
  separatorLine: {
    borderTopWidth: 1,
    borderColor: mainColor
  },

  text: {
    color: mainColor
  },
  caption: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: mainColor
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoRowSeparator: {
    borderColor: 'grey',
    borderWidth: 0.25,
    borderStyle: 'dashed'
  }
});

class Separator extends Component {
  get length() {
    return 'long' == this.props.type ? 8 : 2;
  }

  render = () => (
    <View style={styles.separator}>
      <View style={{flex: 1}}/>
      <View style={[styles.separatorLine, {flex: this.length}]}/>
      <View style={{flex: 1}}/>
    </View>
  )
}

class InfoRow extends Component {
  render = () => (
    <View>
      <View style={styles.infoRow}>
        <View><Text style={styles.text}>{this.props.title}</Text></View>
        <View><Text style={styles.text}>{this.props.text}</Text></View>
      </View>
      <View style={styles.infoRowSeparator}/>
    </View>
  )
}

class InfoTimesRow extends Component {
  render = () => (
    <View>
      <View style={styles.infoRow}>
        <View><Text style={styles.text}>{formatTime(this.props.data.time)}</Text></View>
        <View><Text style={styles.text}>{this.props.data.repeats ? 'x' + this.props.data.repeats : null}</Text></View>
        <View><Text style={styles.text}>{formatDate(this.props.data.date)}</Text></View>
      </View>
      <View style={styles.infoRowSeparator}/>
    </View>
  )
}

class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
    };
    this._ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  }

  componentDidMount = () => this.props._loadStat().then(() => this.setState({ready: true}));

  renderPlaceholder = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Loader/>
    </View>
  );

  isStatEmpty = (stats) => !stats.tries && !stats.successfully && !stats.failed && (!stats.times || !stats.times.length);

  render = () => {
    let {ready} = this.state;
    let {statistics, _clearStat} = this.props;

    if (!ready) {
      return this.renderPlaceholder();
    }

    console.debug(statistics);

    return (
      <View style={styles.container}>
        <Text style={styles.caption}>{i18n.statistics.tr('title')}</Text>

        <InfoRow title={i18n.statistics.tr('total')} text={statistics.tries}/>
        <InfoRow title={i18n.statistics.tr('solved')} text={statistics.successfully}/>
        <InfoRow title={i18n.statistics.tr('failed')} text={statistics.failed}/>
        <InfoRow title={i18n.statistics.tr('current_stack')} text={statistics.currentStack || 0}/>
        <InfoRow title={i18n.statistics.tr('max_stack')} text={statistics.maxStack || 0}/>

        <View style={{flex: 1}}>
          { statistics.times.length > 0 ?
            <View style={{flex: 1}}>
              <Separator type='long'/>
              <Text style={styles.caption}>{i18n.statistics.tr('best_times')}</Text>
              <ListView dataSource={this._ds.cloneWithRows(statistics.times)}
                        renderRow={(data) => (<InfoTimesRow data={data}/>)}>
              </ListView>
            </View> :
            null
          }
        </View>

        { !this.isStatEmpty(statistics) ?
          <View style={{alignItems: 'flex-end'}}>
            {/*<Button color={mainColor} title="Clear" onPress={_clearStat}/>*/}
          </View> :
          null
        }
      </View>
    );
  }
}

export default connect(state => ({
  statistics: state.statistics
}), dispatch => ({
  _loadStat: () => dispatch(statsLoad()),
  _clearStat: () => Alert.alert(
    i18n.message.tr('confirm_title'),
    null,
    [
      {text: i18n.button.tr('cancel'), style: 'cancel'},
      {text: i18n.button.tr('yes'), onPress: () => dispatch(statsClear())}
    ]
  )
}))(Statistics);