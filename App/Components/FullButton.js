import React, {PureComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import styles from './Styles/FullButtonStyles';

import Text from './Text';
import {Colors} from '../Themes';

export default class FullButton extends PureComponent {
  render() {
    const {text, onPress, disabled, textStyle, style, icon} = this.props;

    return (
      <TouchableOpacity
        style={[styles.button, style]}
        onPress={onPress}
        disabled={disabled}>
        {icon && icon}
        <Text style={[styles.buttonText, textStyle]}>
          {text && text.toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  }
}
