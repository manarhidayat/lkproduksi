import {resettableReducer} from 'reduxsauce';
import rootSaga from '../Sagas/index';
import {combineReducers} from 'redux';

import configureStore from './CreateStore';
import StartupActions from '../Redux/StartupRedux';
import {InteractionManager} from 'react-native';

const resettable = resettableReducer('RESET');

export const reducers = combineReducers({
  session: resettable(require('./SessionRedux').reducer),
  auth: resettable(require('./AuthRedux').reducer),
  inventory: resettable(require('./InventoryRedux').reducer),
});

export default () => {
  let finalReducers = reducers;

  let {store, sagasManager, sagaMiddleware} = configureStore(
    finalReducers,
    rootSaga
  );

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./').reducers;
      store.replaceReducer(nextRootReducer);

      const newYieldedSagas = require('../Sagas').default;
      sagasManager.cancel();
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware(newYieldedSagas);
      });
    });
  }

  InteractionManager.runAfterInteractions(() => {
    store.dispatch(StartupActions.startup());
  });

  return store;
};
