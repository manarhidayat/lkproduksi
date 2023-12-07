import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';
import {OPERATIONS, OPERATIONS_TYPES} from '../Lib/Constans';
import {Images} from '../Themes';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  addOperation: ['data'],
  setCurrentOperation: ['data'],
  setWorking: ['data'],
  setDetailMaterial: ['data'],
  setStartGas: ['data'],
  setEndGas: ['data'],
  setJumlahProduksi: ['data'],

  removeOperations: null,
  removeOperationsExcBatch: null,

  getListBatchRequest: ['data'],
  getListBatchSuccess: ['payload'],
  getListBatchFailure: ['error'],

  getListKitchenRequest: ['data'],
  getListKitchenSuccess: ['payload'],
  getListKitchenFailure: ['error'],

  startOperationRequest: ['data'],
  startOperationSuccess: ['payload'],
  startOperationFailure: ['error'],

  stopOperationRequest: ['data'],
  stopOperationSuccess: ['payload'],
  stopOperationFailure: ['error'],

  finishOperationRequest: ['data'],
  finishOperationSuccess: ['payload'],
  finishOperationFailure: ['error'],

  getListReasonRequest: ['data'],
  getListReasonSuccess: ['payload'],
  getListReasonFailure: ['error'],

  getListOperationRequest: ['data'],
  getListOperationSuccess: ['payload'],
  getListOperationFailure: ['error'],

  beginOperationRequest: ['data'],
  beginOperationSuccess: ['payload'],
  beginOperationFailure: ['error'],

  getDetailBatchRequest: ['data'],
  getDetailBatchSuccess: ['payload'],
  getDetailBatchFailure: ['error'],
});

export const OperationTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  operations: [],
  currentOperation: {},
  isWorking: false,
  detailMaterial: [],
  progressDetailId: null,
  startGas: '',
  endGas: '',
  jumlahProduks: '',

  listBatch: {fetching: false, data: null, error: null, payload: null},
  listKitchen: {fetching: false, data: null, error: null, payload: null},
  startOperation: {fetching: false, data: null, error: null, payload: null},
  stopOperation: {fetching: false, data: null, error: null, payload: null},
  finishOperation: {fetching: false, data: null, error: null, payload: null},

  getListReason: {fetching: false, data: null, error: null, payload: null},
  getListOperation: {fetching: false, data: null, error: null, payload: null},
  beginOperation: {fetching: false, data: null, error: null, payload: null},
  getDetailBatch: {fetching: false, data: null, error: null, payload: null},
});

export const OperationSelectors = {
  isWorking: (state) => state.operation.isWorking,
  getOperations: (state) => state.operation.operations,
  getCurrentOperation: (state) => state.operation.currentOperation,
  getDetailMaterial: (state) => state.operation.detailMaterial,
  getProgressId: (state) => state.operation.beginOperation.payload.progress_id,
  getProgressDetailId: (state) => state.operation.progressDetailId,
  getStartGas: (state) => state.operation.startGas,
  getEndGas: (state) => state.operation.endGas,
  getJumlahProduksi: (state) => state.operation.jumlahProduks,

  getKitchens: (state) => state.operation.listKitchen.payload || [],
  getBatchs: (state) => state.operation.listBatch.payload || [],
  getDetailBatch: (state) => state.operation.getDetailBatch.payload || [],
  getReasons: (state) => state.operation.getListReason.payload || [],
  getListOperation: (state) => state.operation.getListOperation.payload || [],
};

/* ------------- Reducers ------------- */

export const setWorking = (state, {data}) => {
  return state.merge({...state, isWorking: data});
};

export const setDetailMaterial = (state, {data}) => {
  const detailBatch = state.getDetailBatch.payload || [];
  const arr = detailBatch.map((batch) => {
    const material = data.filter((mat) => mat.material_id === batch.pt_id);
    if (material && material.length > 0) {
      return {
        ...batch,
        wod_qty_req: batch.wod_qty_req - material[0].qty_use,
      };
    } else {
      return batch;
    }
  });

  return state.merge({
    ...state,
    detailMaterial: data,
    getDetailBatch: {payload: arr},
  });
};

export const addOperation = (state, {data}) => {
  return state.merge({...state, operations: [...state.operations, data]});
};

