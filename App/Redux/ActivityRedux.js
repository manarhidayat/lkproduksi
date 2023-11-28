import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  saveActivity: ['data'],
  editActivity: ['data'],
  deleteActivity: ['data'],
  uploadActivity: null,

  postActivityRequest: ['data'],
  postActivitySuccess: ['payload'],
  postActivityFailure: ['error'],

  getLocationsRequest: ['data'],
  getLocationsSuccess: ['payload'],
  getLocationsFailure: ['error'],

  removeActivities: null,
});

export const ActivityTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  activities: [],
  locations: [],
  getLocations: {fetching: false, data: null, error: null, },
  postActivity: {fetching: false, data: null, error: null, payload: null}
});

export const ActivitySelectors = {
  getActivities: (state) => state.activity.activities,
  getLocations: (state) => state.activity.locations,
  getActivitieNotUploaded: (state) => {
    let activities = state.activity.activities;

    // activities = activities.filter(item => item.isUpload === false && item.isComplete === true);
    activities = activities.filter(item => item.isUpload === false);
    return activities;
  },
};

/* ------------- Reducers ------------- */

export const saveActivity = (state, {data}) =>
  state.merge({...state, activities: [...state.activities, data]});
export const editActivity = (state, {data}) => {
  let activities = [...state.activities];
  const index = activities.findIndex((item) => item.id === data.id);
  activities[index] = data;

  return state.merge({...state, activities, data});
};
export const deleteActivity = (state, {data}) => {
  let activities = state.activities.filter((item) => item.id !== data);

  return state.merge({...state, activities, data});
};

export const postActivityRequest = (state, {data}) =>
  state.merge({...state, postActivity: {fetching: true, data}});
export const postActivitySuccess = (state, {payload}) => 
  state.merge({...state, postActivity: {fetching: false, error: null, payload}});
export const postActivityFailure = (state, {error}) =>
  state.merge({...state, postActivity: {fetching: false, error}});

export const getLocationsRequest = (state, {data}) =>
  state.merge({...state, getLocations: {fetching: true, data}});
export const getLocationsSuccess = (state, {payload}) =>
  state.merge({...state, getLocations: {fetching: false, error: null}, locations: payload.records});
export const getLocationsFailure = (state, {error}) =>
  state.merge({...state, getLocations: {fetching: false, error}});

export const removeActivitiesReducer = (state) =>
  state.merge({...state, ...INITIAL_STATE});

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SAVE_ACTIVITY]: saveActivity,
  [Types.EDIT_ACTIVITY]: editActivity,
  [Types.DELETE_ACTIVITY]: deleteActivity,

  [Types.POST_ACTIVITY_REQUEST]: postActivityRequest,
  [Types.POST_ACTIVITY_SUCCESS]: postActivitySuccess,
  [Types.POST_ACTIVITY_FAILURE]: postActivityFailure,

  [Types.GET_LOCATIONS_REQUEST]: getLocationsRequest,
  [Types.GET_LOCATIONS_SUCCESS]: getLocationsSuccess,
  [Types.GET_LOCATIONS_FAILURE]: getLocationsFailure,

  [Types.REMOVE_ACTIVITIES]: removeActivitiesReducer,
});
