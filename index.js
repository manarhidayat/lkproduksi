/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

import './App/Config/ReactotronConfig';
import InitialStorage from './App/Modules/InitialStorage';

import AppNavigation from './App/Navigation';

AppRegistry.registerRunnable(appName, async (initialProps) => {
  try {
    await InitialStorage.init();
    AppRegistry.registerComponent(appName, () => AppNavigation);
    AppRegistry.runApplication(appName, initialProps);
  } catch (err) {
    console.log(err);
  }
});
