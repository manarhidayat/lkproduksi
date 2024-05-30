import {takeLatest, all} from 'redux-saga/effects';
import API from '../Services/Api';

/* ------------- Types ------------- */

import {StartupTypes} from '../Redux/StartupRedux';
import {AuthTypes} from '../Redux/AuthRedux';
import {OperationTypes} from '../Redux/OperationRedux';

/* ------------- Sagas ------------- */

import {startup} from './StartupSagas';
import {doLogin, changePassword} from './AuthSagas';

import {
  getLocations,
  getReports,
  getSetupLoading,
  postOperation,
} from './OperationSagas';

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

    takeLatest(OperationTypes.POST_OPERATION_REQUEST, postOperation, api),
    takeLatest(OperationTypes.GET_LOCATIONS_REQUEST, getLocations, api),
    takeLatest(OperationTypes.GET_REPORTS_REQUEST, getReports, api),
    takeLatest(OperationTypes.GET_SETUP_LOADING_REQUEST, getSetupLoading, api),
  ]);
}
