/* eslint-disable react/no-unstable-nested-components */
import React, {PureComponent} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NAVIGATION_NAME} from './NavigationName';

import ChangePasswordScreen from '../Containers/Auth/ChangePasswordScreen';
import ApprovalScreen from '../Containers/Approval';
import DetailApprovalScreen from '../Containers/Approval/DetailApprovalScreen';

import {Colors} from '../Themes';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationServices from './NavigationServices';
import Spacer from '../Components/Spacer';

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
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      onPress={() =>
                        NavigationServices.push(
                          NAVIGATION_NAME.AUTH.changePassword
                        )
                      }>
                      <Icon name="lock-reset" size={20} color={'black'} />
                    </TouchableOpacity>
                    <Spacer width={20} />
                    <TouchableOpacity onPress={onPressLogout}>
                      <Icon name="logout" size={20} color={'red'} />
                    </TouchableOpacity>
                  </View>
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
        <Stack.Screen
          name={NAVIGATION_NAME.AUTH.changePassword}
          component={ChangePasswordScreen}
          options={({route}) => {
            return {
              title: 'Ganti Password',
            };
          }}
        />
      </Stack.Navigator>
    );
  }
}

export default ApprovalNavigation;
