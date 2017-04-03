'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {View} from 'react-native';

import MIcon from 'react-native-vector-icons/MaterialIcons';

import {IconHeaderButton} from './buttons';
import {navBack} from '../../actions/navigation';

import {HEADER_SIZE} from './constants';

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
      <IconHeaderButton icon={MIcon} name='arrow-back' action={this.props._onNavigateBack}/>
    );
  });

export {
  Header,
  DefaultHeader,
};