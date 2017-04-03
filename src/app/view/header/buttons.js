'use strict';

import React, {Component} from 'react';

import {Image, TouchableNativeFeedback, View} from 'react-native';

import {HEADER_SIZE} from './constants';

// todo:
const IMAGE_SIZE = HEADER_SIZE - 4;
const ICON_SIZE = Math.floor(HEADER_SIZE / 1.5);

class HeaderButton extends Component {
  render = () => (
    <TouchableNativeFeedback disabled={!this._handlePress} onPress={this._handlePress}>
      <View style={{height: HEADER_SIZE, width: HEADER_SIZE, alignItems: 'center', justifyContent: 'center'}}>
        {this._renderIcon()}
      </View>
    </TouchableNativeFeedback>
  );

  _handlePress = null;
  _renderIcon = () => (<View />);
}

class IconHeaderButton extends HeaderButton {
  constructor(props) {
    super(props);
    this._handlePress = this.props.action;
  }

  _renderIcon = () => (
    <this.props.icon name={this.props.name} size={ICON_SIZE}/>
  );
}

class ImageHeaderButton extends HeaderButton {
  constructor(props) {
    super(props);
    this._handlePress = this.props.action;
  }

  _renderIcon = () => (
    <Image style={{height: IMAGE_SIZE, width: IMAGE_SIZE,}} source={{uri: this.props.image}}/>
  );
}

export {
  HeaderButton,
  IconHeaderButton,
  ImageHeaderButton,
};