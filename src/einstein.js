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
  item: 16,
  group: 50,
  border: 1,
};

const state = {
  field: [[0, 1, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0]]
};

export class GameField extends Component {

  renderItem(i, j, k) {
    const key = 'item_' + i + '_' + j + '_' + k;
    const src = 'item' + (i + 1) + (k + 1);
    return (
      <View key={key} style={styles.itemBox}>
        { ((j - i % 2 + 1) / 2 + i + k) % 2 == 0 ? <Image style={styles.item} source={{uri: src}}/> : null }
      </View>
    );
  };

  renderGroupItemsLine(i, j, n) {
    return (
      <View style={styles.groupItemsRow}>
        {items.filter((t) => {
          return t >= n * (size / 2) && t < (n + 1) * (size / 2)
        }).map((k) => {
          return this.renderItem(i, j, k)
        })}
      </View>
    );
  }

  renderGroupItem(i, j) {
    const key = 'group_' + i + '_' + j;
    const src = 'item' + (i + 1 ) + (j + 1);
    return (
      <View key={key}>
        {state.field[i][j] ?
          <View style={styles.groupItem}>
            {this.renderGroupItemsLine(i, j, 0)}
            {this.renderGroupItemsLine(i, j, 1)}
          </View> :
          <Image style={styles.groupItem} source={{uri : src}}/>
        }
      </View>
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
    height: styleCfg.group * size + styleCfg.space * (size + 1),
    width: styleCfg.group * size + styleCfg.space * (size + 1) + styleCfg.border * 2,
    borderWidth: styleCfg.border,
    borderColor: '#000',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: styleCfg.space,
  },

  row: {
    height: styleCfg.group,
    width: styleCfg.group * size + styleCfg.space * (size - 1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 0
  },

  groupItem: {
    height: styleCfg.group,
    width: styleCfg.group,
    borderWidth: styleCfg.border,
    borderColor: '#000',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  groupItemsRow: {
    flexDirection: 'row',
  },

  itemBox: {
    height: styleCfg.item,
    width: styleCfg.item,
  },

  item: {
    height: styleCfg.item,
    width: styleCfg.item,
    borderWidth: styleCfg.border,
    borderColor: '#000',
  },
});
