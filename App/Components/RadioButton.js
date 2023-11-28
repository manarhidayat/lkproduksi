import React, {PureComponent} from 'react';
import {View, TouchableOpacity} from 'react-native';

import Icon from 'react-native-vector-icons/AntDesign';
import {Metrics, Fonts, Colors} from '../Themes/';
import Text from './Text';

export default class RadioButton extends PureComponent {
  render() {
    const {text, onPress, checked, textOnRight, style} = this.props;

    return (
      <TouchableOpacity style={style} onPress={onPress}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: textOnRight ? 'flex-start' : 'space-between',
            alignItems: 'center',
            marginTop: Metrics.baseMargin
          }}>
          {!textOnRight ? <Text style={{width: '90%'}}>{text}</Text> : null}

          {checked ? (
            <Icon name="checkcircle" size={19} color={Colors.primary} />
          ) : (
            <View
              style={{
                width: 20,
                height: 20,
                borderWidth: 1,
                borderColor: 'grey',
                borderRadius: 10
              }}
            />
          )}

          {textOnRight ? <Text style={{marginLeft: 10}}>{text}</Text> : null}
        </View>
      </TouchableOpacity>
    );
  }
}
