import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  getEntityRequest: ['data'],
  getEntitySuccess: ['payload'],
  getEntityFailure: ['error'],

  getBranchRequest: ['data'],
  getBranchSuccess: ['payload'],
  getBranchFailure: ['error'],

  getCustomerRequest: ['data'],
  getCustomerSuccess: ['payload'],
  getCustomerFailure: ['error'],

  createCheckseetRequest: ['data'],
  createCheckseetSuccess: ['payload'],
  createCheckseetFailure: ['error'],

  updateCheckseetRequest: ['data'],
  updateCheckseetSuccess: ['payload'],
  updateCheckseetFailure: ['error'],

  deleteCheckseetRequest: ['data', 'callback'],
  deleteCheckseetSuccess: ['payload'],
  deleteCheckseetFailure: ['error'],

  getBarangRequest: ['data'],
  getBarangSuccess: ['payload'],
  getBarangFailure: ['error'],

  getLocationRequest: ['data'],
  getLocationSuccess: ['payload'],
  getLocationFailure: ['error'],

  getChecksheetRequest: ['data'],
  getChecksheetSuccess: ['payload'],
  getChecksheetFailure: ['error'],

  getChecksheetDetailRequest: ['data'],
  getChecksheetDetailSuccess: ['payload'],
  getChecksheetDetailFailure: ['error'],

  createChecksheetDetailRequest: ['data'],
  createChecksheetDetailSuccess: ['payload'],
  createChecksheetDetailFailure: ['error'],

  updateChecksheetDetailRequest: ['data'],
  updateChecksheetDetailSuccess: ['payload'],
  updateChecksheetDetailFailure: ['error'],

  deleteChecksheetDetailRequest: ['data', 'callback'],
  deleteChecksheetDetailSuccess: ['payload'],
  deleteChecksheetDetailFailure: ['error'],

  createChecksheetSerialRequest: ['data', 'callback'],
  createChecksheetSerialSuccess: ['payload'],
  createChecksheetSerialFailure: ['error'],

  updateChecksheetSerialRequest: ['data'],
  updateChecksheetSerialSuccess: ['payload'],
  updateChecksheetSerialFailure: ['error'],

  deleteChecksheetSerialRequest: ['data', 'callback'],
  deleteChecksheetSerialSuccess: ['payload'],
  deleteChecksheetSerialFailure: ['error'],
});

export const InventoryTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  entity: {fetching: false, data: null, error: null, payload: []},
  branch: {fetching: false, data: null, error: null, payload: []},
  customer: {fetching: false, data: null, error: null, payload: []},
  createCheckseet: {fetching: false, data: null, error: null, payload: null},
  updateCheckseet: {fetching: false, data: null, error: null, payload: null},
  deleteCheckseet: {fetching: false, data: null, error: null, payload: null},
  getBarang: {fetching: false, data: null, error: null, payload: []},
  getLocation: {fetching: false, data: null, error: null, payload: []},
  getChecksheet: {fetching: false, data: null, error: null, payload: []},
  getChecksheetDetail: {
    fetching: false,
    data: null,
    error: null,
    payload: null,
  },
  createChecksheetDetail: {
    fetching: false,
    data: null,
    error: null,
    payload: null,
  },
  updateChecksheetDetail: {
    fetching: false,
    data: null,
    error: null,
    payload: null,
  },
  deleteChecksheetDetail: {
    fetching: false,
    data: null,
    error: null,
    payload: null,
  },
  createChecksheetSerial: {
    fetching: false,
    data: null,
    error: null,
    payload: null,
  },
  updateChecksheetSerial: {
    fetching: false,
    data: null,
    error: null,
    payload: {details: []},
  },
  deleteChecksheetSerial: {
    fetching: false,
    data: null,
    error: null,
    payload: {details: []},
  },
});

