import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  loginRequest: ['data'],
  doLoginSuccess: ['payload'],
  doLoginFailure: ['error'],

  changePasswordRequest: ['data'],
  changePasswordSuccess: ['payload'],
  changePasswordFailure: ['error']
});

export const AuthTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  doLogin: {fetching: false, data: null, error: null, payload: null},
  changePassword: {fetching: false, data: null, error: null, payload: null}
});

/* ------------- Reducers ------------- */

export const loginRequest = (state, {data}) =>
  state.merge({...state, doLogin: {fetching: true, data}});
export const doLoginSuccess = (state, {payload}) =>
  state.merge({...state, doLogin: {fetching: false, error: null, payload}});
export const doLoginFailure = (state, {error}) =>
  state.merge({...state, doLogin: {fetching: false, error}});

export const changePasswordRequest = (state, {data}) =>
  state.merge({...state, changePassword: {fetching: true, data}});
export const changePasswordSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    changePassword: {fetching: false, error: null, payload}
  });
export const changePasswordFailure = (state, {error}) =>
  state.merge({...state, changePassword: {fetching: false, error}});

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN_REQUEST]: loginRequest,
  [Types.DO_LOGIN_SUCCESS]: doLoginSuccess,
  [Types.DO_LOGIN_FAILURE]: doLoginFailure,

  [Types.CHANGE_PASSWORD_REQUEST]: changePasswordRequest,
  [Types.CHANGE_PASSWORD_SUCCESS]: changePasswordSuccess,
  [Types.CHANGE_PASSWORD_FAILURE]: changePasswordFailure
});
