'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
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
const items = [];
for (let i = 0; i < 6; ++i) {
  items.push(i);
}

class ItemImage extends Component {
  static src(row, value) {
    return 'item' + (row + 1) + (value + 1);
  }

  render() {
    const src = !this.props.type ? ItemImage.src(this.props.row, this.props.value) : this.props.type;
    return (
      <Image style={this.props.style} source={{uri: src}}/>
    )
  }
}

class GameField extends Component {

  constructor(props) {
    super(props);
    this.state = {popup: null};
  }

  renderItem(i, j, k) {
    const game = this.props.game;
    const key = 'item_' + i + '_' + j + '_' + k;
    return (
      <View key={key} style={this.props.styles.styles.itemBox}>
        { game.possible(i, j, k) ? <ItemImage style={this.props.styles.styles.item} row={i} value={k}/> : null }
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

  _openPopup(i, j) {
    return () => {
      if (!this.props.game.isSet(i, j)) {
        this.setState({popup: {i: i, j: j}})
      }
    };
  }

  renderGroupItem(i, j) {
    const game = this.props.game;
    const key = 'group_' + i + '_' + j;

    return (
      <TouchableWithoutFeedback key={key} disabled={game.finished} onPress={this._openPopup(i, j)}>
        <View>
          {!game.isSet(i, j) ?
            <View style={this.props.styles.styles.groupItem}>
              {this.renderGroupItemsLine(i, j, 0)}
              {this.renderGroupItemsLine(i, j, 1)}
            </View> :
            <ItemImage style={this.props.styles.styles.groupItem} row={i} value={game.get(i, j)}/>
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
        ], {
          // cancelable: false
        });
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
        ], {
          // cancelable: false
        });
      }
    }
  };

  renderPopupItem(i, j, k) {
    const game = this.props.game;
    const key = 'popup_item_' + i + '_' + j + '_' + k;

    // TODO: disable hidden
    return (
      <TouchableOpacity key={key}
                        disabled={game.finished}
                        onPress={this._onPressPopupItem(i, j, k)}
                        onLongPress={this._onLongPressPopupItem(i, j, k)}>
        <View style={this.props.styles.styles.popupItemBox}>
          { game.possible(i, j, k) ? <ItemImage style={this.props.styles.styles.popupItem} row={i} value={k}/> : null }
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
    const styles = this.props.styles;

    return (
      <View style={styles.styles.field}>
        <Modal visible={this.state.popup != null}
               transparent={true}
               onRequestClose={() => {}}>
          <TouchableWithoutFeedback onPress={this._hidePopup}>
            <View style={styles.styles.modalContainer}>
              <View style={[styles.styles.groupItemPopup, styles.popupPosition(this.state.popup)]}>
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

class AbstractRule extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: true}
  }

  toggle = () => {
    this.setState({visible: !this.state.visible});
  };

  get visibilityStyle() {
    return {opacity: this.state.visible ? 1 : 0.15};
  }
}

class Rule3 extends AbstractRule {
  constructor(props) {
    super(props);
  }

  get _type1() {
    return '';
  }

  get _type2() {
    return '';
  }

  get _type3() {
    return '';
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.toggle}>
        <View style={[this.props.styles.styles.rule3, this.visibilityStyle]}>
          <ItemImage style={this.props.styles.styles.ruleItem} type={this._type1}/>
          <ItemImage style={this.props.styles.styles.ruleItem} type={this._type2}/>
          <ItemImage style={this.props.styles.styles.ruleItem} type={this._type3}/>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

class NearRule extends Rule3 {
  get _type1() {
    return ItemImage.src(this.props.rule.row1, this.props.rule.value1);
  }

  get _type2() {
    return 'near';
  }

  get _type3() {
    return ItemImage.src(this.props.rule.row2, this.props.rule.value2);
  }
}

class DirectionRule extends Rule3 {
  get _type1() {
    return ItemImage.src(this.props.rule.row1, this.props.rule.value1);
  }

  get _type2() {
    return 'direction';
  }

  get _type3() {
    return ItemImage.src(this.props.rule.row2, this.props.rule.value2);
  }
}

class BetweenRule extends Rule3 {
  get _type1() {
    return ItemImage.src(this.props.rule.row1, this.props.rule.value1);
  }

  get _type2() {
    return ItemImage.src(this.props.rule.row2, this.props.rule.value2);
  }

  get _type3() {
    return ItemImage.src(this.props.rule.row3, this.props.rule.value3);
  }

}

class Rule2 extends AbstractRule {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.toggle}>
        <View style={[this.props.styles.styles.rule2, this.visibilityStyle]}>
          <ItemImage style={this.props.styles.styles.ruleItem}
                     row={this.props.rule.row1}
                     value={this.props.rule.value1}/>
          <ItemImage style={this.props.styles.styles.ruleItem}
                     row={this.props.rule.row2}
                     value={this.props.rule.value2}/>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

class Rules extends Component {

  renderUnderRule(i, rule) {
    const key = 'urule_' + i;

    return (
      <Rule2 key={key} rule={rule} styles={this.styles}/>
    );
  }

  renderHorizontalRule(i, j, rule) {
    const key = 'rule_' + i + '_' + j;
    switch (rule.type) {
      case 'near':
        return (
          <NearRule key={key} rule={rule} styles={this.styles}/>
        );
      case 'direction':
        return (
          <DirectionRule key={key} rule={rule} styles={this.styles}/>
        );
      case 'between':
        return (
          <BetweenRule key={key} rule={rule} styles={this.styles}/>
        );
      default:
        return (
          <View key={key}/>
        );
    }
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

  newGame = (init) => {
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
  };

  _updateStyles = () => {
    this.setState({
      styles: new StyleConfig(size)
    });
  };

  render() {
    return (
      <View onLayout={this._updateStyles}
            style={[this.state.styles.styles.container, {flexDirection: this.state.styles.direction}]}>
        <View style={this.state.styles.styles.fieldContainer}>
          {this.state.game && this.state.field ?


            <GameField game={this.state.game}
                       field={this.state.field}
                       styles={this.state.styles}
                       onNewGame={this.newGame}/>
            : null}
        </View>
        {this.state.rules ? <Rules rules={this.state.rules} styles={this.state.styles}/> : null}
      </View>
    );
  }
}