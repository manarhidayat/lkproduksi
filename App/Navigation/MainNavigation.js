/* eslint-disable react/no-unstable-nested-components */
import React, {PureComponent} from 'react';
import {TouchableOpacity, Text, View, Alert} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NAVIGATION_NAME} from './NavigationName';

import SelectBatchScreen from '../Containers/PIC/SelectBatchScreen';
import FormBatchScreen from '../Containers/PIC/FormBatchScreen';
import HomeScreen from '../Containers/PIC/HomeScreen';
import TimerScreen from '../Containers/PIC/TimerScreen';
import TimelineScreen from '../Containers/PIC/TimelineScreen';

import SessionActions, {SessionSelectors} from '../Redux/SessionRedux';
import OperationActions from '../Redux/OperationRedux';
import {TYPE_ONBOARDING} from '../Lib/Constans';
import {ApplicationStyles, Colors} from '../Themes';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator();

class MainNavigation extends PureComponent {
  render() {
    const {boarding} = this.props;
    let initialRouteName = NAVIGATION_NAME.PIC.selectBatch;
    // if (boarding === TYPE_ONBOARDING.timer) {
    //   initialRouteName = NAVIGATION_NAME.PIC.timer;
    // }
    if (boarding === TYPE_ONBOARDING.home) {
      initialRouteName = NAVIGATION_NAME.PIC.home;
    }
    if (boarding === TYPE_ONBOARDING.timeline) {
      initialRouteName = NAVIGATION_NAME.PIC.timeline;
    }

    // initialRouteName = NAVIGATION_NAME.PIC.home;

    return (
      <Stack.Navigator
        initialRouteName={initialRouteName}
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
          name={NAVIGATION_NAME.PIC.selectBatch}
          component={SelectBatchScreen}
          options={({route}) => {
            const onPressLogout = route?.params?.onPressLogout;

            return {
              title: 'Pilih Batch & Kitchen',
              headerRight: () => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'Peringatan',
                        'Apakan Anda akan keluar aplikasi?',
                        [
                          {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                          },
                          {
                            text: 'OK',
                            onPress: () => {
                              this.props.setLogin(false);
                              this.props.removeSession();
                              this.props.removeOperations();
                            },
                          },
                        ],
                        {cancelable: false}
                      );
                    }}>
                    <Icon name="logout" size={20} color={'red'} />
                  </TouchableOpacity>
                );
              },
            };
          }}
        />
        <Stack.Screen
          name={NAVIGATION_NAME.PIC.formBatch}
          component={FormBatchScreen}
          options={({route}) => {
            const batch = route?.params?.batch;

            return {
              title: batch ? batch.woi_remarks : '',
            };
          }}
        />
        <Stack.Screen
          name={NAVIGATION_NAME.PIC.timer}
          component={TimerScreen}
          options={({route}) => {
            const title = route?.params?.item
              ? route?.params?.item.wc_desc
              : '';
            const hideBackButton = route?.params?.hideBackButton;

            return {
              title: title,
              headerLeft: () => (hideBackButton ? <View /> : undefined),
            };
          }}
        />
        <Stack.Screen
          name={NAVIGATION_NAME.PIC.home}
          component={HomeScreen}
          options={({route}) => {
            const onPressLogout = route?.params?.onPressLogout;

            return {
              title: 'Proses',
              headerRight: () => {
                return (
                  <TouchableOpacity onPress={onPressLogout}>
                    <Icon name="logout" size={20} color={'red'} />
                  </TouchableOpacity>
                );
              },
              headerLeft: () => <View />,
            };
          }}
        />
        <Stack.Screen
          name={NAVIGATION_NAME.PIC.timeline}
          component={TimelineScreen}
          options={{headerShown: false}}
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
  removeOperations: (params) =>
    dispatch(OperationActions.removeOperations(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainNavigation);
