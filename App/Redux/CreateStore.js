import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import Rehydration from '../Services/Rehydration';
import REDUX_PERSIST from '../Config/ReduxPersist';
import StoreHelper from '../Services/StoreHelper';
import Config from '../Config';

// creates the store
export default (rootReducer, rootSaga) => {
  /* ------------- Redux Configuration ------------- */

  const middleware = [];
  const enhancers = [];

  /* ------------- Saga Middleware ------------- */
  const sagaMonitor = Config.enableReactotron
    ? console.tron.createSagaMonitor()
    : null;

  const sagaMiddleware = createSagaMiddleware({sagaMonitor});
  middleware.push(sagaMiddleware);

  /* ------------- Assemble Middleware ------------- */

  enhancers.push(applyMiddleware(...middleware));

  if (Config.enableReactotron) {
    enhancers.push(console.tron.createEnhancer());
  }

  // if Reactotron is enabled (default for __DEV__), we'll create the store through Reactotron
  const createAppropriateStore = createStore;
  const store = createAppropriateStore(rootReducer, compose(...enhancers));

  // configure persistStore and check reducer version number
  if (REDUX_PERSIST.active) {
    Rehydration.updateReducers(store);
  }

  StoreHelper.putStoreInstance(store);

  // kick off root saga
  const sagasManager = sagaMiddleware.run(rootSaga);

  return {
    store,
    sagasManager,
    sagaMiddleware
  };
};
