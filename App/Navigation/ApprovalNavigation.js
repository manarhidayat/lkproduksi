/* eslint-disable react/no-unstable-nested-components */
import React, {PureComponent} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NAVIGATION_NAME} from './NavigationName';

import ApprovalScreen from '../Containers/Approval';
import DetailApprovalScreen from '../Containers/Approval/DetailApprovalScreen';

import {Colors} from '../Themes';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator();

class ApprovalNavigation extends PureComponent {
  render() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
          headerTitleStyle: {
            color: 'black',
          },
          headerTintColor: Colors.primary,
          headerShadowVisible: true,
          freezeOnBlur: true,
        }}>
        <Stack.Screen
          name={NAVIGATION_NAME.APPROVAL.index}
          component={ApprovalScreen}
          options={({route}) => {
            const onPressLogout = route?.params?.onPressLogout;

            return {
              title: ' ',
              headerRight: () => {
                return (
                  <TouchableOpacity onPress={onPressLogout}>
                    <Icon name="logout" size={20} color={'red'} />
                  </TouchableOpacity>
                );
              },
            };
          }}
        />
        <Stack.Screen
          name={NAVIGATION_NAME.APPROVAL.detail}
          component={DetailApprovalScreen}
          options={() => ({
            title: ' ',
          })}
        />
      </Stack.Navigator>
    );
  }
}

export default ApprovalNavigation;
