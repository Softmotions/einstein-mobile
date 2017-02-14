'use strict';

import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  Button,
  StyleSheet
} from 'react-native';

import {connect} from 'react-redux';

import {i18n} from '../utils/i18n';

// todo: import color
const mainColor = '#013397';
const ruleItemBorderColor = 'black';
const styles = StyleSheet.create({
  separator: {
    flexDirection: 'row',
    padding: 15
  },
  separatorLine: {
    borderTopWidth: 1,
    borderColor: mainColor
  },

  container: {
    padding: 10
  },

  text: {
    textAlign: 'justify',
    textAlignVertical: 'center',
    color: mainColor,
  },
  caption: {
    fontWeight: 'bold'
  },

  image: {
    width: 16,
    height: 16,
    borderWidth: 0.25,
    borderColor: ruleItemBorderColor
  },

  ruleGroup: {},
  ruleBox: {
    alignSelf: 'center',
    marginBottom: 5
  },
  hrule: {
    flexDirection: 'row',
    padding: 1.5,
    borderWidth: 0.5,
    borderColor: ruleItemBorderColor
  },
  vrule: {
    flexDirection: 'column',
    padding: 1.5,
    borderWidth: 0.5,
    borderColor: ruleItemBorderColor
  },
  ruleImage: {
    width: 24,
    height: 24,
  },
  ruleItemImage: {
    width: 24,
    height: 24,
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

class Help extends Component {
  __trt() {
    const key = arguments[0];
    const elements = Array.from(arguments).slice(1);
    return (<Text style={styles.text} key={key}>
      {i18n.tr('help').tr(key)
        .split(/{(\d+)}/)
        .map((item, i) => (
          <Text key={key + '_' + i}>{typeof elements[item] != 'undefined' ? elements[item] : item}</Text>
        ))
      }
    </Text>);
  };

  render = () => {
    const help = i18n.tr('help');
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.text}>
          <Text style={styles.caption}>{help.tr('goal_title')}</Text>: {help.tr('goal_text')}
        </Text>
        {/*Between rule*/}
        <View style={[styles.ruleGroup, {marginTop: 15}]}>
          <View style={[styles.ruleBox, styles.hrule]}>
            <Image source={{uri: 'item21'}} style={styles.ruleItemImage}/>
            <Image source={{uri: 'item31'}} style={styles.ruleItemImage}/>
            <Image source={{uri: 'item61'}} style={styles.ruleItemImage}/>
          </View>
          {this.__trt('rules_between',
            <Image source={{uri: 'item21'}} style={styles.image}/>,
            <Image source={{uri: 'item31'}} style={styles.image}/>,
            <Image source={{uri: 'item61'}} style={styles.image}/>
          )}
        </View>
        <Separator/>
        {/*Near rule*/}
        <View style={styles.ruleGroup}>
          <View style={[styles.ruleBox, styles.hrule]}>
            <Image source={{uri: 'item21'}} style={styles.ruleItemImage}/>
            <Image source={{uri: 'near'}} style={styles.ruleImage}/>
            <Image source={{uri: 'item35'}} style={styles.ruleItemImage}/>
          </View>
          {this.__trt('rules_near',
            <Image source={{uri: 'item21'}} style={styles.image}/>,
            <Image source={{uri: 'item35'}} style={styles.image}/>
          )}
        </View>
        <Separator/>
        {/*Direction rule*/}
        <View style={styles.ruleGroup}>
          <View style={[styles.ruleBox, styles.hrule]}>
            <Image source={{uri: 'item21'}} style={styles.ruleItemImage}/>
            <Image source={{uri: 'direction'}} style={styles.ruleImage}/>
            <Image source={{uri: 'item61'}} style={styles.ruleItemImage}/>
          </View>
          {this.__trt('rules_direction',
            <Image source={{uri: 'item21'}} style={styles.image}/>,
            <Image source={{uri: 'item61'}} style={styles.image}/>
          )}
        </View>
        <Separator/>
        {/*Under rule*/}
        <View style={styles.ruleGroup}>
          <View style={styles.ruleBox}>
            <View style={styles.vrule}>
              <Image source={{uri: 'item21'}} style={styles.ruleItemImage}/>
              <Image source={{uri: 'item41'}} style={styles.ruleItemImage}/>
            </View>
          </View>
          {this.__trt('rules_under')}
        </View>
        <Separator/>
        <Text style={styles.text}>
          {help.tr('field_actions')}
          {'\n'}
          {help.tr('rule_actions')}
        </Text>
      </ScrollView>
    )
  };
}

export default connect(state => ({}), dispatch => ({}))(Help);