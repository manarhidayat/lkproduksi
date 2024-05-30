/* eslint-disable react/no-unstable-nested-components */
import React, {PureComponent} from 'react';
import {TouchableOpacity, View, Alert} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {NAVIGATION_NAME} from './NavigationName';

import ChangePasswordScreen from '../Containers/Auth/ChangePasswordScreen';
import HomeScreen from '../Containers/Home/HomeScreen';
import ReportScreen from '../Containers/Home/ReportScreen';
import ScanScreen from '../Containers/Home/ScanScreen';
import ProfileScreen from '../Containers/Home/ProfileScreen';
import ChooseSetupLoadingScreen from '../Containers/Home/ChooseSetupLoadingScreen';

import SessionActions, {SessionSelectors} from '../Redux/SessionRedux';
import {ApplicationStyles, Colors} from '../Themes';

import NavigationServices from './NavigationServices';
import Text from '../Components/Text';

const Stack = createNativeStackNavigator();

class MainNavigation extends PureComponent {
  render() {
    return (
      <Stack.Navigator
        initialRouteName={NAVIGATION_NAME.HOME.home}
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
          name={NAVIGATION_NAME.AUTH.changePassword}
          component={ChangePasswordScreen}
          options={({route}) => {
            return {
              title: 'Ganti Password',
            };
          }}
        />
        <Stack.Screen
          name={NAVIGATION_NAME.HOME.profile}
          component={ProfileScreen}
          options={({route}) => {
            return {
              title: 'Profile',
            };
          }}
        />
        <Stack.Screen
          name={NAVIGATION_NAME.HOME.setupLoading}
          component={ChooseSetupLoadingScreen}
          options={({route}) => {
            return {
              title: 'Pilih No. Penetepan',
            };
          }}
        />
        <Stack.Screen
          name={NAVIGATION_NAME.HOME.home}
          component={HomeScreen}
          options={({route}) => {
            return {
              title: 'Home',
              headerRight: () => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      NavigationServices.push(NAVIGATION_NAME.HOME.profile)
                    }>
                    <Icon name="account" size={20} color={'black'} />
                  </TouchableOpacity>
                );
              },
              headerLeft: () => <View />,
            };
          }}
        />
        <Stack.Screen
          name={NAVIGATION_NAME.HOME.reports}
          component={ReportScreen}
          options={({route}) => {
            return {
              title: 'Reports',
            };
          }}
        />
        <Stack.Screen
          name={NAVIGATION_NAME.HOME.scan}
          component={ScanScreen}
          options={({route}) => {
            const onPressCart = route?.params?.onPressCart;
            const count = route?.params?.count;
            const type = route?.params?.type;
            let title = 'Preparing';
            if (type === 'L') {
              title = 'Loading';
            }
            if (type === 'D') {
              title = 'Dissambling';
            }
            return {
              title: 'Scan ' + title,
              headerRight: () => {
                return (
                  <TouchableOpacity onPress={() => onPressCart()}>
                    <Icon name="cart" size={20} color={'black'} />
                    {count > 0 && (
                      <View
                        style={{
                          padding: 4,
                          backgroundColor: 'red',
                          borderRadius: 6,
                          justifyContent: 'center',
                          alignItems: 'center',
                          position: 'absolute',
                          right: -10,
                          bottom: -10,
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 9,
                            fontWeight: 'bold',
                          }}>
                          {count}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              },
            };
          }}
        />
      </Stack.Navigator>
    );
  }
}

// export default MainNavigation;

const selector = createSelector(
  [SessionSelectors.selectBoarding],
  (boarding) => {
    return {
      boarding,
    };
  }
);

const mapStateToProps = (state) => {
  return selector(state);
};

const mapDispatchToProps = (dispatch) => ({
  setLogin: (params) => dispatch(SessionActions.setLogin(params)),
  removeSession: (params) => dispatch(SessionActions.removeSession(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainNavigation);
