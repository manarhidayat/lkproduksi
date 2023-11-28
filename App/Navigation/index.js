import React, {PureComponent} from 'react';
import ReduxWrapper from './ReduxWrapper';
import App from '../Containers/App';
import {View} from 'react-native';
import {Colors} from '../Themes';
import LoadingOverlay from '../LoadingOverlay';

class AppNavigation extends PureComponent {
  render() {
    return (
      <View style={{flex: 1, backgroundColor: Colors.snow}}>
        <ReduxWrapper>
          <App />
        </ReduxWrapper>
        <LoadingOverlay />
      </View>
    );
  }
}

export default AppNavigation;
