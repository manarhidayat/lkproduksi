import React, { Component } from 'react'
import { Text } from 'react-native'
import { Colors, Fonts, } from '../Themes'

export default props =>
    <Text {...props} style={[{ fontFamily: Fonts.type.base, color: Colors.text}, props.style]} allowFontScaling={false}>{props.children}</Text>