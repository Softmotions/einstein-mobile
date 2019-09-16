'use strict';

import React, {Component} from 'react';
import {Alert, Image, InteractionManager, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View, StatusBar} from 'react-native';

import MIcon from 'react-native-vector-icons/MaterialIcons';

import {connect} from 'react-redux';

import {captureRef} from "react-native-view-shot";
import Share from 'react-native-share';

import {formatTime, StyleConfig} from './utils';

import {gameNew, gameClear, gameRuleToggle, gamePause} from '../actions/game';
import {navBack, navStats} from '../actions/navigation';
import {statsGameFailed, statsGameSolved, statsGameTry} from '../actions/statistics';
import {settingsUpdate} from '../actions/settings';

import {i18n} from '../utils/i18n';

import {
  PLAYGAMES_ACHIEVEMENT_FIRST_SOLVED,
  PLAYGAMES_ACHIEVEMENT_MISTAKE_IS_NOT_A_PROBLEM,
  PLAYGAMES_ACHIEVEMENT_SOLVED_10,
  PLAYGAMES_ACHIEVEMENT_SPRINTER,
  PLAYGAMES_ACHIEVEMENT_STRONG_SOLVER,
  PLAYGAMES_ACHIEVEMENT_HARDCORE_SOLVER,
  PLAYGAMES_LEADERBOARD_ID,
  PLAYGAMES_LEADERBOARD_STACK_ID,
} from '../constants/playgames';
import {OPTION_PRESS_EXCLUDE, DONT_HIDE_POPUP, LONG_PRESS_SECOND_ACTION} from '../constants/settings';

import {GameActivity, PlayGames} from '../modules/native';

import {Loader} from './Loader';
import {Header} from './header';
import {HeaderButton, IconHeaderButton} from './header/buttons';

import moment from '../utils/moment';

class Selector extends Component {
  render = () => (
    <View style={{marginLeft: this.props.value ? 15 : 0, marginRight: this.props.value ? 0 : 15, justifyContent: 'center'}}>
      <MIcon name={!this.props.value ? 'navigate-before' : 'navigate-next'} size={32}/>
    </View>
  );
}


const GameHeader = connect(state => ({
  settings: state.settings,
}), dispatch => ({
  _onNavigateBack: () => {
    dispatch(gamePause());
    dispatch(navBack());
  },
  _optionUpdate: (update) => dispatch(settingsUpdate(update)),
}))(class extends Header {
  constructor(props) {
    super(props);
    this.state = {
      popup: false,
      exclude: !!this.props.settings[OPTION_PRESS_EXCLUDE],
    };
  }

  componentDidMount = () => this.props.setRef && this.props.setRef({
    popupShown: this.popupShown,
  });

  componentWillUnmount = () => this.props.setRef && this.props.setRef(null);

  popupShown = value => this.setState({popup: value});

  _onSwitch = value => {
    this.setState({exclude: value});
    this.props._optionUpdate({[OPTION_PRESS_EXCLUDE]: value})
      .then(() => this.setState({exclude: !!this.props.settings[OPTION_PRESS_EXCLUDE]}),
        () => this.setState({exclude: !!this.props.settings[OPTION_PRESS_EXCLUDE]}));
  };

  _renderContent = () => (
    <View style={{flexDirection: 'row', flex: 1}}>
      <IconHeaderButton icon={MIcon} name='arrow-back' action={this.props._onNavigateBack}/>
      <TouchableWithoutFeedback style={{flex: 1}} onPress={() => this._onSwitch(!this.props.settings[OPTION_PRESS_EXCLUDE])}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', opacity: this.state.popup ? 1 : 0.3}}>
          <Text style={{fontSize: 16, fontWeight: 'bold', opacity: this.state.exclude ? 0.3 : 1}}>
            {i18n.tr('option').tr('select')}
          </Text>
          <Selector value={this.state.exclude}/>
          <Text style={{fontSize: 16, fontWeight: 'bold', opacity: this.state.exclude ? 1 : 0.3}}>
            {i18n.tr('option').tr('exclude')}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <HeaderButton />
    </View>
  );
});

class ItemImage extends Component {
  static item = (row, value) => 'item' + (row + 1) + (value + 1);
  static hint = (row, value) => 'hint' + (row + 1) + (value + 1);

