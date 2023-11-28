import {persistStore} from 'redux-persist';
import REDUX_PERSIST from '../Config/ReduxPersist';
import MMKVStoragePersistHelper from '../Lib/MMKVStoragePersistHelper';
import StartupActions from '../Redux/StartupRedux';

const updateReducers = async (store) => {
  const {reducerVersion} = REDUX_PERSIST;
  const startup = () => store.dispatch(StartupActions.startup());
  MMKVStoragePersistHelper.getItem('reducerVersion')
    .then((localVersion) => {
      console.log({localVersion, reducerVersion});
      if (localVersion !== reducerVersion) {
        console.log('PERSIST VERSION CHANGES');
        // Purge store
        persistStore(store, null, startup).purge();
        MMKVStoragePersistHelper.setItem('reducerVersion', reducerVersion);
      } else {
        persistStore(store, null, startup);
      }
    })
    .catch(() => {
      persistStore(store, null, startup);
      MMKVStoragePersistHelper.setItem('reducerVersion', reducerVersion);
    });
};

export default {updateReducers};
