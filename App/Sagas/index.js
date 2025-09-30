import {takeLatest, all} from 'redux-saga/effects';
import API from '../Services/Api';

/* ------------- Types ------------- */

import {StartupTypes} from '../Redux/StartupRedux';
import {AuthTypes} from '../Redux/AuthRedux';
import {InventoryTypes} from '../Redux/InventoryRedux';

/* ------------- Sagas ------------- */

import {startup} from './StartupSagas';
import {doLogin, changePassword} from './AuthSagas';

import {
  getEntity,
  getBranch,
  getCustomer,
  createCheckseet,
  getBarang,
  getLocation,
  getChecksheet,
  getChecksheetDetail,
  createChecksheetDetail,
  createChecksheetSerial,
  updateChecksheetSerial,
  deleteChecksheetSerial,
  deleteChecksheetDetail,
  updateChecksheetDetail,
  deleteCheckseet,
  updateCheckseet,
} from './InventorySagas';

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

    takeLatest(InventoryTypes.GET_ENTITY_REQUEST, getEntity, api),
    takeLatest(InventoryTypes.GET_BRANCH_REQUEST, getBranch, api),
    takeLatest(InventoryTypes.GET_CUSTOMER_REQUEST, getCustomer, api),
    takeLatest(InventoryTypes.CREATE_CHECKSEET_REQUEST, createCheckseet, api),
    takeLatest(InventoryTypes.UPDATE_CHECKSEET_REQUEST, updateCheckseet, api),
    takeLatest(InventoryTypes.DELETE_CHECKSEET_REQUEST, deleteCheckseet, api),
    takeLatest(InventoryTypes.GET_BARANG_REQUEST, getBarang, api),
    takeLatest(InventoryTypes.GET_LOCATION_REQUEST, getLocation, api),
    takeLatest(InventoryTypes.GET_CHECKSHEET_REQUEST, getChecksheet, api),
    takeLatest(
      InventoryTypes.GET_CHECKSHEET_DETAIL_REQUEST,
      getChecksheetDetail,
      api
    ),
    takeLatest(
      InventoryTypes.CREATE_CHECKSHEET_DETAIL_REQUEST,
      createChecksheetDetail,
      api
    ),
    takeLatest(
      InventoryTypes.UPDATE_CHECKSHEET_DETAIL_REQUEST,
      updateChecksheetDetail,
      api
    ),
    takeLatest(
      InventoryTypes.DELETE_CHECKSHEET_DETAIL_REQUEST,
      deleteChecksheetDetail,
      api
    ),
    takeLatest(
      InventoryTypes.CREATE_CHECKSHEET_SERIAL_REQUEST,
      createChecksheetSerial,
      api
    ),
    takeLatest(
      InventoryTypes.UPDATE_CHECKSHEET_SERIAL_REQUEST,
      updateChecksheetSerial,
      api
    ),
    takeLatest(
      InventoryTypes.DELETE_CHECKSHEET_SERIAL_REQUEST,
      deleteChecksheetSerial,
      api
    ),
  ]);
}
