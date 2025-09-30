import React, {PureComponent} from 'react';
import {InteractionManager, StatusBar} from 'react-native';
import NavigationServices from '../Navigation/NavigationServices';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {createSelector} from 'reselect';
import {SessionSelectors} from '../Redux/SessionRedux';
import {connect} from 'react-redux';
import {Colors} from '../Themes';
import MainNavigation from '../Navigation/MainNavigation';
import AuthNavigation from '../Navigation/AuthNavigation';
import DropDownAlertContainer from './DropDownAlertContainer';

class App extends PureComponent {
  navigation = React.createRef();

  render() {
    const {isLogin, user} = this.props;
    let rootNav = <MainNavigation />;
    if (!isLogin) {
      rootNav = <AuthNavigation />;
    }

    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.primary} />
        <NavigationContainer
          ref={(r) => {
            this.navigation = r;
            NavigationServices.setInstance(r);
          }}
          onStateChange={async () => {
            // const previousRouteName = routeNameRef.current;
            const currentRoute = NavigationServices.getCurrentRoute();
            console.tron.send('state.action.complete', {
              name: `NAVIGATE/${currentRoute.name}`,
              action: currentRoute,
            });
          }}>
          <GestureHandlerRootView style={{flex: 1}}>
            {rootNav}
          </GestureHandlerRootView>
          <DropDownAlertContainer />
        </NavigationContainer>
      </>
    );
  }
}

const selector = createSelector(
  [SessionSelectors.isLogin, SessionSelectors.selectUser],
  (isLogin, user) => {
    return {
      isLogin,
      user,
    };
  }
);

const mapStateToProps = (state) => {
  return selector(state);
};

export default connect(mapStateToProps)(App);
