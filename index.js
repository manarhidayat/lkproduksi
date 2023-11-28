/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

import './App/Config/ReactotronConfig';

import AppNavigation from './App/Navigation';

AppRegistry.registerRunnable(appName, async initialProps => {
  try {
    AppRegistry.registerComponent(appName, () => AppNavigation);
    AppRegistry.runApplication(appName, initialProps);
  } catch (err) {
    console.log(err);
  }
});