  render() {
    const src = this.props.type ? this.props.type :
      (this.props.hint ?
          ItemImage.hint(this.props.row, this.props.value) :
          ItemImage.item(this.props.row, this.props.value)
      );
    return (
      <Image style={this.props.style} source={{uri: src}}/>
    );
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
    <View key={'hint_' + i + '_' + j + '_' + k}
          style={[this.styles.itemBox, {opacity: this.props.game.possible(i, j, k) ? 1 : 0}]}>
      <ItemImage style={this.styles.item} row={i} value={k} hint={true}/>
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
        this.setState({popup: {i: i, j: j}});
        this.props.onPopup && this.props.onPopup(true);
      }
    };
  }

  _hidePopup = () => {
    this.setState({popup: null});
    this.props.onPopup && this.props.onPopup(false);
  };

  renderGroupItem = (i, j) => (
    <TouchableWithoutFeedback key={'group_' + i + '_' + j}
                              disabled={this.props.game.finished && !this.props.game.restoredActive}
                              onPress={this._openPopup(i, j)}>
      <View>
        {!this.props.game.isSet(i, j) ?
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
    if (this.props.game.restored) {
      // never be reached
      console.warn('never be reached (restored & solved)');
      return;
    }
    let t = this.props.game.time;
    this.props._statSolved({time: t, date: new Date()})
      .then((stats) => {
        if (stats.currentStack >= 150) {
          PlayGames.achievementUnlock(PLAYGAMES_ACHIEVEMENT_HARDCORE_SOLVER);
        }
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
        {text: i18n.button.tr('share'), onPress: this.props.onShare},
        {text: i18n.button.tr('new'), onPress: this.props._newGame},
        {text: i18n.button.tr('ok'), onPress: this.props._onNavigateBack},
      ],
      {},
    );
  };

  _onGameFailed = () => {
    GameActivity.stop();
    if (!this.props.game.restored) {
      PlayGames.achievementUnlock(PLAYGAMES_ACHIEVEMENT_MISTAKE_IS_NOT_A_PROBLEM);
      this.props._statFailed();
    }
    if (!this.props.game.hasHidden) {
      return;
    }
    Alert.alert(
      i18n.message.tr('fail_title'),
      i18n.message.tr('fail_text'),
      [
        {text: i18n.button.tr('continue'), onPress: this._restore},
        {text: i18n.button.tr('new'), onPress: this.props._newGame},
        {text: i18n.button.tr('ok'), onPress: this._restore},
      ],
      {},
    );
  };

  _restore = () => {
    this.props.game.restoreStopped();
    GameActivity.start();
    this.forceUpdate();
  };

  _selectItem = (i, j, k) => {
    if (!this.props.game.possible(i, j, k)) {
      console.debug('element must be disabled');
      return;
    }

    this.props.game.set(i, j, k);
    this._hidePopup();
    if (this.props.game.finished && !this.props.game.restoredActive) {
      this._onGameFinish();
    }
  };

  _excludeItem = (i, j, k) => {
    if (!this.props.game.possible(i, j, k)) {
      console.debug('element must be disabled');
      return;
    }

    if (__DEV__ && this.props.game.field.value(i, j) === k) {
      this.props.game._count = 0;
      this.props.game.stop();
      this._hidePopup();
      this._onGameFinish();
      return;
    }

    this.props.game.exclude(i, j, k);
    if (!this.props.settings[DONT_HIDE_POPUP] || this.props.game.isSet(i, j))
      this._hidePopup();
    else this.setState({});
    // this.forceUpdate();
    if (this.props.game.finished && !this.props.game.restoredActive) {
      // this._hidePopup();
      this._onGameFinish();
    }
    // if (this.props.game.isSet(i, j)) {
    //   this._hidePopup();
    // }
  };

  _onPressPopupItem = (i, j, k) =>
    () => this.props.settings[OPTION_PRESS_EXCLUDE] ? this._excludeItem(i, j, k) : this._selectItem(i, j, k);

  _onLongPressPopupItem = (i, j, k) =>
    () => this.props.settings[LONG_PRESS_SECOND_ACTION] ? 
      (this.props.settings[OPTION_PRESS_EXCLUDE] ? this._selectItem(i, j, k) : this._excludeItem(i, j, k))
      : {};

  renderPopupItem(i, j, k) {
    let {game} = this.props;
    const key = 'popup_item_' + i + '_' + j + '_' + k;

    let devStyle = null;
    if (__DEV__ && game.field.value(i, j) === k) {
      devStyle = {
        borderWidth: 2,
        borderColor: 'red',
      };
    }

    return (
      <View key={key} style={[this.styles.popupItemBox, {opacity: game.possible(i, j, k) ? 1 : 0}]}>
        <TouchableOpacity disabled={(game.finished && !game.restored) || !game.possible(i, j, k)}
                          pressRetentionOffset={{top: 0, left: 0, right: 0, bottom: 0}}
                          onPress={this._onPressPopupItem(i, j, k)}
                          onLongPress={this._onLongPressPopupItem(i, j, k)}>
          <ItemImage style={[this.styles.popupItem, devStyle]} row={i} value={k}/>
        </TouchableOpacity>
      </View>
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
      <View style={this.styles.popupGroupItemBox}>
        { this.renderPopupGroupItemsLine(this.state.popup.i, this.state.popup.j, 0) }
        { this.renderPopupGroupItemsLine(this.state.popup.i, this.state.popup.j, 1) }
      </View>
    </TouchableWithoutFeedback>
  );

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
  game: state.game.game,
  settings: state.settings,
}), dispatch => ({
  _statFailed: () => dispatch(statsGameFailed()),
  _statSolved: (time) => dispatch(statsGameSolved(time)),
  _toStats: () => {
    dispatch(navBack());
    setTimeout(() => {
      dispatch(navStats());
    }, 0);
  },
  _newGame: () => {
    dispatch(gameClear());
    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => dispatch(gameNew()).then(() => dispatch(statsGameTry())));
    }, 0);
  },
  _onNavigateBack: () => {
    dispatch(gamePause());
    dispatch(navBack());
  },
}), null, {forwardRef: true})(AGameField);

