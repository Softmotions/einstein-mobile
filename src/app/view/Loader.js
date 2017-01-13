'use strict';

import React, {Component} from 'react';
import {
  View,
  Image
} from 'react-native';

class Loader extends Component {
  constructor(props) {
    super(props);
  }

  render = () => (
    <View>
      <Image source={require('../../../images/loader.gif')} style={{width: 36, height: 36}}/>
    </View>
  )
}

export {
  Loader
}