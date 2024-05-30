import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  setLogin: ['data'],
  saveUserData: ['data'],
  saveUserHeaders: ['data'],
  saveUserRole: ['data'],

  setTypeBoarding: ['data'],
  saveBatch: ['data'],
  saveKitchen: ['data'],
  saveTimer: ['data'],
  removeSession: null,

  updateUserData: ['data'],
  updateUserPhoto: ['data'],
});

export const SessionTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  isLogin: false,
  headers: null,
  user: null,
  boarding: null,
  role: null,

  batch: null,
  kitchen: null,
  timer: null,
});

/* ------------- Selectors ------------- */

export const SessionSelectors = {
  selectUser: (state) => state.session.user,
  selectBoarding: (state) => state.session.boarding,
  selectHeader: (state) => state.session.headers,
  selectRole: (state) => state.session.role,

  selectKitchen: (state) => state.session.kitchen,
  selectTimer: (state) => state.session.timer,
  isLogin: (state) => state.session.isLogin,
};

/* ------------- Reducers ------------- */

export const setLogin = (state, {data}) => {
  return {...state, isLogin: data};
};

export const saveUserData = (state, {data}) => {
  return {...state, user: data};
};

export const setTypeBoarding = (state, {data}) => {
  return {...state, boarding: data};
};

export const updateUserData = (state, {data}) => {
  // const { data } = state.updateProfile
  const newDataUser = {
    ...state.user,
    name: data.name,
    email_address: data.email_address,
    mobile_phone_number: data.mobile_phone_number,
    birth_date: data.birth_date,
  };
  return {...state, user: newDataUser};
};

export const updateUserPhoto = (state, {data}) => {
  // const { data } = state.updateProfile
  const newDataUser = {
    ...state.user,
    photo: data.photo,
  };
  return {...state, user: newDataUser};
};

export const saveUserHeadersReducer = (state, {data}) => {
  return {...state, headers: data};
};

export const saveUserRoleReducer = (state, {data}) => {
  return {...state, role: data};
};

export const saveKitchenReducer = (state, {data}) => {
  return {...state, kitchen: data};
};

export const saveBatchReducer = (state, {data}) => {
  return {...state, batch: data};
};

export const saveTimerReducer = (state, {data}) => {
  return {...state, timer: data};
};

export const removeSessionReducer = (state) => {
  return {...state, ...INITIAL_STATE};
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_LOGIN]: setLogin,
  [Types.SAVE_USER_DATA]: saveUserData,
  [Types.SET_TYPE_BOARDING]: setTypeBoarding,
  [Types.UPDATE_USER_DATA]: updateUserData,
  [Types.UPDATE_USER_PHOTO]: updateUserPhoto,
  [Types.SAVE_USER_HEADERS]: saveUserHeadersReducer,
  [Types.SAVE_USER_ROLE]: saveUserRoleReducer,

  [Types.SAVE_KITCHEN]: saveKitchenReducer,
  [Types.SAVE_BATCH]: saveBatchReducer,
  [Types.SAVE_TIMER]: saveTimerReducer,
  [Types.REMOVE_SESSION]: removeSessionReducer,
});