export const InventorySelectors = {
  getEntity: (state) => state.inventory.entity.payload,
  getBranch: (state) => state.inventory.branch.payload,
  getCustomer: (state) => state.inventory.customer.payload,
  getBarang: (state) => state.inventory.getBarang.payload,
  getLocation: (state) => state.inventory.getLocation.payload,
  getChecksheet: (state) => state.inventory.getChecksheet.payload,
  getChecksheetFetching: (state) => state.inventory.getChecksheet.fetching,
  getChecksheetDetail: (state) => state.inventory.getChecksheetDetail.payload,
  getChecksheetDetailFetching: (state) =>
    state.inventory.getChecksheetDetail.fetching,
};

/* ------------- Reducers ------------- */

export const getEntityRequest = (state, {data}) =>
  state.merge({...state, entity: {fetching: true, data}});
export const getEntitySuccess = (state, {payload}) =>
  state.merge({
    ...state,
    entity: {
      ...state.entity,
      fetching: false,
      error: null,
      payload,
    },
  });
export const getEntityFailure = (state, {error}) =>
  state.merge({...state, branch: {fetching: false, error}});

export const getBranchRequest = (state, {data}) =>
  state.merge({...state, branch: {fetching: true, data}});
export const getBranchSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    branch: {
      ...state.branch,
      fetching: false,
      error: null,
      payload,
    },
  });
export const getBranchFailure = (state, {error}) =>
  state.merge({...state, branch: {fetching: false, error}});

export const getCustomerRequest = (state, {data}) =>
  state.merge({...state, customer: {fetching: true, data}});
export const getCustomerSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    customer: {
      ...state.customer,
      fetching: false,
      error: null,
      payload,
    },
  });
export const getCustomerFailure = (state, {error}) =>
  state.merge({...state, customer: {fetching: false, error}});

export const createCheckseetRequest = (state, {data}) =>
  state.merge({...state, createCheckseet: {fetching: true, data}});
export const createCheckseetSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    createCheckseet: {
      ...state.createCheckseet,
      fetching: false,
      error: null,
      payload,
    },
  });
export const createCheckseetFailure = (state, {error}) =>
  state.merge({...state, createCheckseet: {fetching: false, error}});

export const updateCheckseetRequest = (state, {data}) =>
  state.merge({...state, updateCheckseet: {fetching: true, data}});
export const updateCheckseetSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    updateCheckseet: {
      ...state.updateCheckseet,
      fetching: false,
      error: null,
      payload,
    },
  });
export const updateCheckseetFailure = (state, {error}) =>
  state.merge({...state, updateCheckseet: {fetching: false, error}});

export const deleteCheckseetRequest = (state, {data}) =>
  state.merge({...state, deleteCheckseet: {fetching: true, data}});
export const deleteCheckseetSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    deleteCheckseet: {
      ...state.deleteCheckseet,
      fetching: false,
      error: null,
      payload,
    },
  });
export const deleteCheckseetFailure = (state, {error}) =>
  state.merge({...state, deleteCheckseet: {fetching: false, error}});

export const getBarangRequest = (state, {data}) =>
  state.merge({...state, getBarang: {fetching: true, data}});
export const getBarangSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    getBarang: {
      ...state.getBarang,
      fetching: false,
      error: null,
      payload,
    },
  });
export const getBarangFailure = (state, {error}) =>
  state.merge({...state, getBarang: {fetching: false, error}});

export const getLocationRequest = (state, {data}) =>
  state.merge({...state, getLocation: {fetching: true, data}});
export const getLocationSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    getLocation: {
      ...state.getLocation,
      fetching: false,
      error: null,
      payload,
    },
  });
export const getLocationFailure = (state, {error}) =>
  state.merge({...state, getLocation: {fetching: false, error}});

export const getChecksheetRequest = (state, {data}) =>
  state.merge({...state, getChecksheet: {fetching: true, data}});
export const getChecksheetSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    getChecksheet: {
      ...state.getChecksheet,
      fetching: false,
      error: null,
      payload,
    },
  });
export const getChecksheetFailure = (state, {error}) =>
  state.merge({...state, getChecksheet: {fetching: false, error}});

