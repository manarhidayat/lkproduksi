/* eslint-disable react/no-unstable-nested-components */
import React, {PureComponent} from 'react';
import {TouchableOpacity, Text, View, Alert} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NAVIGATION_NAME} from './NavigationName';

import InventoryScreen from '../Containers/Inventory/';

import SessionActions, {SessionSelectors} from '../Redux/SessionRedux';
import {ApplicationStyles, Colors} from '../Themes';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationServices from './NavigationServices';
import DetailChecksheetScreen from '../Containers/Inventory/DetailChecksheetScreen';
import AddChecksheetScreen from '../Containers/Inventory/AddChecksheetScreen';
import AddListItemScreen from '../Containers/Inventory/AddListItemScreen';
import DetailListItemScreen from '../Containers/Inventory/DetailListItemScreen';
import AddSerialScreen from '../Containers/Inventory/AddSerialScreen';

const Stack = createNativeStackNavigator();

class MainNavigation extends PureComponent {
  render() {
    let initialRouteName = NAVIGATION_NAME.HOME.home;

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
          name={NAVIGATION_NAME.HOME.home}
          component={InventoryScreen}
          options={({route}) => {
            const onPressLogout = route?.params?.onPressLogout;
            return {
              title: 'Entity',
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
              // headerLeft: () => <View />,
            };
          }}
        />
        <Stack.Screen
          name={NAVIGATION_NAME.HOME.detailChecksheet}
          component={DetailChecksheetScreen}
          options={({route}) => {
            return {
              title: 'Detail Checksheet',
            };
          }}
        />
        <Stack.Screen
          name={NAVIGATION_NAME.HOME.addChecksheet}
          component={AddChecksheetScreen}
          options={({route}) => {
            const isEdit = route?.params?.isEdit;
            return {
              title: isEdit ? 'Edit Checksheet' : 'Add Checksheet',
            };
          }}
        />
        <Stack.Screen
          name={NAVIGATION_NAME.HOME.addListItem}
          component={AddListItemScreen}
          options={({route}) => {
            const isEdit = route?.params?.isEdit;
            return {
              title: isEdit ? 'Edit List Item' : 'Add List Item',
            };
          }}
        />
        <Stack.Screen
          name={NAVIGATION_NAME.HOME.detailListItem}
          component={DetailListItemScreen}
          options={({route}) => {
            return {
              title: 'Detail List Item',
            };
          }}
        />
        <Stack.Screen
          name={NAVIGATION_NAME.HOME.addSerial}
          component={AddSerialScreen}
          options={({route}) => {
            const isEdit = route?.params?.isEdit;
            return {
              title: isEdit ? 'Edit Lot' : 'Add Lot',
            };
          }}
        />
      </Stack.Navigator>
    );
  }
}

// export default MainNavigation;

const selector = createSelector([SessionSelectors.selectUser], (user) => {
  return {
    user,
  };
});

const mapStateToProps = (state) => {
  return selector(state);
};

const mapDispatchToProps = (dispatch) => ({
  setLogin: (params) => dispatch(SessionActions.setLogin(params)),
  removeSession: (params) => dispatch(SessionActions.removeSession(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainNavigation);
