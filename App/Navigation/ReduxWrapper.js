import React from 'react';
import AppStoreProvider from '../Redux/Provider';
import {StatusBar} from 'react-native';
import {Colors} from '../Themes';

function ReduxWrapper({children}) {
  let component = children;

  const EnhancedComponent = () => (
    <AppStoreProvider>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.primary} />
      {component}
    </AppStoreProvider>
  );

  return <EnhancedComponent />;
}

export default ReduxWrapper;
