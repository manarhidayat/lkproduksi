import {takeLatest, all} from 'redux-saga/effects';
import API from '../Services/Api';

/* ------------- Types ------------- */

import {StartupTypes} from '../Redux/StartupRedux';
import {AuthTypes} from '../Redux/AuthRedux';
import {OperationTypes} from '../Redux/OperationRedux';
import {DashboardTypes} from '../Redux/DashboardRedux';
import {ApprovalTypes} from '../Redux/ApprovalRedux';

/* ------------- Sagas ------------- */

import {startup} from './StartupSagas';
import {doLogin, changePassword} from './AuthSagas';

import {
  getListBatch,
  getListKitchen,
  startOperation,
  stopOperation,
  finishOperation,
  getListReason,
  beginOperation,
  getDetailBatch,
  getListOperation,
  getJumlahProduksi,
  updateBatch,
  resetBatch,
  updateOperation,
} from './OperationSagas';
import {approve, decline} from './ApprovalSagas';
import {getResumeBatch, getTimelineBatch} from './DashboardSagas';

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup, api),

    takeLatest(AuthTypes.LOGIN_REQUEST, doLogin, api),
    takeLatest(AuthTypes.CHANGE_PASSWORD_REQUEST, changePassword, api),

    takeLatest(OperationTypes.GET_LIST_BATCH_REQUEST, getListBatch, api),
    takeLatest(OperationTypes.GET_LIST_KITCHEN_REQUEST, getListKitchen, api),
    takeLatest(OperationTypes.START_OPERATION_REQUEST, startOperation, api),
    takeLatest(OperationTypes.STOP_OPERATION_REQUEST, stopOperation, api),
    takeLatest(OperationTypes.FINISH_OPERATION_REQUEST, finishOperation, api),

    takeLatest(OperationTypes.GET_LIST_REASON_REQUEST, getListReason, api),
    takeLatest(
      OperationTypes.GET_LIST_OPERATION_REQUEST,
      getListOperation,
      api
    ),
    takeLatest(OperationTypes.BEGIN_OPERATION_REQUEST, beginOperation, api),
    takeLatest(OperationTypes.GET_DETAIL_BATCH_REQUEST, getDetailBatch, api),
    takeLatest(
      OperationTypes.GET_JUMLAH_PRODUKSI_REQUEST,
      getJumlahProduksi,
      api
    ),
    takeLatest(OperationTypes.UPDATE_BATCH_REQUEST, updateBatch, api),
    takeLatest(OperationTypes.RESET_BATCH_REQUEST, resetBatch, api),

    takeLatest(OperationTypes.UPDATE_OPERATION_REQUEST, updateOperation, api),

    takeLatest(DashboardTypes.GET_RESUME_BATCH_REQUEST, getResumeBatch, api),
    takeLatest(
      DashboardTypes.GET_TIMELINE_BATCH_REQUEST,
      getTimelineBatch,
      api
    ),

    takeLatest(ApprovalTypes.APPROVE_REQUEST, approve, api),
    takeLatest(ApprovalTypes.DECLINE_REQUEST, decline, api),
  ]);
}
