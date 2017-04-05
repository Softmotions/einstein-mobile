'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Text, View} from 'react-native';

import MIcon from 'react-native-vector-icons/MaterialIcons';

import {HeaderButton, IconHeaderButton} from './buttons';
import {navBack} from '../../actions/navigation';

import {HEADER_SIZE} from './constants';

const mainColor = '#013397';

class Header extends Component {
  render = () => (
    <View style={{flexDirection: 'row', height: HEADER_SIZE, backgroundColor: 'white', elevation: 5}}>
      {this._renderContent()}
    </View>
  );

  _renderContent = () => (<View/>);
}

const DefaultHeader = connect(state => ({}), dispatch => ({
  _onNavigateBack: () => dispatch(navBack()),
}))(
  class extends Header {
    _renderContent = () => (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <IconHeaderButton icon={MIcon} name='arrow-back' action={this.props._onNavigateBack}/>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: mainColor, fontSize: 16, fontWeight: 'bold'}}>{this.props.title || ''}</Text>
        </View>
        <HeaderButton/>
      </View>
    );
  });

export {
  Header,
  DefaultHeader,
};