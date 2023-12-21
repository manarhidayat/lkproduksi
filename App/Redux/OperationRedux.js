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
  setFinishMaterial: ['data'],

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

  getJumlahProduksiRequest: ['data', 'callback'],
  getJumlahProduksiSuccess: ['payload'],
  getJumlahProduksiFailure: ['error'],

  updateBatchRequest: ['data', 'callback'],
  updateBatchSuccess: ['payload'],
  updateBatchFailure: ['error'],
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
  finishMaterial: [],

  listBatch: {fetching: false, data: null, error: null, payload: null},
  listKitchen: {fetching: false, data: null, error: null, payload: null},
  startOperation: {fetching: false, data: null, error: null, payload: null},
  stopOperation: {fetching: false, data: null, error: null, payload: null},
  finishOperation: {fetching: false, data: null, error: null, payload: null},

  getListReason: {fetching: false, data: null, error: null, payload: null},
  getListOperation: {fetching: false, data: null, error: null, payload: null},
  beginOperation: {fetching: false, data: null, error: null, payload: null},
  getDetailBatch: {fetching: false, data: null, error: null, payload: null},
  getJumlahProduksi: {fetching: false, data: null, error: null, payload: null},
  updateBatch: {fetching: false, data: null, error: null, payload: null},
});

export const OperationSelectors = {
  isWorking: (state) => state.operation.isWorking,
  getOperations: (state) => state.operation.operations,
  getCurrentOperation: (state) => state.operation.currentOperation,
  getDetailMaterial: (state) => state.operation.detailMaterial,
  getProgressId: (state) =>
    state.operation.beginOperation.payload
      ? state.operation.beginOperation.payload.progress_id
      : '',
  getProgressDetailId: (state) => state.operation.progressDetailId,
  getStartGas: (state) => state.operation.startGas,
  getEndGas: (state) => state.operation.endGas,
  getJumlahProduksi: (state) => state.operation.jumlahProduks,

  getKitchens: (state) => state.operation.listKitchen.payload || [],
  getBatchs: (state) => state.operation.listBatch.payload || [],
  getDetailBatch: (state) => state.operation.getDetailBatch.payload || [],
  getReasons: (state) => state.operation.getListReason.payload || [],
  getListOperation: (state) => state.operation.getListOperation.payload || [],

  getBatchRequest: (state) => state.operation.listBatch.data,
  getFinishMaterial: (state) => state.operation.getJumlahProduksi.payload || [],
  getFinishMaterialRes: (state) => state.operation.finishMaterial,
};

/* ------------- Reducers ------------- */

export const setWorking = (state, {data}) => {
  return {...state, isWorking: data};
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

  return {
    ...state,
    detailMaterial: data,
    getDetailBatch: {payload: arr},
  };
};

export const setFinishMaterial = (state, {data}) => {
  return {
    ...state,
    finishMaterial: data,
  };
};

export const addOperation = (state, {data}) => {
  return {...state, operations: [...state.operations, data]};
};

export const setCurrentOperation = (state, {data}) => {
  return {...state, currentOperation: data};
};

export const setStartGas = (state, {data}) => {
  return {...state, startGas: data};
};

export const setEndGas = (state, {data}) => {
  return {...state, endGas: data};
};

export const setJumlahProduksi = (state, {data}) => {
  return {...state, jumlahProduks: data};
};

export const removeOperationsReducer = (state) => {
  return {...state, ...INITIAL_STATE};
};

export const removeOperationsExcBatchReducer = (state) => {
  const listBatch = state.listBatch;
  const listKitchen = state.listKitchen;
  return {
    ...state,
    ...INITIAL_STATE,
    listBatch,
    listKitchen,
  };
};

export const getListBatchRequest = (state, {data}) => {
  return {...state, listBatch: {fetching: true, data}};
};
export const getListBatchSuccess = (state, {payload}) => {
  return {
    ...state,
    listBatch: {
      ...state.listBatch,
      fetching: false,
      error: null,
      payload: payload.batches,
    },
  };
};
export const getListBatchFailure = (state, {error}) => {
  return {...state, listBatch: {fetching: false, error}};
};

export const getListKitchenRequest = (state, {data}) => {
  return {...state, listKitchen: {fetching: true, data}};
};
export const getListKitchenSuccess = (state, {payload}) => {
  return {
    ...state,
    listKitchen: {fetching: false, error: null, payload: payload.kitchens},
  };
};
export const getListKitchenFailure = (state, {error}) => {
  return {...state, listKitchen: {fetching: false, error}};
};

export const startOperationRequest = (state, {data}) => {
  return {...state, startOperation: {fetching: true, data}};
};
export const startOperationSuccess = (state, {payload}) => {
  return {
    ...state,
    startOperation: {fetching: false, error: null, payload},
    progressDetailId: payload.progress_detail_id,
  };
};
export const startOperationFailure = (state, {error}) => {
  return {...state, startOperation: {fetching: false, error}};
};

