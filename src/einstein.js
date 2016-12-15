import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

const items = [];
const size = 6;

for (let i = 0; i < 6; ++i) {
  items.push(i);
}

// todo: calculate from dimension & ratio
const styleCfg = {
  space: 2,
  item: 35,
  border: 1,
};

export class GameField extends Component {

  renderGroupItem(i, j) {
    const key = 'group_' + i + '_' + j;
    const src = 'item' + (i + 1 ) + (j + 1);
    return (
      <Image key={key} style={styles.groupItem} source={{uri : src}}/>
    );
  }

  renderRow(i) {
    const key = 'row_' + i;
    return (
      <View key={key} style={styles.row}>
        {items.map((j) => {
          return this.renderGroupItem(i, j);
        })}
      </View>
    )
  }

  render() {
    return (
      <View style={styles.gamefield}>
        {items.map((i) => {
          return this.renderRow(i);
        })}
      </View>
    );
  }
}

export default class Einstein extends Component {
  render() {
    return (
      <GameField/>
    );
  }
}

const styles = StyleSheet.create({
  gamefield: {
    height: styleCfg.item * size + styleCfg.space * (size + 1),
    width: styleCfg.item * size + styleCfg.space * (size + 1) + styleCfg.border * 2,
    borderWidth: styleCfg.border,
    borderColor: '#000',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: styleCfg.space,
  },

  row: {
    height: styleCfg.item,
    width: styleCfg.item * size + styleCfg.space * (size - 1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 0
  },

  groupItem: {
    height: styleCfg.item,
    width: styleCfg.item,
    borderWidth: styleCfg.border,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