export const setCurrentOperation = (state, {data}) => {
  return state.merge({...state, currentOperation: data});
};

export const setStartGas = (state, {data}) => {
  return state.merge({...state, startGas: data});
};

export const setEndGas = (state, {data}) => {
  return state.merge({...state, endGas: data});
};

export const setJumlahProduksi = (state, {data}) => {
  return state.merge({...state, jumlahProduks: data});
};

export const removeOperationsReducer = (state) =>
  state.merge({...state, ...INITIAL_STATE});

export const removeOperationsExcBatchReducer = (state) => {
  console.tron.log('wew state', state);
  const listBatch = [...state.listBatch.payload];
  return state.merge({
    ...state,
    ...INITIAL_STATE,
    listBatch: {payload: listBatch},
  });
};

export const getListBatchRequest = (state, {data}) =>
  state.merge({...state, listBatch: {fetching: true, data}});
export const getListBatchSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    listBatch: {fetching: false, error: null, payload: payload.batches},
  });
export const getListBatchFailure = (state, {error}) =>
  state.merge({...state, listBatch: {fetching: false, error}});

export const getListKitchenRequest = (state, {data}) =>
  state.merge({...state, listKitchen: {fetching: true, data}});
export const getListKitchenSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    listKitchen: {fetching: false, error: null, payload: payload.kitchens},
  });
export const getListKitchenFailure = (state, {error}) =>
  state.merge({...state, listKitchen: {fetching: false, error}});

export const startOperationRequest = (state, {data}) =>
  state.merge({...state, startOperation: {fetching: true, data}});
export const startOperationSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    startOperation: {fetching: false, error: null, payload},
    progressDetailId: payload.progress_detail_id,
  });
export const startOperationFailure = (state, {error}) =>
  state.merge({...state, startOperation: {fetching: false, error}});

export const stopOperationRequest = (state, {data}) =>
  state.merge({...state, stopOperation: {fetching: true, data}});
export const stopOperationSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    stopOperation: {fetching: false, error: null, payload},
  });
export const stopOperationFailure = (state, {error}) =>
  state.merge({...state, stopOperation: {fetching: false, error}});

export const finishOperationRequest = (state, {data}) =>
  state.merge({...state, finishOperation: {fetching: true, data}});
export const finishOperationSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    finishOperation: {fetching: false, error: null, payload},
  });
export const finishOperationFailure = (state, {error}) =>
  state.merge({...state, finishOperation: {fetching: false, error}});

export const getListReasonRequest = (state, {data}) =>
  state.merge({...state, getListReason: {fetching: true, data}});
export const getListReasonSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    getListReason: {fetching: false, error: null, payload: payload.reasons},
  });
export const getListReasonFailure = (state, {error}) =>
  state.merge({...state, getListReason: {fetching: false, error}});

export const getListOperationRequest = (state, {data}) =>
  state.merge({...state, getListOperation: {fetching: true, data}});
export const getListOperationSuccess = (state, {payload}) => {
  const array = payload.process
    .filter((item) => item.wc_code !== '-')
    .map((item) => {
      let icon = null;
      switch (item.wc_code) {
        case OPERATIONS_TYPES.charging:
          icon = Images.charging;
          break;
        case OPERATIONS_TYPES.burner:
          icon = Images.burner;
          break;
        case OPERATIONS_TYPES.mixing:
          icon = Images.mixing;
          break;
        case OPERATIONS_TYPES.casting:
          icon = Images.mixing;
          break;
        case OPERATIONS_TYPES.drossing:
          icon = Images.drossing;
          break;
        case OPERATIONS_TYPES.sampling:
          icon = Images.sampling;
          break;
        case OPERATIONS_TYPES.alloying:
          icon = Images.alloying;
          break;
        case OPERATIONS_TYPES.fluxing:
          icon = Images.fluxing;
          break;
        case OPERATIONS_TYPES.transfer:
          icon = Images.transfer;
          break;
        case OPERATIONS_TYPES.holding:
          icon = Images.holding;
          break;
        case OPERATIONS_TYPES.degassing:
          icon = Images.degassing;
          break;
      }

      return {
        ...item,
        icon,
      };
    });
  return state.merge({
    ...state,
    getListOperation: {
      fetching: false,
      error: null,
      payload: array,
    },
  });
};
export const getListOperationFailure = (state, {error}) =>
  state.merge({...state, getListOperation: {fetching: false, error}});

