class StoreHelper {
  storeInstance;

  constructor() {
    this.putStoreInstance = this.putStoreInstance.bind(this);
    this.dispatch = this.dispatch.bind(this);
  }

  putStoreInstance(instance) {
    this.storeInstance = instance;
  }

  dispatch(action) {
    if (this.storeInstance) {
      this.storeInstance.dispatch(action);
    }
  }

  getState() {
    if (this.storeInstance) {
      return this.storeInstance.getState();
    }
    return null;
  }
}

export default new StoreHelper();
