import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  loginRequest: ['data'],
  doLoginSuccess: ['payload'],
  doLoginFailure: ['error'],

  doLoginAzureRequest: ['data'],
  doLoginAzureSuccess: ['payload'],
  doLoginAzureFailure: ['error']
});

export const AuthTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  doLogin: {fetching: false, data: null, error: null, payload: null},
  doLoginAzure: {fetching: false, data: null, error: null, payload: null}
});

/* ------------- Reducers ------------- */

export const loginRequest = (state, {data}) =>
  state.merge({...state, doLogin: {fetching: true, data}});
export const doLoginSuccess = (state, {payload}) =>
  state.merge({...state, doLogin: {fetching: false, error: null, payload}});
export const doLoginFailure = (state, {error}) =>
  state.merge({...state, doLogin: {fetching: false, error}});

export const doLoginAzureRequest = (state, {data}) =>
  state.merge({...state, doLoginAzure: {fetching: true, data}});
export const doLoginAzureSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    doLoginAzure: {fetching: false, error: null, payload}
  });
export const doLoginAzureFailure = (state, {error}) =>
  state.merge({...state, doLoginAzure: {fetching: false, error}});

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN_REQUEST]: loginRequest,
  [Types.DO_LOGIN_SUCCESS]: doLoginSuccess,
  [Types.DO_LOGIN_FAILURE]: doLoginFailure,

  [Types.DO_LOGIN_AZURE_REQUEST]: doLoginAzureRequest,
  [Types.DO_LOGIN_AZURE_SUCCESS]: doLoginAzureSuccess,
  [Types.DO_LOGIN_AZURE_FAILURE]: doLoginAzureFailure
});
