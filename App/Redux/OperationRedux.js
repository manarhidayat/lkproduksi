import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  addPreparing: ['data'],
  editPreparing: ['data'],
  deletePreparing: ['data'],
  addLoading: ['data'],
  editLoading: ['data'],
  deleteLoading: ['data'],
  removeAllLoading: ['data'],
  addDissambling: ['data'],
  editDissambling: ['data'],
  deleteDissambling: ['data'],

  postOperationRequest: ['data', 'callback'],
  postOperationSuccess: ['payload'],
  postOperationFailure: ['error'],

  postLoadingRequest: ['data', 'callback'],
  postLoadingSuccess: ['payload'],
  postLoadingFailure: ['error'],

  getLocationsRequest: ['data', 'callback'],
  getLocationsSuccess: ['payload'],
  getLocationsFailure: ['error'],

  getReportsRequest: ['data', 'callback'],
  getReportsSuccess: ['payload'],
  getReportsFailure: ['error'],

  getSetupLoadingRequest: ['data', 'callback'],
  getSetupLoadingSuccess: ['payload'],
  getSetupLoadingFailure: ['error'],

  searchQRRequest: ['data', 'callback'],
  searchQRSuccess: ['payload'],
  searchQRFailure: ['error'],
});

export const OperationTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  preparings: [],
  loadings: [],
  dissamblings: [],

  postOperation: {fetching: false, data: null, error: null, payload: null},
  postLoading: {fetching: false, data: null, error: null, payload: null},

  getReports: {fetching: false, data: null, error: null, payload: []},
  getLocations: {fetching: false, data: null, error: null, payload: []},
  getSetupLoading: {fetching: false, data: null, error: null, payload: []},
  searchQR: {fetching: false, data: null, error: null, payload: []},
});

export const OperationSelectors = {
  getPreparing: (state) => state.operation.preparings,
  getLoading: (state) => state.operation.loadings,
  getDissambling: (state) => state.operation.dissamblings,

  getLocations: (state) =>
    state.operation.getLocations ? state.operation.getLocations.payload : [],
  getReports: (state) =>
    state.operation.getReports ? state.operation.getReports.payload : [],
  getSetupLoading: (state) =>
    state.operation.getSetupLoading
      ? state.operation.getSetupLoading.payload
      : [],
  getSearchs: (state) =>
    state.operation.searchQR ? state.operation.searchQR.payload : [],
};

/* ------------- Reducers ------------- */

export const addPreparing = (state, {data}) => {
  return {...state, preparings: [...state.preparings, data]};
};

export const editPreparing = (state, {data}) => {
  let preparings = [...state.preparings];
  const index = preparings.findIndex(
    (item) => item.rifd_qr_code === data.rifd_qr_code
  );
  preparings[index] = data;

  return {...state, preparings};
};
export const deletePreparing = (state, {data}) => {
  let preparings = state.preparings.filter(
    (item) => item.rifd_qr_code !== data
  );

  return {...state, preparings};
};

export const addLoading = (state, {data}) => {
  return {...state, loadings: [...state.loadings, data]};
};

export const editLoading = (state, {data}) => {
  let loadings = [...state.loadings];
  const index = loadings.findIndex(
    (item) => item.rifd_qr_code === data.rifd_qr_code
  );
  loadings[index] = data;

  return {...state, loadings};
};
export const deleteLoading = (state, {data}) => {
  let loadings = state.loadings.filter((item) => item.rifd_qr_code !== data);

  return {...state, loadings};
};
export const removeAllLoading = (state, {data}) => {
  return {...state, loadings: []};
};

export const addDissambling = (state, {data}) => {
  return {...state, dissamblings: [...state.dissamblings, data]};
};

export const editDissambling = (state, {data}) => {
  let dissamblings = [...state.dissamblings];
  const index = dissamblings.findIndex(
    (item) => item.rifd_qr_code === data.rifd_qr_code
  );
  dissamblings[index] = data;

  return {...state, dissamblings};
};
export const deleteDissambling = (state, {data}) => {
  let dissamblings = state.dissamblings.filter(
    (item) => item.rifd_qr_code !== data
  );

  return {...state, dissamblings};
};

