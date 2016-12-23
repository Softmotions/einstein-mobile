'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  Text
} from 'react-native';

import {connect} from 'react-redux';

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

  get styles() {
    return this.props.styles.styles;
  }

  renderItem(i, j, k) {
    const {game} = this.props;
    const key = 'item_' + i + '_' + j + '_' + k;
    return (
      <View key={key} style={this.styles.itemBox}>
        { game.possible(i, j, k) ? <ItemImage style={this.styles.item} row={i} value={k}/> : null }
      </View>
    );
  };

  renderGroupItemsLine(i, j, n) {
    return (
      <View style={this.styles.groupItemsRow}>
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
    const {game} = this.props;
    const key = 'group_' + i + '_' + j;

    return (
      <TouchableWithoutFeedback key={key} disabled={game.finished} onPress={this._openPopup(i, j)}>
        <View>
          {!game.isSet(i, j) ?
            <View style={this.styles.groupItem}>
              {this.renderGroupItemsLine(i, j, 0)}
              {this.renderGroupItemsLine(i, j, 1)}
            </View> :
            <ItemImage style={this.styles.groupItem} row={i} value={game.get(i, j)}/>
          }
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderRow(i) {
    const key = 'row_' + i;
    return (
      <View key={key} style={this.styles.row}>
        {items.map((j) => this.renderGroupItem(i, j))}
      </View>
    )
  }

  _onPressPopupItem(i, j, k) {
    const {game} = this.props;

    return () => {
      if (!game.possible(i, j, k)) {
        return;
      }

      game.set(i, j, k);
      this._hidePopup();
      if (game.finished) {
        // TODO: end game alert
        Alert.alert(game.solved ? 'Solved' : 'Fail', 'Your time: ' + game.time + 's', null, {
          // cancelable: false
        });
      }
    }
  };

  _onLongPressPopupItem(i, j, k) {
    const {game} = this.props;

    return () => {
      if (!game.possible(i, j, k)) {
        return;
      }

      game.exclude(i, j, k);
      this.forceUpdate();
      if (game.finished) {
        this._hidePopup();
        // TODO: end game alert
        Alert.alert(game.solved ? 'Solved' : 'Fail', 'Your time: ' + game.time + 's', null, {
          // cancelable: false
        });
      }
    }
  };

  renderPopupItem(i, j, k) {
    const {game} = this.props;
    const key = 'popup_item_' + i + '_' + j + '_' + k;

    // TODO: disable hidden
    return (
      <TouchableOpacity key={key}
                        disabled={game.finished}
                        onPress={this._onPressPopupItem(i, j, k)}
                        onLongPress={this._onLongPressPopupItem(i, j, k)}>
        <View style={this.styles.popupItemBox}>
          { game.possible(i, j, k) ? <ItemImage style={this.styles.popupItem} row={i} value={k}/> : null }
        </View>
      </TouchableOpacity>
    );
  };

  renderPopupGroupItemsLine(i, j, n) {
    return (
      <View style={this.styles.popupGroupItemsRow}>
        {items.filter((t) => t >= n * (size / 2) && t < (n + 1) * (size / 2)).map((k) => this.renderPopupItem(i, j, k))}
      </View>
    );
  }

  renderPopupGroupItem() {
    let {popup} = this.state;
    return (
      <TouchableWithoutFeedback onPress={() => {}}>
        { popup ?
          <View style={this.styles.popupGroupItemBox}>
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
    return (
      <View style={this.styles.fieldContainer}>
        <View>
          {this.state.popup !== null ?
            <View style={[this.styles.modalContainerOuter, {zIndex: 1}]}>
              <TouchableWithoutFeedback onPress={this._hidePopup}>
                <View style={this.styles.modalContainerInner}>
                  <View style={[this.styles.groupItemPopup, this.props.styles.popupPosition(this.state.popup)]}>
                    {this.renderPopupGroupItem()}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View> :
            <View style={[this.styles.modalContainerOuter, {zIndex: -1}]}/>
          }
          <View style={[this.styles.field, {zIndex: 0}]}>
            {items.map((i) => this.renderRow(i))}
          </View>
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

  get styles() {
    return this.props.styles.styles;
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
        <View style={[this.styles.rule3, this.visibilityStyle]}>
          <ItemImage style={this.styles.ruleItem} type={this._type1}/>
          <ItemImage style={this.styles.ruleItem} type={this._type2}/>
          <ItemImage style={this.styles.ruleItem} type={this._type3}/>
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
        <View style={[this.styles.rule2, this.visibilityStyle]}>
          <ItemImage style={this.styles.ruleItem} row={this.props.rule.row1} value={this.props.rule.value1}/>
          <ItemImage style={this.styles.ruleItem} row={this.props.rule.row2} value={this.props.rule.value2}/>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

class Rules extends Component {

  renderUnderRule(i, rule) {
    const key = 'urule_' + i;

    return (
      <Rule2 key={key} rule={rule} disabled={!this.props.game.active} styles={this.props.styles}/>
    );
  }

  renderHorizontalRule(i, j, rule) {
    const key = 'rule_' + i + '_' + j;
    switch (rule.type) {
      case 'near':
        return (
          <NearRule key={key} rule={rule} disabled={!this.props.game.active} styles={this.props.styles}/>
        );
      case 'direction':
        return (
          <DirectionRule key={key} rule={rule} disabled={!this.props.game.active} styles={this.props.styles}/>
        );
      case 'between':
        return (
          <BetweenRule key={key} rule={rule} disabled={!this.props.game.active} styles={this.props.styles}/>
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
    const {styles, rules} = this.props;
    const hrules = rules.filter((r) => 'row' == r.viewType);
    const vrules = rules.filter((r) => 'column' == r.viewType);

    // TODO: extract to utility method
    const rr = vrules.length > 0 ? styles.rule3Rows : styles.rule3Rows + 2;
    const rc = Math.max(Math.ceil(hrules.length / rr), styles.rule3Columns);
    const hrb = Array.from({length: rc}, (v, i) => []);
    hrules.forEach((r, i) => hrb[i % rc].push(r));

    return (
      <ScrollView contentContainerStyle={this.styles.rules} horizontal={true}>
        <View style={this.styles.rulesGroup}>
          {hrb.map((rs, i) => this.renderHorizontalRuleGroup(i, rs))}
        </View>
        <View style={this.styles.rulesGroup}>
          {vrules.map((r, i) => this.renderUnderRule(i, r))}
        </View>
      </ScrollView>
    )
  }

  get styles() {
    return this.props.styles.styles;
  }
}

// TODO extract styles
class TimeInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: this.props.game.time
    };
  }

  componentDidMount() {
    this._timer = setInterval(() => this.setState({time: this.props.game.time}), 500);
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  render() {
    return (
      <View
        style={{position: 'absolute', backgroundColor: '#fff', height: 15, width: 45, top: 0, right: 0, zIndex: 5, alignItems: 'flex-end'}}>
        <Text>{this.state.time}</Text>
      </View>
    );
  }
}

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      styles: new StyleConfig(props.game.size)
    };

    size = props.game.size;
    items = Array.from({length: size}, (v, k) => k);
  }

  get styles() {
    return this.state.styles.styles;
  }

  _updateStyles = () => this.setState({
    styles: new StyleConfig(this.props.game.size)
  });

  render() {
    let {game} = this.props;
    let {styles} = this.state;

    return (
      <View onLayout={this._updateStyles} style={this.styles.container}>
        {/*<TimeInfo game={game} styles={styles}/>*/}
        <GameField game={game} field={game.field} styles={styles}/>
        <Rules game={game} rules={game.rules} styles={styles}/>
      </View>
    );
  }
}

export default connect(state => ({
    game: state.app.game
  }),
  dispatch => ({})
)(Game);