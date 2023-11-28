/* ***********************************************************
 * A short word on how to use this automagically generated file.
 * We're often asked in the ignite gitter channel how to connect
 * to a to a third party api, so we thought we'd demonstrate - but
 * you should know you can use sagas for other flow control too.
 *
 * Other points:
 *  - You'll need to add this saga to sagas/index.js
 *  - This template uses the api declared in sagas/index.js, so
 *    you'll need to define a constant in that file.
 *************************************************************/

import {call, put, all} from 'redux-saga/effects';

import MachineActions from '../Redux/MachineRedux';
import InventoryActions from '../Redux/InventoryRedux';

import NavigationServices from '../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../Navigation/NavigationName';
import LoadingHelper from '../Lib/LoadingHelper';

export function* getListActiveMachine(api, action) {
  const {data} = action;
  const response = yield call(api.getListActiveMachine, data);

  if (response.ok && response.data && response.data.data) {
    yield put(MachineActions.getListActiveMachineSuccess(response.data.data));
  } else {
    yield put(MachineActions.getListActiveMachineFailure(response));
  }
}

export function* getListItemOfMachine(api, action) {
  const {data} = action;
  LoadingHelper.show();
  const response = yield call(api.getListItemOfMachine, data);
  LoadingHelper.hide();

  if (response.ok && response.data && response.data.data) {
    yield all([
      yield put(MachineActions.getListItemOfMachineSuccess(response.data)),
      yield put(InventoryActions.saveAllInventory(response.data.data))
    ]);
  } else {
    yield put(MachineActions.getListItemOfMachineFailure(response));
  }
}

export function* getListItemGoingToMaintenance(api, action) {
  const {data} = action;
  const response = yield call(api.getListItemGoingToMaintenance, data);
      Bı
  if (response.ok) {
    yield put( 
      MachineActions.getListItemGoingToMaintenanceSuccess(response.data)
    );
  } else {
    yield put(MachineActions.getListItemGoingToMaintenanceFailure(response));
  }
}
