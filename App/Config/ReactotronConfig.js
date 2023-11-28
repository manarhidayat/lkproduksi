import Config from '../Config/DebugConfig';
import {reactotronRedux as reduxPlugin} from 'reactotron-redux';
import Immutable from 'seamless-immutable';
import Reactotron from 'reactotron-react-native';
import sagaPlugin from 'reactotron-redux-saga';

if (Config.useReactotron) {
  // https://github.com/infinitered/reactotron for more options!
  Reactotron
    // .configure({name: 'DMS', host: '192.168.1.3'})
    .configure({name: 'DMS'})
    .useReactNative()
    .use(reduxPlugin({onRestore: Immutable}))
    .use(sagaPlugin())
    .connect();

  // Let's clear Reactotron on every time we load the app
  Reactotron.clear();

  // Totally hacky, but this allows you to not both importing reactotron-react-native
  // on every file.  This is just DEV mode, so no big deal.
  console.tron = Reactotron;
}