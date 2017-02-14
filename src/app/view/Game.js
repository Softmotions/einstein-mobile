'use strict';

import React, {Component} from 'react';
import {
  AppState,
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  Text,
  InteractionManager
} from 'react-native';

import {Loader} from './Loader';

import {connect} from 'react-redux';

import {StyleConfig, formatTime} from './utils';

import {gameRuleToggle, gameNew} from '../actions/game';
import {navStats} from '../actions/navigation';
import {statsGameFailed, statsGameSolved} from '../actions/statistics';

import {i18n} from '../utils/i18n';

import {
  PLAYGAMES_LEADERBOARD_ID,
  PLAYGAMES_LEADERBOARD_STACK_ID,
  PLAYGAMES_ACHIEVEMENT_SOLVED_10,
  PLAYGAMES_ACHIEVEMENT_MISTAKE_IS_NOT_A_PROBLEM,
  PLAYGAMES_ACHIEVEMENT_SPRINTER,
  PLAYGAMES_ACHIEVEMENT_FIRST_SOLVED,
  PLAYGAMES_ACHIEVEMENT_STRONG_SOLVER
} from '../constants/playgames';

import {GameActivity, PlayGames} from '../modules/native';

class ItemImage extends Component {
  static item = (row, value) => 'item' + (row + 1) + (value + 1);
  static hint = (row, value) => 'hint' + (row + 1) + (value + 1);

  render() {
    const src = !this.props.type ?
      (this.props.hint ? ItemImage.hint(this.props.row, this.props.value) : ItemImage.item(this.props.row, this.props.value)) :
      this.props.type;
    return (
      <Image style={this.props.style} source={{uri: src}}/>
    )
  }
}

class AGameField extends Component {

  constructor(props) {
    super(props);
    this.state = {popup: null};
  }

  get styles() {
    return this.props.styles.styles;
  }

  get size() {
    return this.props.game.size;
  }

  renderHint = (i, j, k) => (
    <View key={'hint_' + i + '_' + j + '_' + k} style={this.styles.itemBox}>
      { this.props.game.possible(i, j, k) ? <ItemImage style={this.styles.item} row={i} value={k} hint={true}/> : null }
    </View>
  );

  renderGroupItemsLine = (i, j, n) => (
    <View style={this.styles.groupItemsRow}>
      { Array.from({length: this.size}, (v, k) => k)
        .filter((t) => t >= n * (this.size / 2) && t < (n + 1) * (this.size / 2))
        .map((k) => this.renderHint(i, j, k)) }
    </View>
  );

  _openPopup(i, j) {
    return () => {
      if (!this.props.game.isSet(i, j)) {
        this.setState({popup: {i: i, j: j}})
      }
    };
  }

  renderGroupItem = (i, j) => (
    <TouchableWithoutFeedback key={'group_' + i + '_' + j}
                              disabled={this.props.game.finished}
                              onPress={this._openPopup(i, j)}>
      <View>
        {
          !this.props.game.isSet(i, j) ?
            <View style={this.styles.groupItem}>
              {this.renderGroupItemsLine(i, j, 0)}
              {this.renderGroupItemsLine(i, j, 1)}
            </View> :
            <ItemImage style={this.styles.groupItem} row={i} value={this.props.game.get(i, j)}/>
        }
      </View>
    </TouchableWithoutFeedback>
  );

  renderRow = (i) => (
    <View key={'row_' + i} style={this.styles.row}>
      { Array.from({length: this.size}, (v, k) => k).map((j) => this.renderGroupItem(i, j)) }
    </View>
  );

  _onGameFinish = () =>
    this.props.game.solved ?
      this._onGameSolved() :
      this._onGameFailed();

  // TODO: extract play games achievements handlers & config
  _onGameSolved = () => {
    GameActivity.stop();
    let t = this.props.game.time;
    this.props._statSolved({time: t, date: new Date()})
      .then((stats) => {
        if (stats.currentStack >= 10) {
          PlayGames.achievementUnlock(PLAYGAMES_ACHIEVEMENT_STRONG_SOLVER);
        }
        PlayGames.setLeaderboardScore(PLAYGAMES_LEADERBOARD_STACK_ID, stats.currentStack || 1);
      });
    if (t < 60) {
      PlayGames.achievementUnlock(PLAYGAMES_ACHIEVEMENT_SPRINTER);
    }
    PlayGames.achievementUnlock(PLAYGAMES_ACHIEVEMENT_FIRST_SOLVED);
    PlayGames.setLeaderboardScore(PLAYGAMES_LEADERBOARD_ID, t * 1000);
    PlayGames.achievementIncrement(PLAYGAMES_ACHIEVEMENT_SOLVED_10, 1);

    Alert.alert(
      i18n.message.tr('solve_title'),
      i18n.message.tr('solve_text', formatTime(this.props.game.time, true)),
      [
        {text: i18n.button.tr('statistics_short'), onPress: this.props._toStats},
        {text: i18n.button.tr('ok')}
      ],
      {}
    );
  };

