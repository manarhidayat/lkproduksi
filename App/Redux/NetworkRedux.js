import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  updateNetworkStatus: ['data'],
});

export const NetworkTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  isConnected: true,
});

/* ------------- Selectors ------------- */

export const NetworkSelectors = {
  getNetworkStatus: (state) => state.network.isConnected,
};

/* ------------- Reducers ------------- */

export const updateNetworkStatus = (state, {data}) =>
  state.merge({...state, isConnected: data.isConnected});

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.UPDATE_NETWORK_STATUS]: updateNetworkStatus,
});
