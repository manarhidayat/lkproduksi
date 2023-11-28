import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  getListActiveMachineRequest: ['data'],
  getListActiveMachineSuccess: ['payload'],
  getListActiveMachineFailure: ['error'],

  getListItemOfMachineRequest: ['data'],
  getListItemOfMachineSuccess: ['payload'],
  getListItemOfMachineFailure: ['error'],

  getListItemGoingToMaintenanceRequest: ['data'],
  getListItemGoingToMaintenanceSuccess: ['payload'],
  getListItemGoingToMaintenanceFailure: ['error']
});

export const MachineTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  getListActiveMachine: {
    fetching: false,
    data: null,
    error: null,
    payload: []
  },
  getListItemOfMachine: {
    fetching: false,
    data: null,
    error: null,
    payload: null
  },
  getListItemGoingToMaintenance: {
    fetching: false,
    data: null,
    error: null,
    payload: null
  }
});

/* ------------- Selectors ------------- */

export const MachineSelectors = {
  getMachiines: (state) => state.machine.getListActiveMachine.payload,
};

/* ------------- Reducers ------------- */

export const getListActiveMachineRequest = (state, {data}) =>
  state.merge({...state, getListActiveMachine: {fetching: true, data}});
export const getListActiveMachineSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    getListActiveMachine: {fetching: false, error: null, payload}
  });
export const getListActiveMachineFailure = (state, {error}) =>
  state.merge({...state, getListActiveMachine: {fetching: false, error}});

export const getListItemOfMachineRequest = (state, {data}) =>
  state.merge({...state, getListItemOfMachine: {fetching: true, data}});
export const getListItemOfMachineSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    getListItemOfMachine: {fetching: false, error: null, payload}
  });
export const getListItemOfMachineFailure = (state, {error}) =>
  state.merge({...state, getListItemOfMachine: {fetching: false, error}});

export const getListItemGoingToMaintenanceRequest = (state, {data}) =>
  state.merge({
    ...state,
    getListItemGoingToMaintenance: {fetching: true, data}
  });
export const getListItemGoingToMaintenanceSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    getListItemGoingToMaintenance: {fetching: false, error: null, payload}
  });
export const getListItemGoingToMaintenanceFailure = (state, {error}) =>
  state.merge({
    ...state,
    getListItemGoingToMaintenance: {fetching: false, error}
  });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_LIST_ACTIVE_MACHINE_REQUEST]: getListActiveMachineRequest,
  [Types.GET_LIST_ACTIVE_MACHINE_SUCCESS]: getListActiveMachineSuccess,
  [Types.GET_LIST_ACTIVE_MACHINE_FAILURE]: getListActiveMachineFailure,

  [Types.GET_LIST_ITEM_OF_MACHINE_REQUEST]: getListItemOfMachineRequest,
  [Types.GET_LIST_ITEM_OF_MACHINE_SUCCESS]: getListItemOfMachineSuccess,
  [Types.GET_LIST_ITEM_OF_MACHINE_FAILURE]: getListItemOfMachineFailure,

  [Types.GET_LIST_ITEM_GOING_TO_MAINTENANCE_REQUEST]:
    getListItemGoingToMaintenanceRequest,
  [Types.GET_LIST_ITEM_GOING_TO_MAINTENANCE_SUCCESS]:
    getListItemGoingToMaintenanceSuccess,
  [Types.GET_LIST_ITEM_GOING_TO_MAINTENANCE_FAILURE]:
    getListItemGoingToMaintenanceFailure
});
