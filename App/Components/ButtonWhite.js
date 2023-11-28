import React, {PureComponent} from 'react';
import {TouchableOpacity} from 'react-native';

import styles from './Styles/ButtonWhiteStyles';

import Text from './Text';

export default class ButtonWhite extends PureComponent {
  render() {
    const {text, onPress, disabled, textStyle, style} = this.props;

    return (
      <TouchableOpacity
        style={[styles.button, style]}
        onPress={onPress}
        disabled={disabled}>
        <Text style={[styles.buttonText, textStyle]}>
          {text && text.toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  }
}
