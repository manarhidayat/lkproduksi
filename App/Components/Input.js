import React, {Component} from 'react';
import {View, TouchableOpacity, TextInput, Text} from 'react-native';

import {Colors, Fonts} from '../Themes';
import Icon from 'react-native-vector-icons/AntDesign';
import styles from './Styles/InputStyle';

import TextUtil from '../Lib/TextUtil';

export default class MyInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false
    };
  }

  render() {
    const {
      title,
      name,
      value,
      error,
      defaultValue,
      setFieldValue,
      setFieldTouched,
      secureTextEntry,
      keyboardType,
      autoCapitalize,
      maxLength,
      placeholder,
      returnKeyType,
      multiline,
      pointerEvents,
      editable,
      selectTextOnFocus,
      onPress,
      rightIcon,
      leftIcon,
      checking,
      style,
      moneyFormat,
      formatNpwp,
      containerStyle,
      placeholderTextColor,
    } = this.props;
    const showError = !!(error && error.length > 0);

    return (
      <View style={[containerStyle, {marginBottom: 10}]}>
        {title !== undefined ? (
          <Text style={[styles.label, {marginBottom: 5}]}>{title}</Text>
        ) : null}

        <View
          style={[
            styles.container,
            {borderColor: this.state.isFocused ? Colors.primary : Colors.greyLight},
          ]}>
          {leftIcon !== undefined ? (
            <View style={{marginLeft: 15}}>{leftIcon}</View>
          ) : null}
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={onPress}>
            <TextInput
              onFocus={() => this.setState({isFocused: true})}
              onBlur={() => this.setState({isFocused: false})}
              allowFontScaling={false}
              style={[styles.input, style, {color: 'black'}]}
              ref={name}
              defaultValue={defaultValue}
              selectTextOnFocus={selectTextOnFocus}
              editable={editable}
              pointerEvents={pointerEvents}
              value={value}
              multiline={multiline}
              maxLength={maxLength}
              returnKeyType={returnKeyType}
              placeholder={placeholder}
              placeholderTextColor={Colors.placeholder}
              autoCapitalize={autoCapitalize}
              keyboardType={keyboardType}
              secureTextEntry={secureTextEntry}
              onChangeText={(txt) => {
                let text = txt;
                if (text != null) {
                  if (moneyFormat) {
                    text = TextUtil.formatMoney(text);
                  }
                  if (formatNpwp) {
                    text = TextUtil.formatNpwp(text);
                  }
                  setFieldValue(name, text);
                }
                setFieldTouched(name, true);
              }}
            />
            <View style={{}}>
              {!showError && checking && value != undefined ? (
                <Icon name="checkcircle" size={20} color={Colors.primary} />
              ) : (
                rightIcon
              )}
            </View>
          </TouchableOpacity>
        </View>
        {showError ? (
          <View>
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : null}
      </View>
    );
  }
}
