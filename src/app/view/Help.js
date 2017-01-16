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

// todo: import color
const mainColor = '#013397';
const ruleItemBorderColor = 'black';
const styles = StyleSheet.create({
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

  ruleGroup: {
    marginVertical: 15
  },
  ruleBox: {
    alignSelf: 'center'
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
    borderWidth: 0.25,
    borderColor: ruleItemBorderColor
  }
});

class Separator extends Component {
  get length() {
    return 'long' == this.props.type ? 8 : 2;
  }

  render = () => (
    <View style={{flexDirection: 'row'}}>
      <View style={{flex: 1}}/>
      <View style={[styles.separatorLine, {flex: this.length}]}/>
      <View style={{flex: 1}}/>
    </View>
  )
}

// todo: help hardcoded :(
class Help extends Component {
  render = () => (
    <ScrollView style={styles.container}>
      <Text style={styles.text}>
        <Text style={styles.caption}>Game goal</Text>:
        to discover tiles in each of 36 field positions.
        Tiles are different and rules shows how they placed one to each other.
        There are 4 types of rules:
      </Text>
      {/*Between rule*/}
      <View style={styles.ruleGroup}>
        <View style={[styles.ruleBox, styles.hrule]}>
          <Image source={{uri: 'item21'}} style={styles.ruleItemImage}/>
          <Image source={{uri: 'item31'}} style={styles.ruleItemImage}/>
          <Image source={{uri: 'item61'}} style={styles.ruleItemImage}/>
        </View>
        <Text style={styles.text}>
          Means 3 tiles are in columns next to each other -
          column with
          {' '} <Image source={{uri: 'item21'}} style={styles.image}/> {' '}
          is next to column with
          {' '} <Image source={{uri: 'item31'}} style={styles.image}/> {' '}
          and column with
          {' '} <Image source={{uri: 'item31'}} style={styles.image}/> {' '}
          next to column with
          {' '} <Image source={{uri: 'item61'}} style={styles.image}/>
        </Text>
      </View>
      <Separator/>
      {/*Near rule*/}
      <View style={styles.ruleGroup}>
        <View style={[styles.ruleBox, styles.hrule]}>
          <Image source={{uri: 'item21'}} style={styles.ruleItemImage}/>
          <Image source={{uri: 'near'}} style={styles.ruleImage}/>
          <Image source={{uri: 'item35'}} style={styles.ruleItemImage}/>
        </View>
        <Text style={styles.text}>
          Means 2 tiles are in columns next to each other –
          column with
          {' '} <Image source={{uri: 'item21'}} style={styles.image}/> {' '}
          is next to column with
          {' '} <Image source={{uri: 'item35'}} style={styles.image}/>
        </Text>
      </View>
      <Separator/>
      {/*Direction rule*/}
      <View style={styles.ruleGroup}>
        <View style={[styles.ruleBox, styles.hrule]}>
          <Image source={{uri: 'item21'}} style={styles.ruleItemImage}/>
          <Image source={{uri: 'direction'}} style={styles.ruleImage}/>
          <Image source={{uri: 'item61'}} style={styles.ruleItemImage}/>
        </View>
        <Text style={styles.text}>
          Means left tile is in a column left to column with right tile –
          column with
          {' '} <Image source={{uri: 'item21'}} style={styles.image}/> {' '}
          is left to column with
          {' '} <Image source={{uri: 'item61'}} style={styles.image}/>
        </Text>
      </View>
      <Separator/>
      {/*Under rule*/}
      <View style={styles.ruleGroup}>
        <View style={styles.ruleBox}>
          <View style={styles.vrule}>
            <Image source={{uri: 'item21'}} style={styles.ruleItemImage}/>
            <Image source={{uri: 'item61'}} style={styles.ruleItemImage}/>
          </View>
        </View>
        <Text style={styles.text}>
          Tiles are in the same column
        </Text>
      </View>
      <Separator type='long'/>
      <Text style={styles.text}>
        To open a tile touch the position and select the tile. Short press to select tile. Long press to disable tile.
      </Text>
      <Text style={styles.text}>
        Also touching rules you can switch rules visibility mode to hide rules you already satisfied.
      </Text>
    </ScrollView>
  );
}

export default connect(state => ({}), dispatch => ({}))(Help);