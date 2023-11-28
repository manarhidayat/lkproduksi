import {takeLatest, all} from 'redux-saga/effects';
import API from '../Services/Api';

/* ------------- Types ------------- */

import {StartupTypes} from '../Redux/StartupRedux';
import {AuthTypes} from '../Redux/AuthRedux';
import {ActivityTypes} from '../Redux/ActivityRedux';
import {MachineTypes} from '../Redux/MachineRedux';
import {UseTypes} from '../Redux/UseRedux';

/* ------------- Sagas ------------- */

import {startup} from './StartupSagas';
import {doLogin, doLoginAzure} from './AuthSagas';
import {postActivity, getLocations, uploadActivity} from './ActivitySagas';
import {
  getListActiveMachine,
  getListItemGoingToMaintenance,
  getListItemOfMachine
} from './MachineSagas';
import {getListItemUse, postUse, postReturn} from './UseSagas';

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
    takeLatest(AuthTypes.DO_LOGIN_AZURE_REQUEST, doLoginAzure, api),

    takeLatest(ActivityTypes.POST_ACTIVITY_REQUEST, postActivity, api),
    takeLatest(ActivityTypes.UPLOAD_ACTIVITY, uploadActivity, api),
    takeLatest(ActivityTypes.GET_LOCATIONS_REQUEST, getLocations, api),

    takeLatest(
      MachineTypes.GET_LIST_ACTIVE_MACHINE_REQUEST,
      getListActiveMachine,
      api
    ),
    takeLatest(
      MachineTypes.GET_LIST_ITEM_OF_MACHINE_REQUEST,
      getListItemOfMachine,
      api
    ),
    takeLatest(
      MachineTypes.GET_LIST_ITEM_GOING_TO_MAINTENANCE_REQUEST,
      getListItemGoingToMaintenance,
      api
    ),

    takeLatest(UseTypes.GET_LIST_ITEM_USE_REQUEST, getListItemUse, api),
    takeLatest(UseTypes.POST_USE_REQUEST, postUse, api),
    takeLatest(UseTypes.POST_RETURN_REQUEST, postReturn, api)
  ]);
}
