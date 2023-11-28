import MMKVStorage from 'react-native-mmkv-storage';

class MMKVStoragePersistHelper {
  constructor() {
    this.MMKV = new MMKVStorage.Loader().initialize(); // Returns an MMKV Instance
  }

  async setItem(key, value) {
    const res = await this.MMKV.setStringAsync(key, value);
    return res;
  }

  async getItem(key) {
    const res = await this.MMKV.getStringAsync(key);
    return res;
  }

  async removeItem(key, callback) {
    try {
      const res = await this.MMKV.removeItem(key);
    } catch (error) {
      if (callback) {
        callback(error);
      }
    }
  }
}

export default new MMKVStoragePersistHelper();
