import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  getResumeBatchRequest: ['data'],
  getResumeBatchSuccess: ['payload'],
  getResumeBatchFailure: ['error'],

  getTimelineBatchRequest: ['data'],
  getTimelineBatchSuccess: ['payload'],
  getTimelineBatchFailure: ['error'],
});

export const DashboardTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  resume: {
    queue: 0,
    in_progress: 0,
    waiting: 0,
    approved: 0,
    decline: 0,
  },
  listResume: [],
  detail: {},
  timeline: [],
  catatan: [],

  getResumeBatch: {fetching: false, data: null, error: null, payload: null},
  getTimelineBatch: {fetching: false, data: null, error: null, payload: null},
});

export const DashboardSelectors = {
  getResume: (state) => state.dashboard.resume,
  getListResume: (state) => state.dashboard.listResume,

  getDetailDashboard: (state) => state.dashboard.detail,
  getTimeline: (state) => state.dashboard.timeline,
  getNotes: (state) => state.dashboard.catatan,

  getResumeRequest: (state) => state.dashboard.getResumeBatch.data,
};

/* ------------- Reducers ------------- */

export const getResumeBatchRequest = (state, {data}) =>
  state.merge({...state, getResumeBatch: {fetching: true, data}});
export const getResumeBatchSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    getResumeBatch: {
      ...state.getResumeBatch,
      fetching: false,
      error: null,
      payload,
    },
    resume: payload.resume,
    listResume: payload.detail,
  });
export const getResumeBatchFailure = (state, {error}) =>
  state.merge({...state, getResumeBatch: {fetching: false, error}});

export const getTimelineBatchRequest = (state, {data}) =>
  state.merge({...state, getTimelineBatch: {fetching: true, data}});
export const getTimelineBatchSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    getTimelineBatch: {fetching: false, error: null, payload},
    detail: payload.detail,
    timeline: payload.timeline,
    catatan: payload.catatan,
  });
export const getTimelineBatchFailure = (state, {error}) =>
  state.merge({...state, getTimelineBatch: {fetching: false, error}});

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_RESUME_BATCH_REQUEST]: getResumeBatchRequest,
  [Types.GET_RESUME_BATCH_SUCCESS]: getResumeBatchSuccess,
  [Types.GET_RESUME_BATCH_FAILURE]: getResumeBatchFailure,

  [Types.GET_TIMELINE_BATCH_REQUEST]: getTimelineBatchRequest,
  [Types.GET_TIMELINE_BATCH_SUCCESS]: getTimelineBatchSuccess,
  [Types.GET_TIMELINE_BATCH_FAILURE]: getTimelineBatchFailure,
});
