'use strict';

import React, {Component} from 'react';
import {
  View,
  Image,
  Animated,
  Easing
} from 'react-native';

class Loader extends Component {
  constructor(props) {
    super(props);
    this._rotate = new Animated.Value(0);
  }

  rotation = () => {
    this._rotate.setValue(0);
    Animated.timing(this._rotate, {
      toValue: 360,
      duration: 1000,
      delay: 0,
      easing: Easing.linear
    }).start(() => this.rotation());
  };

  componentDidMount() {
    this.rotation();
  }

  render() {
    let ri = this._rotate.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg']
    });

    return (
      <View>
        <Animated.View style={{transform: [{rotate: ri}]}}>
          <Image source={require('../../../images/logo_plain.png')} style={{width: 36, height: 36}}/>
        </Animated.View>
      </View>
    )
  }
}

export {
  Loader
}