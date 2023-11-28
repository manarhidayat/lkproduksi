import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  saveInventory: ['data'],
  saveAllInventory: ['data'],
  editInventory: ['data'],
  deleteInventory: ['data'],

  removeInventories: null,
});

export const InventoryTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  inventories: []
});

export const InventorySelectors = {
  getListInventory: (state) => state.inventory.inventories,
  getInventory: (state, id) => {
    const index = state.inventory.inventories.findIndex((item) => item.id === id);

    return state.inventory.inventories[index]
  },
};

/* ------------- Reducers ------------- */

export const saveInventory = (state, {data}) =>
  state.merge({...state, inventories: [...state.inventories, data]});
export const saveAllInventory = (state, {data}) =>
  // state.merge({...state, inventories: [...state.inventories, ...data]});
  state.merge({...state, inventories: data});
export const editInventory = (state, {data}) => {
  let inventories = [...state.inventories];
  const index = inventories.findIndex((item) => item.id === data.id);
  inventories[index] = data;

  return state.merge({...state, inventories, data});
};
export const deleteInventory = (state, {data}) => {
  let inventories = state.inventories.filter((item) => item.id !== data);

  return state.merge({...state, inventories, data});
};

export const removeInventoriesReducer = (state) =>
  state.merge({...state, ...INITIAL_STATE});

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SAVE_INVENTORY]: saveInventory,
  [Types.SAVE_ALL_INVENTORY]: saveAllInventory,
  [Types.EDIT_INVENTORY]: editInventory,
  [Types.DELETE_INVENTORY]: deleteInventory,

  [Types.REMOVE_INVENTORIES]: removeInventoriesReducer,
});
