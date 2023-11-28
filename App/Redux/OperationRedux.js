import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  addOperation: ['data'],
  setCurrentOperation: ['data'],
  setWorking: ['data'],

  removeOperations: null,
});

export const OperationTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  operations: [],
  currentOperation: {},
  isWorking: false
});

export const OperationSelectors = {
  isWorking: (state) => state.operation.isWorking,
  getOperations: (state) => state.operation.operations,
  getCurrentOperation: (state) => state.operation.currentOperation,
};

/* ------------- Reducers ------------- */

export const setWorking = (state, {data}) => {
  return state.merge({...state, isWorking: data});
};

export const addOperation = (state, {data}) => {
  return state.merge({...state, operations: [...state.operations, data]});
};

export const setCurrentOperation = (state, {data}) => {
  return state.merge({...state, currentOperation: data});
};

export const removeOperationsReducer = (state) =>
  state.merge({...state, ...INITIAL_STATE});

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_WORKING]: setWorking,
  [Types.ADD_OPERATION]: addOperation,
  [Types.SET_CURRENT_OPERATION]: setCurrentOperation,

  [Types.REMOVE_OPERATIONS]: removeOperationsReducer,
});
