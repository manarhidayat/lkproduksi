export const whitelist = ['session'];

const CUSTOM_PERSIST = {
  active: true,
  version: '1.0.0',
  whitelist,
  // select store name that required to update
  updatedStore: whitelist,
};

export default CUSTOM_PERSIST;