class AbstractRule extends Component {
  constructor(props) {
    super(props);
  }

  get styles() {
    return this.props.styles.styles;
  }

  // todo: extract styles
  get visibilityStyle() {
    return {opacity: this.props.visible ? 1 : 0.4};
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
  );
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
                      disabled={game.game.finished && !game.game.restoredActive}
                      toggle={toggle}
                      visible={rule.visible}
                      styles={this.props.styles}/>) :
      (<View/>);
  };
}

const Rule = connect(state => ({
  game: state.game,
}), dispatch => ({
  _onRuleToggle: (id) => dispatch(gameRuleToggle(id)),
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

    const hrules = rules.filter((r) => 'row' === r.rule.viewType);
    const vrules = rules.filter((r) => 'column' === r.rule.viewType);

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
    );
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
      time: 0,
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
      {this.props.game.game.finished ? this.renderGameStatus() : <Text />}
      <Text style={this.styles.timeStatusText}>{this._formatTime()}</Text>
    </View>
  );
}

const StatusInfo = connect(state => ({game: state.game}), dispatch => ({}))(AStatusInfo);

class AShareable extends Component {
  _timer;

  constructor(props) {
    super(props);
    this.state = {
      time: 0,
    };
  }

  componentWillMount() {
    this._timer = setInterval(() => this.setState({time: this.props.game.game.time}), 500);
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  _formatTime = () => moment.duration(this.state.time, 'seconds').humanize();

  height = 135 + 20; 

  render = () => (
  <View collapsable={false} style={{
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: -this.height,
    backgroundColor: '#eaeaee', // TODO: Expose to styles
  }}>
    <View style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: this.height,
    }}>
      {this.props.children}
    </View>
    <Image source={require('../../../images/get.png')} style={{
      position: 'absolute',
      left: 10,
      bottom: 10,
      width: this.height - 20,
      height: this.height - 20,
    }} />
    <View style={{
      position: 'absolute',
      left: this.height - 10,
      right: 0,
      height: this.height,
      bottom: 0,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Text style={{
        fontSize: 50,
        textAlign: 'center',
      }}>{this._formatTime()}</Text>
    </View>
  </View>
  );
}

const Sharaeble = connect(state => ({game: state.game}), dispatch => ({}),
  null, {forwardRef: true})(AShareable);

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      styles: null,
    };
    this._onPress = this._onPress.bind(this);
    this._onPopup = this._onPopup.bind(this);
    this._onShare = this._onShare.bind(this);
    this.game = React.createRef();
    this.shot = React.createRef();
  }

  componentWillMount() {
    GameActivity.start();
    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => this.setState({ready: true}));
    }, 0);
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

  _onPopup = (value) => {
    this.setState({popup: value});
    this.props.header && this.props.header.popupShown(value);
  }

  _onPress = (e) => {
    if (!this.state.popup)
      return false;
    
    this.game.current._hidePopup();
  }

  _onShare = () => {
    captureRef(this.shot, {
      format: 'jpg',
      result: 'base64',
    }).then(data => {
      Share.open({
        message: 'Check my Einstein Puzzle',
        url: 'data:image/jpeg;base64,' + data,
      })
    })
  }

  render() {
    let {ready, styles} = this.state;
    let {game} = this.props;
    if (!game.game || !ready) {
      return this.renderPlaceholder();
    }

    if (!styles) {
      setTimeout(() => {
        InteractionManager.runAfterInteractions(() => this._updateStyles());
      }, 0);
      return this.renderPlaceholder();
    }

    return (
      <Sharaeble ref={this.shot} >
        <TouchableWithoutFeedback onPress={e => this._onPress(e)}>
          <View onLayout={this._updateStyles} style={{
            ...this.styles.container,
            position: 'relative'
          }}>
            <StatusInfo styles={styles}/>
            <GameField styles={styles} ref={this.game} onPopup={this._onPopup} onShare={this._onShare}/>
            <Rules styles={styles}/>
          </View>
        </TouchableWithoutFeedback>
      </Sharaeble>
    );
  }
}

export default connect(state => ({game: state.game}), dispatch => ({}))(Game);

export {
  GameHeader,
};