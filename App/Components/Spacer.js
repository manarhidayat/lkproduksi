import React from 'react';
import {View} from 'react-native';

const Spacer = (props) => {
  const {height, width} = props;
  return <View style={{width, height}} />;
};

export default Spacer;