export const beginOperationRequest = (state, {data}) =>
  state.merge({...state, beginOperation: {fetching: true, data}});
export const beginOperationSuccess = (state, {payload}) =>
  state.merge({
    ...state,
    beginOperation: {fetching: false, error: null, payload},
  });
export const beginOperationFailure = (state, {error}) =>
  state.merge({...state, beginOperation: {fetching: false, error}});

export const getDetailBatchRequest = (state, {data}) =>
  state.merge({...state, getDetailBatch: {fetching: true, data}});
export const getDetailBatchSuccess = (state, {payload}) => {
  const array = payload.detail.map((item) => {
    return {
      ...item,
      wod_qty_req: parseInt(item.wod_qty_req, 10),
    };
  });
  return state.merge({
    ...state,
    getDetailBatch: {fetching: false, error: null, payload: array},
  });
};
export const getDetailBatchFailure = (state, {error}) =>
  state.merge({...state, getDetailBatch: {fetching: false, error}});

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_WORKING]: setWorking,
  [Types.SET_DETAIL_MATERIAL]: setDetailMaterial,
  [Types.ADD_OPERATION]: addOperation,
  [Types.SET_CURRENT_OPERATION]: setCurrentOperation,
  [Types.SET_START_GAS]: setStartGas,
  [Types.SET_END_GAS]: setEndGas,
  [Types.SET_JUMLAH_PRODUKSI]: setJumlahProduksi,

  [Types.REMOVE_OPERATIONS]: removeOperationsReducer,
  [Types.REMOVE_OPERATIONS_EXC_BATCH]: removeOperationsExcBatchReducer,

  [Types.GET_LIST_BATCH_REQUEST]: getListBatchRequest,
  [Types.GET_LIST_BATCH_SUCCESS]: getListBatchSuccess,
  [Types.GET_LIST_BATCH_FAILURE]: getListBatchFailure,

  [Types.GET_LIST_KITCHEN_REQUEST]: getListKitchenRequest,
  [Types.GET_LIST_KITCHEN_SUCCESS]: getListKitchenSuccess,
  [Types.GET_LIST_KITCHEN_FAILURE]: getListKitchenFailure,

  [Types.START_OPERATION_REQUEST]: startOperationRequest,
  [Types.START_OPERATION_SUCCESS]: startOperationSuccess,
  [Types.START_OPERATION_FAILURE]: startOperationFailure,

  [Types.STOP_OPERATION_REQUEST]: stopOperationRequest,
  [Types.STOP_OPERATION_SUCCESS]: stopOperationSuccess,
  [Types.STOP_OPERATION_FAILURE]: stopOperationFailure,

  [Types.FINISH_OPERATION_REQUEST]: finishOperationRequest,
  [Types.FINISH_OPERATION_SUCCESS]: finishOperationSuccess,
  [Types.FINISH_OPERATION_FAILURE]: finishOperationFailure,

  [Types.GET_LIST_REASON_REQUEST]: getListReasonRequest,
  [Types.GET_LIST_REASON_SUCCESS]: getListReasonSuccess,
  [Types.GET_LIST_REASON_FAILURE]: getListReasonFailure,

  [Types.GET_LIST_OPERATION_REQUEST]: getListOperationRequest,
  [Types.GET_LIST_OPERATION_SUCCESS]: getListOperationSuccess,
  [Types.GET_LIST_OPERATION_FAILURE]: getListOperationFailure,

  [Types.BEGIN_OPERATION_REQUEST]: beginOperationRequest,
  [Types.BEGIN_OPERATION_SUCCESS]: beginOperationSuccess,
  [Types.BEGIN_OPERATION_FAILURE]: beginOperationFailure,

  [Types.GET_DETAIL_BATCH_REQUEST]: getDetailBatchRequest,
  [Types.GET_DETAIL_BATCH_SUCCESS]: getDetailBatchSuccess,
  [Types.GET_DETAIL_BATCH_FAILURE]: getDetailBatchFailure,
});