export const postOperationRequest = (state, {data}) => {
  return {...state, postOperation: {fetching: true, data}};
};
export const postOperationSuccess = (state, {payload}) => {
  const type = state.postOperation.data.type;

  if (type === 'P') {
    return {
      ...state,
      preparings: [],
      postOperation: {fetching: false, error: null, payload},
    };
  }

  if (type === 'L') {
    return {
      ...state,
      loadings: [],
      postOperation: {fetching: false, error: null, payload},
    };
  }

  return {
    ...state,
    dissamblings: [],
    postOperation: {fetching: false, error: null, payload},
  };
};
export const postOperationFailure = (state, {error}) => {
  return {...state, postOperation: {fetching: false, error}};
};
export const postLoadingRequest = (state, {data}) => {
  return {...state, postLoading: {fetching: true, data}};
};
export const postLoadingSuccess = (state, {payload}) => {
  return {
    ...state,
    loadings: [],
    postLoading: {fetching: false, error: null, payload},
  };
};
export const postLoadingFailure = (state, {error}) => {
  return {...state, postLoading: {fetching: false, error}};
};

export const getLocationsRequest = (state, {data}) => {
  return {...state, getLocations: {fetching: true, data}};
};
export const getLocationsSuccess = (state, {payload}) => {
  return {
    ...state,
    getLocations: {fetching: false, error: null, payload},
  };
};
export const getLocationsFailure = (state, {error}) => {
  return {...state, getLocations: {fetching: false, error}};
};

export const getReportsRequest = (state, {data}) => {
  return {...state, getReports: {fetching: true, data}};
};
export const getReportsSuccess = (state, {payload}) => {
  return {
    ...state,
    getReports: {fetching: false, error: null, payload},
  };
};
export const getReportsFailure = (state, {error}) => {
  return {...state, getReports: {fetching: false, error}};
};

export const getSetupLoadingRequest = (state, {data}) => {
  return {...state, getSetupLoading: {fetching: true, data}};
};
export const getSetupLoadingSuccess = (state, {payload}) => {
  return {
    ...state,
    getSetupLoading: {fetching: false, error: null, payload},
  };
};
export const getSetupLoadingFailure = (state, {error}) => {
  return {...state, getSetupLoading: {fetching: false, error}};
};

export const searchQRRequest = (state, {data}) => {
  return {...state, searchQR: {fetching: true, data}};
};
export const searchQRSuccess = (state, {payload}) => {
  return {
    ...state,
    searchQR: {fetching: false, error: null, payload},
  };
};
export const searchQRFailure = (state, {error}) => {
  return {...state, searchQR: {fetching: false, error}};
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADD_PREPARING]: addPreparing,
  [Types.EDIT_PREPARING]: editPreparing,
  [Types.DELETE_PREPARING]: deletePreparing,

  [Types.ADD_LOADING]: addLoading,
  [Types.EDIT_LOADING]: editLoading,
  [Types.DELETE_LOADING]: deleteLoading,
  [Types.REMOVE_ALL_LOADING]: removeAllLoading,

  [Types.ADD_DISSAMBLING]: addDissambling,
  [Types.EDIT_DISSAMBLING]: editDissambling,
  [Types.DELETE_DISSAMBLING]: deleteDissambling,

  [Types.POST_OPERATION_REQUEST]: postOperationRequest,
  [Types.POST_OPERATION_SUCCESS]: postOperationSuccess,
  [Types.POST_OPERATION_FAILURE]: postOperationFailure,

  [Types.POST_LOADING_REQUEST]: postLoadingRequest,
  [Types.POST_LOADING_SUCCESS]: postLoadingSuccess,
  [Types.POST_LOADING_FAILURE]: postLoadingFailure,

  [Types.GET_LOCATIONS_REQUEST]: getLocationsRequest,
  [Types.GET_LOCATIONS_SUCCESS]: getLocationsSuccess,
  [Types.GET_LOCATIONS_FAILURE]: getLocationsFailure,

  [Types.GET_REPORTS_REQUEST]: getReportsRequest,
  [Types.GET_REPORTS_SUCCESS]: getReportsSuccess,
  [Types.GET_REPORTS_FAILURE]: getReportsFailure,

  [Types.GET_SETUP_LOADING_REQUEST]: getSetupLoadingRequest,
  [Types.GET_SETUP_LOADING_SUCCESS]: getSetupLoadingSuccess,
  [Types.GET_SETUP_LOADING_FAILURE]: getSetupLoadingFailure,

  [Types.SEARCH_QR_REQUEST]: searchQRRequest,
  [Types.SEARCH_QR_SUCCESS]: searchQRSuccess,
  [Types.SEARCH_QR_FAILURE]: searchQRFailure,
});