export const getChecksheetDetailRequest = (state, {data}) =>
  state.merge({
    ...state,
    getChecksheetDetail: {fetching: true, data, payload: {details: []}},
  });
export const getChecksheetDetailSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    getChecksheetDetail: {
      ...state.getChecksheetDetail,
      fetching: false,
      error: null,
      payload,
    },
  });
export const getChecksheetDetailFailure = (state, {error}) =>
  state.merge({
    ...state,
    getChecksheetDetail: {fetching: false, error, payload: {details: []}},
  });

export const createChecksheetDetailRequest = (state, {data}) =>
  state.merge({...state, createChecksheetDetail: {fetching: true, data}});
export const createChecksheetDetailSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    createChecksheetDetail: {
      ...state.createChecksheetDetail,
      fetching: false,
      error: null,
      payload,
    },
  });
export const createChecksheetDetailFailure = (state, {error}) =>
  state.merge({...state, createChecksheetDetail: {fetching: false, error}});

export const updateChecksheetDetailRequest = (state, {data}) =>
  state.merge({...state, updateChecksheetDetail: {fetching: true, data}});
export const updateChecksheetDetailSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    updateChecksheetDetail: {
      ...state.updateChecksheetDetail,
      fetching: false,
      error: null,
      payload,
    },
  });
export const updateChecksheetDetailFailure = (state, {error}) =>
  state.merge({...state, updateChecksheetDetail: {fetching: false, error}});

export const deleteChecksheetDetailRequest = (state, {data}) =>
  state.merge({...state, deleteChecksheetDetail: {fetching: true, data}});
export const deleteChecksheetDetailSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    deleteChecksheetDetail: {
      ...state.deleteChecksheetDetail,
      fetching: false,
      error: null,
      payload,
    },
  });
export const deleteChecksheetDetailFailure = (state, {error}) =>
  state.merge({...state, deleteChecksheetDetail: {fetching: false, error}});

export const createChecksheetSerialRequest = (state, {data}) =>
  state.merge({...state, createChecksheetSerial: {fetching: true, data}});
export const createChecksheetSerialSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    createChecksheetSerial: {
      ...state.createChecksheetSerial,
      fetching: false,
      error: null,
      payload,
    },
  });
export const createChecksheetSerialFailure = (state, {error}) =>
  state.merge({...state, createChecksheetSerial: {fetching: false, error}});

export const updateChecksheetSerialRequest = (state, {data}) =>
  state.merge({...state, updateChecksheetSerial: {fetching: true, data}});
export const updateChecksheetSerialSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    updateChecksheetSerial: {
      ...state.updateChecksheetSerial,
      fetching: false,
      error: null,
      payload,
    },
  });
export const updateChecksheetSerialFailure = (state, {error}) =>
  state.merge({...state, updateChecksheetSerial: {fetching: false, error}});

export const deleteChecksheetSerialRequest = (state, {data}) =>
  state.merge({...state, deleteChecksheetSerial: {fetching: true, data}});
export const deleteChecksheetSerialSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    deleteChecksheetSerial: {
      ...state.deleteChecksheetSerial,
      fetching: false,
      error: null,
      payload,
    },
  });