  _onGameFailed = () => {
    GameActivity.stop();
    PlayGames.achievementUnlock(PLAYGAMES_ACHIEVEMENT_MISTAKE_IS_NOT_A_PROBLEM);
    this.props._statFailed();
    Alert.alert(
      i18n.message.tr('fail_title'),
      i18n.message.tr('fail_text', formatTime(this.props.game.time, true)),
      [
        {text: i18n.button.tr('statistics_short'), onPress: this.props._toStats},
        {text: i18n.button.tr('ok')}
      ],
      {}
    );
  };

  _onPressPopupItem = (i, j, k) => (() => {
      if (!this.props.game.possible(i, j, k)) {
        return;
      }

      this.props.game.set(i, j, k);
      this._hidePopup();
      if (this.props.game.finished) {
        this._onGameFinish()
      }
    }
  );

  _onLongPressPopupItem = (i, j, k) => (() => {
      if (!this.props.game.possible(i, j, k)) {
        return;
      }

      if (__DEV__ && this.props.game.field.value(i, j) == k) {
        this.props.game._count = 0;
        this.props.game.stop();
        this._hidePopup();
        this._onGameFinish();
        return;
      }

      this.props.game.exclude(i, j, k);
      this.forceUpdate();
      if (this.props.game.finished) {
        this._hidePopup();
        this._onGameFinish();
      }
    }
  );

  renderPopupItem(i, j, k) {
    let {game} = this.props;
    const key = 'popup_item_' + i + '_' + j + '_' + k;

    let devStyle = null;
    if (__DEV__ && game.field.value(i, j) == k) {
      devStyle = {
        borderWidth: 2,
        borderColor: 'red'
      }
    }

    // TODO: disable hidden
    return (
      <TouchableOpacity key={key}
                        disabled={game.finished}
                        onPress={this._onPressPopupItem(i, j, k)}
                        onLongPress={this._onLongPressPopupItem(i, j, k)}>
        <View style={this.styles.popupItemBox}>
          { game.possible(i, j, k) ? <ItemImage style={[this.styles.popupItem, devStyle]} row={i} value={k}/> : null }
        </View>
      </TouchableOpacity>
    );
  };

  renderPopupGroupItemsLine = (i, j, n) => (
    <View style={this.styles.popupGroupItemsRow}>
      { Array.from({length: this.size}, (v, k) => k)
        .filter((t) => t >= n * (this.size / 2) && t < (n + 1) * (this.size / 2))
        .map((k) => this.renderPopupItem(i, j, k)) }
    </View>
  );

  renderPopupGroupItem = () => (
    <TouchableWithoutFeedback onPress={() => {
    }}>
      { this.state.popup ?
        <View style={this.styles.popupGroupItemBox}>
          { this.renderPopupGroupItemsLine(this.state.popup.i, this.state.popup.j, 0) }
          { this.renderPopupGroupItemsLine(this.state.popup.i, this.state.popup.j, 1) }
        </View> :
        null
      }
    </TouchableWithoutFeedback>
  );

  _hidePopup = () => this.setState({popup: null});

  render = () => (
    <View style={this.styles.fieldContainer}>
      <View>
        { this.state.popup !== null ?
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
          { Array.from({length: this.size}, (v, k) => k).map((i) => this.renderRow(i)) }
        </View>
      </View>
    </View>
  );
}

const GameField = connect(state => ({
  game: state.game.game
}), dispatch => ({
  _statFailed: () => dispatch(statsGameFailed()),
  _statSolved: (time) => dispatch(statsGameSolved(time)),
  _toStats: () => dispatch(navStats()),
  _newGame: () => dispatch(gameNew()),
}))(AGameField);

class AbstractRule extends Component {
  constructor(props) {
    super(props);
  }

  get styles() {
    return this.props.styles.styles;
  }

  // todo: extract styles
  get visibilityStyle() {
    return {opacity: this.props.visible ? 1 : 0.15};
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

  render = () => (
    <TouchableWithoutFeedback disabled={this.props.disabled} onPress={this.props.toggle}>
      <View style={[this.styles.rule3, this.visibilityStyle]}>
        <ItemImage style={this.styles.ruleItem} type={this._type1}/>
        <ItemImage style={this.styles.ruleItem} type={this._type2}/>
        <ItemImage style={this.styles.ruleItem} type={this._type3}/>
      </View>
    </TouchableWithoutFeedback>
  )
}

class NearRule extends Rule3 {
  get _type1() {
    return ItemImage.hint(this.props.rule.row1, this.props.rule.value1);
  }

  get _type2() {
    return 'near';
  }

  get _type3() {
    return ItemImage.hint(this.props.rule.row2, this.props.rule.value2);
  }
}

class DirectionRule extends Rule3 {
  get _type1() {
    return ItemImage.hint(this.props.rule.row1, this.props.rule.value1);
  }

  get _type2() {
    return 'direction';
  }

