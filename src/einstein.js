import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableWithoutFeedback
} from 'react-native';

import {Rule, ruleFactory} from './rules';
import {Field, GameController} from './field';
import {Solver} from './solver';

const items = [];
const size = 6;

for (let i = 0; i < 6; ++i) {
  items.push(i);
}

// todo: calculate from dimension & ratio
const styleCfg = {
  group: 50,
  item: 16,
  space: 1,
  border: 0.5,
  ruleSpace: 1,
  ruleItem: 30,
  ruleBorder: 1,
};

// todo: calculate
const ruleRows = 5;

const Dimensions = require('Dimensions');
const {height, width} = Dimensions.get('window');

export class GameField extends Component {

  renderItem(i, j, k) {
    const game = this.props.game;

    const key = 'item_' + i + '_' + j + '_' + k;
    const src = 'item' + (i + 1) + (k + 1);
    return (
      <View key={key} style={styles.itemBox}>
        { game.possible(i, j, k) ? <Image style={styles.item} source={{uri: src}}/> : null }
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
    const field = this.props.field;
    const game = this.props.game;

    const key = 'group_' + i + '_' + j;
    const src = 'item' + (i + 1 ) + (game.get(i, j) + 1);

    return (
      <View key={key}>
        {!game.isSet(i, j) ?
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
      <View style={styles.field}>
        {items.map((i) => {
          return this.renderRow(i);
        })}
      </View>
    );
  }
}

class Rule3 extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: true};
  }

  toggle() {
    this.setState({visible: !this.state.visible});
  }

  render() {
    let opacity = this.state.visible ? 1 : 0.15;
    return (
      <TouchableWithoutFeedback onPress={() => {this.toggle()}}>
        <View style={[styles.rule3, {opacity: opacity}]}>
          <Image style={styles.ruleItem} source={{uri: this.props.img1}}/>
          <Image style={styles.ruleItem} source={{uri: this.props.img2}}/>
          <Image style={styles.ruleItem} source={{uri: this.props.img3}}/>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

class Rule2 extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: true};
  }

  toggle() {
    this.setState({visible: !this.state.visible});
  }

  render() {
    let opacity = this.state.visible ? 1 : 0.15;
    return (
      <TouchableWithoutFeedback onPress={() => {this.toggle()}}>
        <View style={[styles.rule2, {opacity: opacity}]}>
          <Image style={styles.ruleItem} source={{uri: this.props.img1}}/>
          <Image style={styles.ruleItem} source={{uri: this.props.img2}}/>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

class Rules extends Component {
  renderNearRule(rule) {
    const src1 = 'item' + (rule.row1 + 1) + (rule.value1 + 1);
    const src2 = 'item' + (rule.row2 + 1) + (rule.value2 + 1);

    return (
      <Rule3 img1={src1} img2="near" img3={src2}/>
    );
  }

  renderDirectionRule(rule) {
    const src1 = 'item' + (rule.row1 + 1) + (rule.value1 + 1);
    const src2 = 'item' + (rule.row2 + 1) + (rule.value2 + 1);

    return (
      <Rule3 img1={src1} img2="direction" img3={src2}/>
    );
  }

  renderBetweenRule(rule) {
    const src1 = 'item' + (rule.row1 + 1) + (rule.value1 + 1);
    const src2 = 'item' + (rule.row2 + 1) + (rule.value2 + 1);
    const src3 = 'item' + (rule.row3 + 1) + (rule.value3 + 1);

    return (
      <Rule3 img1={src1} img2={src2} img3={src3}/>
    );
  }

  renderUnderRule(i, rule) {
    const key = 'urule_' + i;

    const src1 = 'item' + (rule.row1 + 1) + (rule.value1 + 1);
    const src2 = 'item' + (rule.row2 + 1) + (rule.value2 + 1);

    return (
      <Rule2 key={key} img1={src1} img2={src2}/>
    );
  }

  renderHorizontalRule(i, j, rule) {
    const key = 'rule_' + i + '_' + j;
    return (
      <View key={key}>{
        rule.type == 'near' ? this.renderNearRule(rule) :
          rule.type == 'direction' ? this.renderDirectionRule(rule) :
            rule.type == 'between' ? this.renderBetweenRule(rule) : null
      }</View>
    )
  }

  renderHorizontalRuleGroup(i, rules) {
    const key = 'rule_group_' + i;
    return (
      <View key={key}>
        {rules.map((r, j) => {
          return this.renderHorizontalRule(i, j, r);
        })}
      </View>
    )
  }

  render() {
    const rules = this.props.rules;
    const hrules = rules.filter((r) => {
      return ['near', 'direction', 'between'].indexOf(r.type) > -1;
    });
    const vrules = rules.filter((r) => {
      return ['under'].indexOf(r.type) > -1;
    });

    const rr = vrules.length > 0 ? ruleRows : ruleRows + 2;
    const hrb = [];
    hrules.forEach((r, i) => {
      let j = Math.floor(i / rr);
      (hrb[j] = hrb[j] || []).push(r);
    });

    return (
      <ScrollView contentContainerStyle={styles.rules} horizontal={true}>
        <View style={{flexDirection: 'row'}}>
          {hrb.map((rs, i) => {
            return this.renderHorizontalRuleGroup(i, rs);
          })}
        </View>
        <View style={{flexDirection: 'row'}}>
          {vrules.map((r, i) => {
            return this.renderUnderRule(i, r);
          })}
        </View>
      </ScrollView>
    )
  }
}

export default class Einstein extends Component {

  constructor(props) {
    super(props);
    this.newGame();
  }

  newGame() {
    this.field = new Field(size);
    this.game = new GameController(this.field);

    let solver = new Solver(new GameController(this.field));
    do {
      solver.addRule(ruleFactory.newRule(this.field));
    } while (!solver.solve())

    let rules = solver.rules;

    let solved;
    do {
      solved = false;
      for (let n = 0; n < rules.length; ++n) {
        solver = new Solver(new GameController(this.field));
        let trules = [].concat(rules);
        trules.splice(n, 1);
        solver.rules = trules;
        if (solver.solve()) {
          rules.splice(n, 1);
          solved = true;
          break;
        }
      }
    } while (solved);

    this.rules = rules;

    for (let i = 0; i < this.rules.length; ++i) {
      const rule = this.rules[i];
      if ('open' === rule.type) {
        rule.apply(this.game);
      }
    }

    this.game.start();
  }

  render() {
    return (
      <View style={styles.container}>
        <GameField game={this.game} field={this.field}/>
        <Rules rules={this.rules}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  field: {
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

  rules: {
    // flex: 1,
    // borderWidth: styleCfg.ruleBorder,
    // height: height - (styleCfg.group * size + styleCfg.space * (size + 1)),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column'
  },

  rule3: {
    height: styleCfg.ruleItem + styleCfg.ruleSpace * 2 + styleCfg.ruleBorder * 2,
    width: styleCfg.ruleItem * 3 + styleCfg.ruleSpace * 4 + styleCfg.ruleBorder * 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: styleCfg.ruleBorder,
    padding: styleCfg.ruleSpace,
    margin: styleCfg.ruleSpace,
  },

  rule2: {
    height: styleCfg.ruleItem * 2 + styleCfg.ruleSpace * 3 + styleCfg.ruleBorder * 2,
    width: styleCfg.ruleItem + styleCfg.ruleSpace * 2 + styleCfg.ruleBorder * 2,
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderWidth: styleCfg.ruleBorder,
    padding: styleCfg.ruleSpace,
    margin: styleCfg.ruleSpace,
  },

  ruleItem: {
    height: styleCfg.ruleItem,
    width: styleCfg.ruleItem,
    borderWidth: styleCfg.ruleBorder,
  }
});
