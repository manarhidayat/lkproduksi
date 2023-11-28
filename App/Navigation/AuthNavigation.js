import React, {PureComponent} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NAVIGATION_NAME} from './NavigationName';
import {Colors, Fonts} from '../Themes';

import LoginScreen from '../Containers/Auth/LoginScreen';
import ChooseMachineScreen from '../Containers/Machine/ChooseMachineScreen';

const Stack = createNativeStackNavigator();

class AuthNavigation extends PureComponent {
  render() {
    return (
      <Stack.Navigator
        screenOptions={{
          // headerBackTitleVisible: false,
          // headerTitleStyle: {
          //   fontFamily: Fonts.fontType.medium,
          //   color: Colors.black
          // },
          freezeOnBlur: true
        }}>
        <Stack.Screen
          name={NAVIGATION_NAME.AUTH.login}
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={NAVIGATION_NAME.HOME.chooseMachine}
          component={ChooseMachineScreen}
          options={() => ({
            title: 'Choose Machine'
          })}
        />
      </Stack.Navigator>
    );
  }
}

export default AuthNavigation;