  get _type3() {
    return ItemImage.hint(this.props.rule.row2, this.props.rule.value2);
  }
}

class BetweenRule extends Rule3 {
  constructor(props) {
    super(props);
  }

  get _type1() {
    return ItemImage.hint(this.props.rule.row1, this.props.rule.value1);
  }

  get _type2() {
    return ItemImage.hint(this.props.rule.row2, this.props.rule.value2);
  }

  get _type3() {
    return ItemImage.hint(this.props.rule.row3, this.props.rule.value3);
  }
}

class Rule2 extends AbstractRule {
  constructor(props) {
    super(props);
  }

  render = () => (
    <TouchableWithoutFeedback disabled={this.props.disabled} onPress={this.props.toggle}>
      <View style={[this.styles.rule2, this.visibilityStyle]}>
        <ItemImage style={this.styles.ruleItem} row={this.props.rule.row1} value={this.props.rule.value1} hint={true}/>
        <ItemImage style={this.styles.ruleItem} row={this.props.rule.row2} value={this.props.rule.value2} hint={true}/>
      </View>
    </TouchableWithoutFeedback>
  );
}

class ARule extends Component {
  constructor(props) {
    super(props);
  }

  ruleTypeToComponent = (type) => {
    switch (type) {
      case 'near':
        return NearRule;
      case 'direction':
        return DirectionRule;
      case 'between':
        return BetweenRule;
      case 'under':
        return Rule2;
      default:
        return null;
    }
  };

  render = () => {
    let {rule, game, _onRuleToggle} = this.props;
    const RuleComponent = this.ruleTypeToComponent(rule.rule.type);
    const toggle = () => _onRuleToggle(rule.id);

    return RuleComponent ?
      (<RuleComponent rule={rule.rule}
                      disabled={!game.game.active}
                      toggle={toggle}
                      visible={rule.visible}
                      styles={this.props.styles}/>) :
      (<View/>);
  }
}

const Rule = connect(state => ({
  game: state.game
}), dispatch => ({
  _onRuleToggle: (id) => dispatch(gameRuleToggle(id))
}))(ARule);

class ARules extends Component {
  renderUnderRule = (i, rule) => (
    <Rule key={rule.id} rule={rule} styles={this.props.styles}/>
  );

  renderHorizontalRuleGroup = (i, rules) => (
    <View key={'rule_group_' + i}>
      {rules.map((rule) => (<Rule key={rule.id} rule={rule} styles={this.props.styles}/>))}
    </View>
  );

  render() {
    let {styles, game} = this.props;
    const rules = Object.keys(game.rules).map((k) => game.rules[k]);

    const hrules = rules.filter((r) => 'row' == r.rule.viewType);
    const vrules = rules.filter((r) => 'column' == r.rule.viewType);

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

const Rules = connect(state => ({game: state.game}), dispatch => ({}))(ARules);

class AStatusInfo extends Component {
  _timer;

  constructor(props) {
    super(props);
    this.state = {
      time: 0
    };
  }

  get styles() {
    return this.props.styles.styles;
  }

  componentWillMount() {
    this._timer = setInterval(() => this.setState({time: this.props.game.game.time}), 500);
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  _formatTime = () => formatTime(this.state.time);

  renderGameStatus = () => this.props.game.game.solved ? this.renderGameSolvedStatus() : this.renderGameFailedStatus();

  renderGameFailedStatus = () => (<Text style={this.styles.failedStatusText}>{i18n.status.tr('failed')}</Text>);

  renderGameSolvedStatus = () => (<Text style={this.styles.solvedStatusText}>{i18n.status.tr('solved')}</Text>);

  render = () => (
    <View style={[this.styles.statusInfoBox, {zIndex: 5}]}>
      {this.props.game.game.finished ? this.renderGameStatus() : null}
      <Text style={this.styles.timeStatusText}>{this._formatTime()}</Text>
    </View>
  );
}

const StatusInfo = connect(state => ({game: state.game}), dispatch => ({}))(AStatusInfo);

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      styles: null
    };
  }

  componentWillMount() {
    GameActivity.start();
    InteractionManager.runAfterInteractions(() => this.setState({ready: true}));
  }

  componentWillUnmount() {
    GameActivity.stop();
  }

  get styles() {
    return this.state.styles.styles;
  }

  _updateStyles = () => {
    if (this.props.game.game) {
      this.setState({styles: new StyleConfig(this.props.game.game.size)});
    }
  };

  renderPlaceholder = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Loader/>
    </View>
  );

  render() {
    let {ready, styles} = this.state;
    let {game} = this.props;
    if (!game.game || !ready) {
      return this.renderPlaceholder();
    }

    if (!styles) {
      InteractionManager.runAfterInteractions(() => this._updateStyles());
      return this.renderPlaceholder();
    }

    return (
      <View onLayout={this._updateStyles} style={this.styles.container}>
        <StatusInfo styles={styles}/>
        <GameField styles={styles}/>
        <Rules styles={styles}/>
      </View>
    );
  }
}

export default connect(state => ({game: state.game}), dispatch => ({}))(Game);