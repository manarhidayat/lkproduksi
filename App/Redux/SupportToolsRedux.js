import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  saveSupportTools: ['data', 'activity_id'],
  editSupportTools: ['data', 'activity_id'],
  deleteSupportTools: ['data', 'activity_id'],

  removeSupoortTools: null,
});

export const SupportToolsTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  supportTools: {}
});

export const SupportToolsSelectors = {
  getListSupportTools: (state, activity_id) => {
    if(state.supportTools.supportTools[activity_id]){
      return state.supportTools.supportTools[activity_id];
    }else{
      return [];
    }
  },
};

/* ------------- Reducers ------------- */

export const saveSupportTools = (state, {data, activity_id}) => {
  let supportTools
  if(state.supportTools[activity_id]){
    supportTools = {
      ...state.supportTools,
      [activity_id]: [...state.supportTools[activity_id], data]
    }
  }else{
    supportTools = {
      ...state.supportTools,
      [activity_id]: [data]
    }
  }

  return state.merge({...state, supportTools});
}
  
export const editSupportTools = (state, {data, activity_id}) => {
  let supportTools = state.supportTools;

  let arr = [...state.supportTools[activity_id]];
  const index = arr.findIndex((item) => item.id === data.id);
  arr[index] = data;

  supportTools = {
    ...supportTools,
    [activity_id]: arr
  }

  return state.merge({...state, supportTools, data});
};
export const deleteSupportTools = (state, {data, activity_id}) => {
  let supportTools = state.supportTools[activity_id].filter((item) => item.id !== data);

  return state.merge({...state, supportTools, data});
};

export const removeSupoortToolsReducer = (state) =>
  state.merge({...state, ...INITIAL_STATE});

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SAVE_SUPPORT_TOOLS]: saveSupportTools,
  [Types.EDIT_SUPPORT_TOOLS]: editSupportTools,
  [Types.DELETE_SUPPORT_TOOLS]: deleteSupportTools,

  [Types.REMOVE_SUPOORT_TOOLS]: removeSupoortToolsReducer,
});