export const stopOperationRequest = (state, {data}) => {
  return {...state, stopOperation: {fetching: true, data}};
};
export const stopOperationSuccess = (state, {payload}) => {
  return {
    ...state,
    stopOperation: {fetching: false, error: null, payload},
  };
};
export const stopOperationFailure = (state, {error}) => {
  return {...state, stopOperation: {fetching: false, error}};
};

export const finishOperationRequest = (state, {data}) => {
  return {...state, finishOperation: {fetching: true, data}};
};
export const finishOperationSuccess = (state, {payload}) => {
  return {
    ...state,
    finishOperation: {fetching: false, error: null, payload},
  };
};
export const finishOperationFailure = (state, {error}) => {
  return {...state, finishOperation: {fetching: false, error}};
};

export const getListReasonRequest = (state, {data}) => {
  return {...state, getListReason: {fetching: true, data}};
};
export const getListReasonSuccess = (state, {payload}) => {
  return {
    ...state,
    getListReason: {fetching: false, error: null, payload: payload.reasons},
  };
};
export const getListReasonFailure = (state, {error}) => {
  return {...state, getListReason: {fetching: false, error}};
};

export const getListOperationRequest = (state, {data}) => {
  return {...state, getListOperation: {fetching: true, data}};
};
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
  return {
    ...state,
    getListOperation: {
      fetching: false,
      error: null,
      payload: array,
    },
  };
};
export const getListOperationFailure = (state, {error}) => {
  return {...state, getListOperation: {fetching: false, error}};
};

export const beginOperationRequest = (state, {data}) => {
  return {...state, beginOperation: {fetching: true, data}};
};
export const beginOperationSuccess = (state, {payload}) => {
  return {
    ...state,
    beginOperation: {fetching: false, error: null, payload},
  };
};
export const beginOperationFailure = (state, {error}) => {
  return {...state, beginOperation: {fetching: false, error}};
};

export const getDetailBatchRequest = (state, {data}) => {
  return {...state, getDetailBatch: {fetching: true, data}};
};
export const getDetailBatchSuccess = (state, {payload}) => {
  const array = payload.detail.map((item) => {
    return {
      ...item,
      wod_qty_req: parseInt(item.wod_qty_req, 10),
    };
  });
  return {
    ...state,
    getDetailBatch: {fetching: false, error: null, payload: array},
  };
};
export const getDetailBatchFailure = (state, {error}) => {
  return {...state, getDetailBatch: {fetching: false, error}};
};

export const getJumlahProduksiRequest = (state, {data}) => {
  return {...state, getJumlahProduksi: {fetching: true, data}};
};
export const getJumlahProduksiSuccess = (state, {payload}) => {
  const array = payload.detail.map((item) => {
    return {
      ...item,
      wop_qty_open: parseInt(item.wop_qty_open, 10),
    };
  });
  return {
    ...state,
    getJumlahProduksi: {fetching: false, error: null, payload: array},
  };
};
export const getJumlahProduksiFailure = (state, {error}) => {
  return {...state, getJumlahProduksi: {fetching: false, error}};
};

export const updateBatchRequest = (state, {data}) => {
  return {...state, updateBatch: {fetching: true, data}};
};
export const updateBatchSuccess = (state, {payload}) => {
  return {
    ...state,
    updateBatch: {fetching: false, error: null, payload},
  };
};
export const updateBatchFailure = (state, {error}) => {
  return {...state, updateBatch: {fetching: false, error}};
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_WORKING]: setWorking,
  [Types.SET_DETAIL_MATERIAL]: setDetailMaterial,
  [Types.ADD_OPERATION]: addOperation,
  [Types.SET_CURRENT_OPERATION]: setCurrentOperation,
  [Types.SET_START_GAS]: setStartGas,
  [Types.SET_END_GAS]: setEndGas,
  [Types.SET_JUMLAH_PRODUKSI]: setJumlahProduksi,
  [Types.SET_FINISH_MATERIAL]: setFinishMaterial,

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

  [Types.GET_JUMLAH_PRODUKSI_REQUEST]: getJumlahProduksiRequest,
  [Types.GET_JUMLAH_PRODUKSI_SUCCESS]: getJumlahProduksiSuccess,
  [Types.GET_JUMLAH_PRODUKSI_FAILURE]: getJumlahProduksiFailure,

  [Types.GET_DETAIL_BATCH_REQUEST]: getDetailBatchRequest,
  [Types.GET_DETAIL_BATCH_SUCCESS]: getDetailBatchSuccess,
  [Types.GET_DETAIL_BATCH_FAILURE]: getDetailBatchFailure,

  [Types.UPDATE_BATCH_REQUEST]: updateBatchRequest,
  [Types.UPDATE_BATCH_SUCCESS]: updateBatchSuccess,
  [Types.UPDATE_BATCH_FAILURE]: updateBatchFailure,
});
