'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert
} from 'react-native';

import {StyleConfig} from './utils';

// todo: global ?
let size, items;

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
        {items.filter((t) => t >= n * (size / 2) && t < (n + 1) * (size / 2)).map((k) => this.renderItem(i, j, k))}
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
        {items.map((j) => this.renderGroupItem(i, j))}
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
      if (game.finished) {
        // TODO: end game alert
        Alert.alert(game.solved ? 'Solved' : 'Fail', '', [
          {
            // text: 'New',
            // onPress: () => {
            //   if (this.props.onNewGame) {
            //     this.props.onNewGame();
            //   }
            // }
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
      if (game.finished) {
        this._hidePopup();
        // TODO: end game alert
        Alert.alert(game.solved ? 'Solved' : 'Fail', '', [
          {
            // text: 'New',
            // onPress: () => {
            //   if (this.props.onNewGame) {
            //     this.props.onNewGame();
            //   }
            // }
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
        {items.filter((t) => t >= n * (size / 2) && t < (n + 1) * (size / 2)).map((k) => this.renderPopupItem(i, j, k))}
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

  _hidePopup = () => this.setState({popup: null});

  render() {
    const styles = this.props.styles;

    /*
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
     */

    // TODO: extract styles
    return (
      <View style={styles.styles.field}>
        {this.state.popup !== null ?
          <View
            style={{zIndex: 1, position: 'absolute', top: 0,  bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(1, 1, 1, 0.05)'}}>
            <TouchableWithoutFeedback onPress={this._hidePopup}>
              <View style={styles.styles.modalContainer}>
                <View style={[styles.styles.groupItemPopup, styles.popupPosition(this.state.popup)]}>
                  {this.renderPopupGroupItem()}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View> :
          <View style={{zIndex: -1, position: 'absolute', height: 0}}/>
        }
        <View style={{zIndex: 0}}>
          {items.map((i) => this.renderRow(i))}
        </View>
      </View>
    );
  }
}

class AbstractRule extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: true}
  }

  toggle = () => this.setState({visible: !this.state.visible});

  // todo: extract styles
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
      <TouchableWithoutFeedback disabled={this.props.disabled} onPress={this.toggle}>
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
      <TouchableWithoutFeedback disabled={this.props.disabled} onPress={this.toggle}>
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
      <Rule2 key={key} rule={rule} disabled={!this.props.game.active} styles={this.styles}/>
    );
  }

  renderHorizontalRule(i, j, rule) {
    const key = 'rule_' + i + '_' + j;
    switch (rule.type) {
      case 'near':
        return (
          <NearRule key={key} rule={rule} disabled={!this.props.game.active} styles={this.styles}/>
        );
      case 'direction':
        return (
          <DirectionRule key={key} rule={rule} disabled={!this.props.game.active} styles={this.styles}/>
        );
      case 'between':
        return (
          <BetweenRule key={key} rule={rule} disabled={!this.props.game.active} styles={this.styles}/>
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
        {rules.map((r, j) => this.renderHorizontalRule(i, j, r))}
      </View>
    )
  }

  render() {
    // TODO: refactor ?
    const rules = this.props.rules;
    const hrules = rules.filter((r) => 'row' == r.viewType);
    const vrules = rules.filter((r) => 'column' == r.viewType);

    const rr = vrules.length > 0 ? this.styles.rule3Rows : this.styles.rule3Rows + 2;
    const rc = Math.max(Math.ceil(hrules.length / rr), this.styles.rule3Columns);
    const hrb = Array.from({length: rc}, (v, i) => []);
    hrules.forEach((r, i) => hrb[(i % rc)].push(r));

    // todo: extract styles
    return (
      <ScrollView contentContainerStyle={this.styles.styles.rules} style={{alignSelf: 'flex-start'}} horizontal={true}>
        <View style={{flexDirection: 'row', }}>
          {hrb.map((rs, i) => this.renderHorizontalRuleGroup(i, rs))}
        </View>
        <View style={{flexDirection: 'row'}}>
          {vrules.map((r, i) => this.renderUnderRule(i, r))}
        </View>
      </ScrollView>
    )
  }

  get styles() {
    return this.props.styles;
  }
}

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      styles: new StyleConfig(props.game.size)
    };
  }

  _updateStyles = () => this.setState({
    styles: new StyleConfig(this.props.game.size)
  });

  render() {
    let game = this.props.game;
    game.resume();
    size = game.size;
    items = Array.from({length: size}, (v, k) => k);
    return (
      <View onLayout={this._updateStyles}
            style={[this.state.styles.styles.container, {flexDirection: this.state.styles.direction}]}>
        <View style={this.state.styles.styles.fieldContainer}>
          <GameField game={game}
                     field={game.field}
                     styles={this.state.styles}/>
        </View>
        <Rules game={game} rules={game.rules} styles={this.state.styles}/>
      </View>
    );
  }
}