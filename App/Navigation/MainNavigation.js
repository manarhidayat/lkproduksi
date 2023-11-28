/* eslint-disable react/no-unstable-nested-components */
import React, {PureComponent} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NAVIGATION_NAME} from './NavigationName';

import SelectBatchScreen from '../Containers/PIC/SelectBatchScreen';
import FormBatchScreen from '../Containers/PIC/FormBatchScreen';
import HomeScreen from '../Containers/PIC/HomeScreen';
import TimerScreen from '../Containers/PIC/TimerScreen';
import TimelineScreen from '../Containers/PIC/TimelineScreen';

import {SessionSelectors} from '../Redux/SessionRedux';
import {TYPE_ONBOARDING} from '../Lib/Constans';
import {ApplicationStyles, Colors} from '../Themes';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createNativeStackNavigator();

class MainNavigation extends PureComponent {
  render() {
    const {boarding} = this.props;
    let initialRouteName = NAVIGATION_NAME.PIC.selectBatch;
    if (boarding === TYPE_ONBOARDING.timer) {
      initialRouteName = NAVIGATION_NAME.PIC.timer;
    } else if (boarding === TYPE_ONBOARDING.timer) {
      initialRouteName = NAVIGATION_NAME.PIC.home;
    }

    initialRouteName = NAVIGATION_NAME.PIC.home;

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
            const onPressDone = route?.params?.onPressDone;

            return {
              title: 'Select Batch & Kitchen',
              headerRight: () => {
                return (
                  <TouchableOpacity onPress={onPressDone}>
                    <Text style={ApplicationStyles.actionTitle}>Next</Text>
                  </TouchableOpacity>
                );
              },
            };
          }}
        />
        <Stack.Screen
          name={NAVIGATION_NAME.PIC.formBatch}
          component={FormBatchScreen}
          options={() => ({
            title: ' ',
          })}
        />
        <Stack.Screen
          name={NAVIGATION_NAME.PIC.timer}
          component={TimerScreen}
          options={({route}) => {
            const title = route?.params?.item.name;
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
          options={() => ({
            title: 'Home',
          })}
        />
        <Stack.Screen
          name={NAVIGATION_NAME.PIC.timeline}
          component={TimelineScreen}
          options={() => ({
            title: ' ',
          })}
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

export default connect(mapStateToProps)(MainNavigation);
