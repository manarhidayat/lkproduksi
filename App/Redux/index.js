/* eslint-disable global-require */
/* eslint-disable import/no-self-import */
import {resettableReducer} from 'reduxsauce';
import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import {InteractionManager} from 'react-native';
import rootSaga from '../Sagas/index';

import REDUX_PERSIST from '../Config/ReduxPersist';
import configureStore from './CreateStore';

import StartupActions from '../Redux/StartupRedux';

const resettable = resettableReducer('RESET');

/* ------------- Assemble The Reducers ------------- */
export const reducers = combineReducers({
  // nav: resettable(require('./NavigationRedux').reducer),

  session: resettable(require('./SessionRedux').reducer),
  auth: resettable(require('./AuthRedux').reducer),
  operation: resettable(require('./OperationRedux').reducer),
  approval: resettable(require('./ApprovalRedux').reducer),
  dashboard: resettable(require('./DashboardRedux').reducer),
});

export default () => {
  let finalReducers = reducers;
  if (REDUX_PERSIST.active) {
    finalReducers = persistReducer(REDUX_PERSIST.storeConfig, reducers);
  }

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

  // InteractionManager.runAfterInteractions(() => {
  //   store.dispatch(StartupActions.startup());
  // });

  return store;
};