export const deleteChecksheetSerialFailure = (state, {error}) =>
  state.merge({...state, deleteChecksheetSerial: {fetching: false, error}});

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_ENTITY_REQUEST]: getEntityRequest,
  [Types.GET_ENTITY_SUCCESS]: getEntitySuccess,
  [Types.GET_ENTITY_FAILURE]: getEntityFailure,

  [Types.GET_BRANCH_REQUEST]: getBranchRequest,
  [Types.GET_BRANCH_SUCCESS]: getBranchSuccess,
  [Types.GET_BRANCH_FAILURE]: getBranchFailure,

  [Types.GET_CUSTOMER_REQUEST]: getCustomerRequest,
  [Types.GET_CUSTOMER_SUCCESS]: getCustomerSuccess,
  [Types.GET_CUSTOMER_FAILURE]: getCustomerFailure,

  [Types.CREATE_CHECKSEET_REQUEST]: createCheckseetRequest,
  [Types.CREATE_CHECKSEET_SUCCESS]: createCheckseetSuccess,
  [Types.CREATE_CHECKSEET_FAILURE]: createCheckseetFailure,

  [Types.UPDATE_CHECKSEET_REQUEST]: updateCheckseetRequest,
  [Types.UPDATE_CHECKSEET_SUCCESS]: updateCheckseetSuccess,
  [Types.UPDATE_CHECKSEET_FAILURE]: updateCheckseetFailure,

  [Types.DELETE_CHECKSEET_REQUEST]: deleteCheckseetRequest,
  [Types.DELETE_CHECKSEET_SUCCESS]: deleteCheckseetSuccess,
  [Types.DELETE_CHECKSEET_FAILURE]: deleteCheckseetFailure,

  [Types.GET_BARANG_REQUEST]: getBarangRequest,
  [Types.GET_BARANG_SUCCESS]: getBarangSuccess,
  [Types.GET_BARANG_FAILURE]: getBarangFailure,

  [Types.GET_LOCATION_REQUEST]: getLocationRequest,
  [Types.GET_LOCATION_SUCCESS]: getLocationSuccess,
  [Types.GET_LOCATION_FAILURE]: getLocationFailure,

  [Types.GET_CHECKSHEET_REQUEST]: getChecksheetRequest,
  [Types.GET_CHECKSHEET_SUCCESS]: getChecksheetSuccess,
  [Types.GET_CHECKSHEET_FAILURE]: getChecksheetFailure,

  [Types.GET_CHECKSHEET_DETAIL_REQUEST]: getChecksheetDetailRequest,
  [Types.GET_CHECKSHEET_DETAIL_SUCCESS]: getChecksheetDetailSuccess,
  [Types.GET_CHECKSHEET_DETAIL_FAILURE]: getChecksheetDetailFailure,

  [Types.CREATE_CHECKSHEET_DETAIL_REQUEST]: createChecksheetDetailRequest,
  [Types.CREATE_CHECKSHEET_DETAIL_SUCCESS]: createChecksheetDetailSuccess,
  [Types.CREATE_CHECKSHEET_DETAIL_FAILURE]: createChecksheetDetailFailure,

  [Types.UPDATE_CHECKSHEET_DETAIL_REQUEST]: updateChecksheetDetailRequest,
  [Types.UPDATE_CHECKSHEET_DETAIL_SUCCESS]: updateChecksheetDetailSuccess,
  [Types.UPDATE_CHECKSHEET_DETAIL_FAILURE]: updateChecksheetDetailFailure,

  [Types.DELETE_CHECKSHEET_DETAIL_REQUEST]: deleteChecksheetDetailRequest,
  [Types.DELETE_CHECKSHEET_DETAIL_SUCCESS]: deleteChecksheetDetailSuccess,
  [Types.DELETE_CHECKSHEET_DETAIL_FAILURE]: deleteChecksheetDetailFailure,

  [Types.CREATE_CHECKSHEET_SERIAL_REQUEST]: createChecksheetSerialRequest,
  [Types.CREATE_CHECKSHEET_SERIAL_SUCCESS]: createChecksheetSerialSuccess,
  [Types.CREATE_CHECKSHEET_SERIAL_FAILURE]: createChecksheetSerialFailure,

  [Types.UPDATE_CHECKSHEET_SERIAL_REQUEST]: updateChecksheetSerialRequest,
  [Types.UPDATE_CHECKSHEET_SERIAL_SUCCESS]: updateChecksheetSerialSuccess,
  [Types.UPDATE_CHECKSHEET_SERIAL_FAILURE]: updateChecksheetSerialFailure,

  [Types.DELETE_CHECKSHEET_SERIAL_REQUEST]: deleteChecksheetSerialRequest,
  [Types.DELETE_CHECKSHEET_SERIAL_SUCCESS]: deleteChecksheetSerialSuccess,
  [Types.DELETE_CHECKSHEET_SERIAL_FAILURE]: deleteChecksheetSerialFailure,
});
