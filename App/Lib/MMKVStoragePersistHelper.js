import {MMKV} from 'react-native-mmkv';
import {Platform} from 'react-native';
import {LibraryDirectoryPath, DocumentDirectoryPath} from 'react-native-fs';
import {keys} from 'ramda';
import CUSTOM_PERSIST from '../Config/CustomPersistConfig';

class MMKVStoragePersistHelper {
  storages = {};

  mainInstance = undefined;

  constructor() {
    this.init(this.mainInstance);
    CUSTOM_PERSIST.whitelist.forEach((storename) => {
      this.init(storename);
    });
  }

  init(name) {
    let instance_name = `${name}`;
    const newInstance = new MMKV({
      id: instance_name,
      path: `${Platform.select({
        ios: LibraryDirectoryPath,
        android: DocumentDirectoryPath
      })}/storage`,
    });
    this.storages = {
      ...this.storages,
      [instance_name]: newInstance
    };
  }

  setItem(key, value, instanceName) {
    if (key === undefined || value === undefined) {
      return;
    }

    const instance = `${instanceName || this.mainInstance}`;
    this.storages[instance].set(key, value);
  }

  removeKey(key, instanceName) {
    const instance = `${instanceName || this.mainInstance}`;
    this.storages[instance].delete(key);
  }

  clearAll() {
    const keysInstance = keys(this.storages);
    for (let i = 0; i < keysInstance.length; i++) {
      const key = keysInstance[i];
      this.storages[key].clearAll();
    }

    this.setItem('reducerVersion', CUSTOM_PERSIST.version);
  }

  getString(key, instanceName) {
    const instance = `${instanceName || this.mainInstance}`;
    return this.storages[instance].getString(key);
  }

  getNumber(key, instanceName) {
    const instance = `${instanceName || this.mainInstance}`;
    return this.storages[instance].getNumber(key);
  }

  getBool(key, instanceName) {
    const instance = `${instanceName || this.mainInstance}`;
    return this.storages[instance].getBoolean(key);
  }

  getAllKeys(instanceName) {
    const instance = `${instanceName || this.mainInstance}`;
    return this.storages[instance].getAllKeys();
  }
}

export default new MMKVStoragePersistHelper();
