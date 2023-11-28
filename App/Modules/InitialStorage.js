import CUSTOM_PERSIST from '../Config/CustomPersistConfig';
import MMKVStoragePersistHelper from '../Lib/MMKVStoragePersistHelper';

class InitialStorage {
  restored = new Map();

  isLogin = false;

  authToken = undefined;

  constructor() {
    this.init = this.init.bind(this);
    this.getRestoreData = this.getRestoreData.bind(this);
  }

  async init() {
    return new Promise(async (resolve, reject) => {
      try {
        const value = MMKVStoragePersistHelper.getString('reducerVersion');
        if (typeof value === 'string') {
          this.isLogin = MMKVStoragePersistHelper.getBool('isLogin');
          this.authToken = MMKVStoragePersistHelper.getString('authToken');


          for (let i = 0; i < CUSTOM_PERSIST.whitelist.length; i++) {
            let instance = CUSTOM_PERSIST.whitelist[i];
            const mmkvKeys2 = MMKVStoragePersistHelper.getAllKeys(instance);
            let instanceData = {};
            for (let j = 0; j < mmkvKeys2.length; j++) {
              const mmkvKey2 = mmkvKeys2[j];
              const mmkvValue2 = MMKVStoragePersistHelper.getString(
                mmkvKey2,
                instance
              );
              instanceData[mmkvKey2] = JSON.parse(mmkvValue2);
            }
            this.restored = this.restored.set(instance, instanceData);
          }

          if (
            typeof value !== 'undefined' &&
            value !== CUSTOM_PERSIST.version
          ) {
            this.restored = this.restored.setIn(
              ['session', 'isUpdating'],
              true
            );
          } else {
            this.restored = this.restored.setIn(
              ['session', 'isUpdating'],
              false
            );
          }

          resolve();
          return;
        }

        MMKVStoragePersistHelper.clearAll();
        resolve();
      } catch (error) {
        console.tron.error({ERROR_GET_TEMP_STORAGE: error});
        reject(error);
      }
    });
  }

  getRestoreData() {
    return this.restored;
  }

  getIsLogin() {
    return this.isLogin;
  }

  getAuthToken() {
    return this.authToken;
  }

  getValue(key) {
    return this.restored.get(key);
  }
}

export default new InitialStorage();
