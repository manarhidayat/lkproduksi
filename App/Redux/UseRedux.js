import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  getListItemUseRequest: ['data'],
  getListItemUseSuccess: ['payload'],
  getListItemUseFailure: ['error'],

  postUseRequest: ['data'],
  postUseSuccess: ['payload'],
  postUseFailure: ['error'],

  postReturnRequest: ['data'],
  postReturnSuccess: ['payload'],
  postReturnFailure: ['error']
});

export const UseTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  getListItemUse: {fetching: false, data: null, error: null, payload: null},
  postUse: {fetching: false, data: null, error: null, payload: null},
  postReturn: {fetching: false, data: null, error: null, payload: null}
});

/* ------------- Reducers ------------- */

export const getListItemUseRequest = (state, {data}) =>
  state.merge({...state, getListItemUse: {fetching: true, data}});
export const getListItemUseSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    getListItemUse: {fetching: false, error: null, payload}
  });
export const getListItemUseFailure = (state, {error}) =>
  state.merge({...state, getListItemUse: {fetching: false, error}});

export const postUseRequest = (state, {data}) =>
  state.merge({...state, postUse: {fetching: true, data}});
export const postUseSuccess = (state, {payload}) =>
  state.merge({...state, postUse: {fetching: false, error: null, payload}});
export const postUseFailure = (state, {error}) =>
  state.merge({...state, postUse: {fetching: false, error}});

export const postReturnRequest = (state, {data}) =>
  state.merge({...state, postReturn: {fetching: true, data}});
export const postReturnSuccess = (state, {payload}) =>
  state.merge({...state, postReturn: {fetching: false, error: null, payload}});
export const postReturnFailure = (state, {error}) =>
  state.merge({...state, postReturn: {fetching: false, error}});

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_LIST_ITEM_USE_REQUEST]: getListItemUseRequest,
  [Types.GET_LIST_ITEM_USE_SUCCESS]: getListItemUseSuccess,
  [Types.GET_LIST_ITEM_USE_FAILURE]: getListItemUseFailure,

  [Types.POST_USE_REQUEST]: postUseRequest,
  [Types.POST_USE_SUCCESS]: postUseSuccess,
  [Types.POST_USE_FAILURE]: postUseFailure,

  [Types.POST_RETURN_REQUEST]: postReturnRequest,
  [Types.POST_RETURN_SUCCESS]: postReturnSuccess,
  [Types.POST_RETURN_FAILURE]: postReturnFailure
});
