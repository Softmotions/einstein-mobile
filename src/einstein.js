'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
  Alert
} from 'react-native';

import {ruleFactory} from './rules';
import {Field, GameController} from './field';
import {Solver} from './solver';
import {StyleConfig} from './utils';

const size = 6;
const Dimensions = require('Dimensions');

const items = [];
for (let i = 0; i < 6; ++i) {
  items.push(i);
}

export class GameField extends Component {

  constructor(props) {
    super(props);
    this.state = {popup: null};
  }

  renderItem(i, j, k) {
    const game = this.props.game;

    const key = 'item_' + i + '_' + j + '_' + k;
    const src = 'item' + (i + 1) + (k + 1);
    return (
      <View key={key} style={this.props.styles.styles.itemBox}>
        { game.possible(i, j, k) ? <Image style={this.props.styles.styles.item} source={{uri: src}}/> : null }
      </View>
    );
  };

  renderGroupItemsLine(i, j, n) {
    return (
      <View style={this.props.styles.styles.groupItemsRow}>
        {items.filter((t) => {
          return t >= n * (size / 2) && t < (n + 1) * (size / 2)
        }).map((k) => {
          return this.renderItem(i, j, k)
        })}
      </View>
    );
  }

  renderGroupItem(i, j) {
    const game = this.props.game;

    const key = 'group_' + i + '_' + j;
    const src = 'item' + (i + 1 ) + (game.get(i, j) + 1);

    return (
      <TouchableWithoutFeedback key={key}
                                onPress={() => {if (!game.isSet(i, j)) { this.setState({popup: {i: i, j: j}})}}}>
        <View>
          {!game.isSet(i, j) ?
            <View style={this.props.styles.styles.groupItem}>
              {this.renderGroupItemsLine(i, j, 0)}
              {this.renderGroupItemsLine(i, j, 1)}
            </View> :
            <Image style={this.props.styles.styles.groupItem} source={{uri : src}}/>
          }
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderRow(i) {
    const key = 'row_' + i;
    return (
      <View key={key} style={this.props.styles.styles.row}>
        {items.map((j) => {
          return this.renderGroupItem(i, j);
        })}
      </View>
    )
  }

  _onPressPopupItem(i, j, k) {
    const game = this.props.game;

    return () => {
      if (!game.possible(i, j, k)) {
        return;
      }

      game.set(i, j, k);
      this._hidePopup();
      if (!game.active) {
        // TODO: end game alert
        Alert.alert(game.solved ? 'Solved' : 'Fail', '', [
          {
            text: 'New',
            onPress: () => {
              if (this.props.onNewGame) {
                this.props.onNewGame();
              }
            }
          }
        ]);
      }
    }
  };

  _onLongPressPopupItem(i, j, k) {
    const game = this.props.game;

    return () => {
      if (!game.possible(i, j, k)) {
        return;
      }

      game.exclude(i, j, k);
      this.forceUpdate();
      if (!game.active) {
        this._hidePopup();
        // TODO: end game alert
        Alert.alert(game.solved ? 'Solved' : 'Fail', '', [
          {
            text: 'New',
            onPress: () => {
              if (this.props.onNewGame) {
                this.props.onNewGame();
              }
            }
          }
        ]);
      }
    }
  };

  renderPopupItem(i, j, k) {
    const game = this.props.game;

    const key = 'item_' + i + '_' + j + '_' + k;
    const src = 'item' + (i + 1) + (k + 1);
    // TODO: disable hidden
    return (
      <TouchableOpacity key={key}
                        onPress={this._onPressPopupItem(i, j, k)}
                        onLongPress={this._onLongPressPopupItem(i, j, k)}>
        <View style={this.props.styles.styles.popupItemBox}>
          { game.possible(i, j, k) ? <Image style={this.props.styles.styles.popupItem} source={{uri: src}}/> : null }
        </View>
      </TouchableOpacity>
    );
  };

  renderPopupGroupItemsLine(i, j, n) {
    return (
      <View style={this.props.styles.styles.popupGroupItemsRow}>
        {items.filter((t) => {
          return t >= n * (size / 2) && t < (n + 1) * (size / 2)
        }).map((k) => {
          return this.renderPopupItem(i, j, k)
        })}
      </View>
    );
  }

  renderPopupGroupItem() {
    let popup = this.state.popup;
    return (
      <TouchableWithoutFeedback onPress={() => {}}>
        { popup ?
          <View style={this.props.styles.styles.popupGroupItemBox}>
            {this.renderPopupGroupItemsLine(popup.i, popup.j, 0)}
            {this.renderPopupGroupItemsLine(popup.i, popup.j, 1)}
          </View> :
          null
        }
      </TouchableWithoutFeedback>
    )
  }

  _hidePopup = () => {
    this.setState({popup: null});
  };

  render() {
    // TODO: calculate popup position

    let astyles;
    if (this.state.popup) {
      let left = (this.props.styles.fieldSize - this.props.styles.popupBoxWidth) / 5 * this.state.popup.j;
      let top = (this.props.styles.fieldSize - this.props.styles.popupBoxHeight) / 5 * this.state.popup.i;

      // TODO: style - orientation
      if (this.props.styles.width > this.props.styles.height) {
        top += (this.props.styles.height - this.props.styles.fieldSize) / 2 - 11 /* todo remove hardcode */;
        // add margins
        left += this.props.styles.space;
      } else {
        left += (this.props.styles.width - this.props.styles.fieldSize) / 2;
        // add margins
        top += this.props.styles.space;
      }


      astyles = StyleSheet.create({
        popupPosition: {
          left: Math.floor(left),
          top: Math.floor(top),
          position: 'absolute',
        }
      });
    } else {
      astyles = StyleSheet.create({
        popupPosition: {}
      });
    }

    return (
      <View style={this.props.styles.styles.field}>
        <Modal visible={this.state.popup != null}
               transparent={true}
               onRequestClose={() => {}}>
          <TouchableWithoutFeedback onPress={this._hidePopup}>
            <View style={this.props.styles.styles.modalContainer}>
              <View style={[this.props.styles.styles.groupItemPopup, astyles.popupPosition]}>
                {this.renderPopupGroupItem()}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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

  toggle = () => {
    this.setState({visible: !this.state.visible});
  };

  render() {
    let opacity = this.state.visible ? 1 : 0.15;
    return (
      <TouchableWithoutFeedback onPress={this.toggle}>
        <View style={[this.props.styles.styles.rule3, {opacity: opacity}]}>
          <Image style={this.props.styles.styles.ruleItem} source={{uri: this.props.img1}}/>
          <Image style={this.props.styles.styles.ruleItem} source={{uri: this.props.img2}}/>
          <Image style={this.props.styles.styles.ruleItem} source={{uri: this.props.img3}}/>
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
        <View style={[this.props.styles.styles.rule2, {opacity: opacity}]}>
          <Image style={this.props.styles.styles.ruleItem} source={{uri: this.props.img1}}/>
          <Image style={this.props.styles.styles.ruleItem} source={{uri: this.props.img2}}/>
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
      <Rule3 img1={src1} img2="near" img3={src2} styles={this.styles}/>
    );
  }

  renderDirectionRule(rule) {
    const src1 = 'item' + (rule.row1 + 1) + (rule.value1 + 1);
    const src2 = 'item' + (rule.row2 + 1) + (rule.value2 + 1);

    return (
      <Rule3 img1={src1} img2="direction" img3={src2} styles={this.styles}/>
    );
  }

  renderBetweenRule(rule) {
    const src1 = 'item' + (rule.row1 + 1) + (rule.value1 + 1);
    const src2 = 'item' + (rule.row2 + 1) + (rule.value2 + 1);
    const src3 = 'item' + (rule.row3 + 1) + (rule.value3 + 1);

    return (
      <Rule3 img1={src1} img2={src2} img3={src3} styles={this.styles}/>
    );
  }

  renderUnderRule(i, rule) {
    const key = 'urule_' + i;

    const src1 = 'item' + (rule.row1 + 1) + (rule.value1 + 1);
    const src2 = 'item' + (rule.row2 + 1) + (rule.value2 + 1);

    return (
      <Rule2 key={key} img1={src1} img2={src2} styles={this.styles}/>
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
    // TODO: refactor
    const rules = this.props.rules;
    const hrules = rules.filter((r) => {
      return 'row' == r.viewType;
    });
    const vrules = rules.filter((r) => {
      return 'column' == r.viewType;
    });

    let rr = vrules.length > 0 ? this.styles.rule3Rows : this.styles.rule3Rows + 2;
    let hrb = [];
    hrules.forEach((r, i) => {
      let j = Math.floor(i / rr);
      (hrb[j] = hrb[j] || []).push(r);
    });

    // todo: extract styles
    return (
      <ScrollView contentContainerStyle={this.styles.styles.rules} style={{alignSelf: 'flex-start'}} horizontal={true}>
        <View style={{flexDirection: 'row', }}>
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

  get styles() {
    return this.props.styles;
  }
}

export default class Einstein extends Component {
  constructor(props) {
    super(props);
    this.newGame(true);
  }

  newGame(init) {
    let field = new Field(size);
    let game = new GameController(field);

    // TODO: move rules generation to method/class. ruleFactory?

    let solver = new Solver(new GameController(field));
    do {
      solver.addRule(ruleFactory.newRule(field));
    } while (!solver.solve());

    let rules = solver.rules;

    let solved;
    do {
      solved = false;
      for (let n = 0; n < rules.length; ++n) {
        solver = new Solver(new GameController(field));
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

    for (let i = 0; i < rules.length; ++i) {
      const rule = rules[i];
      if ('open' === rule.type) {
        rule.apply(game);
      }
    }

    game.start();

    if (init) {
      this.state = {
        field: field,
        game: game,
        rules: rules,
        styles: new StyleConfig(size),
      }
    } else {
      this.setState({
        field: field,
        game: game,
        rules: rules
      });
    }
  }

  _updateStyles = () => {
    this.setState({
      styles: new StyleConfig(size)
    });
  };

  render() {
    return (
      <View onLayout={this._updateStyles}
            style={[this.state.styles.container, {flexDirection: this.state.styles.direction}]}>
        {this.state.game && this.state.field ?
          <GameField game={this.state.game}
                     field={this.state.field}
                     styles={this.state.styles}
                     onNewGame={() => {this.newGame()}}/> : null}
        {this.state.rules ? <Rules rules={this.state.rules} styles={this.state.styles}/> : null}
      </View>
    );
  }
}