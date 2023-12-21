import {keys} from 'ramda';
import MMKVStoragePersistHelper from '../Lib/MMKVStoragePersistHelper';

const prevStoreToCompare = {};
export function createCustomPersist(store, config) {
  // do subscription to save
  const {whitelist} = config;
  whitelist.forEach((key) => {
    prevStoreToCompare[key] = undefined;
  });

  store.subscribe(() => {
    whitelist.forEach((key) => {
      const value = store.getState()[key];
      if (prevStoreToCompare[key] !== value) {
        prevStoreToCompare[key] = value;
        if (prevStoreToCompare[key]) {
          const jsonDatas = prevStoreToCompare[key];
          const jsonKeys = keys(jsonDatas);
          for (let i = 0; i < jsonKeys.length; i++) {
            const jsonKey = jsonKeys[i];
            const jsonData = jsonDatas[jsonKey];
            MMKVStoragePersistHelper.setItem(
              jsonKey,
              JSON.stringify(jsonData),
              key
            );
          }
        }
      }
    });
  });
}
