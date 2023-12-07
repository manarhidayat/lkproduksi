import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  approveRequest: ['data'],
  approveSuccess: ['payload'],
  approveFailure: ['error'],

  declineRequest: ['data'],
  declineSuccess: ['payload'],
  declineFailure: ['error'],
});

export const ApprovalTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  approve: {fetching: false, data: null, error: null, payload: null},
  decline: {fetching: false, data: null, error: null, payload: null},
});

export const ApprovalSelectors = {
  getKitchens: (state) => state.approval.listKitchen.payload || [],
  // getBatchs: (state) => state.approval.listBatch.payload || [],
};

/* ------------- Reducers ------------- */

export const approveRequest = (state, {data}) =>
  state.merge({...state, approve: {fetching: true, data}});
export const approveSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    approve: {fetching: false, error: null, payload},
  });
export const approveFailure = (state, {error}) =>
  state.merge({...state, approve: {fetching: false, error}});

export const declineRequest = (state, {data}) =>
  state.merge({...state, decline: {fetching: true, data}});
export const declineSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    decline: {fetching: false, error: null, payload},
  });
export const declineFailure = (state, {error}) =>
  state.merge({...state, decline: {fetching: false, error}});

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.APPROVE_REQUEST]: approveRequest,
  [Types.APPROVE_SUCCESS]: approveSuccess,
  [Types.APPROVE_FAILURE]: approveFailure,

  [Types.DECLINE_REQUEST]: declineRequest,
  [Types.DECLINE_SUCCESS]: declineSuccess,
  [Types.DECLINE_FAILURE]: declineFailure,
});
