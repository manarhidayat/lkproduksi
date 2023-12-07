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

import {call, put, all, select} from 'redux-saga/effects';
import { TYPE_ONBOARDING } from '../Lib/Constans';
import { NAVIGATION_NAME } from '../Navigation/NavigationName';
import NavigationServices from '../Navigation/NavigationServices';

import OperationActions from '../Redux/OperationRedux';
import SessionActions from '../Redux/SessionRedux';

export function* getListBatch(api, action) {
  const {data} = action;
  const response = yield call(api.getListBatch, data);

  if (response.ok && response.data) {
    yield put(OperationActions.getListBatchSuccess(response.data));
  } else {
    yield put(OperationActions.getListBatchFailure(response));
  }
}

export function* getListKitchen(api, action) {
  const {data} = action;
  const response = yield call(api.getListKitchen, data);

  if (response.ok && response.data) {
    yield put(OperationActions.getListKitchenSuccess(response.data));
  } else {
    yield put(OperationActions.getListKitchenFailure(response));
  }
}

export function* startOperation(api, action) {
  const {data} = action;
  const response = yield call(api.startOperation, data);

  if (response.ok && response.data) {
    yield put(OperationActions.startOperationSuccess(response.data));
  } else {
    yield put(OperationActions.startOperationFailure(response));
  }
}

export function* stopOperation(api, action) {
  const {data} = action;
  const response = yield call(api.stopOperation, data);

  if (response.ok && response.data) {
    yield put(OperationActions.stopOperationSuccess(response.data));
  } else {
    yield put(OperationActions.stopOperationFailure(response));
  }
}

export function* finishOperation(api, action) {
  const {data} = action;
  const response = yield call(api.finishOperation, data);

  if (response.ok && response.data) {
    yield all([
      yield put(SessionActions.setTypeBoarding(TYPE_ONBOARDING.timeline)),
      yield put(OperationActions.finishOperationSuccess(response.data))
    ]);
    NavigationServices.navigate(NAVIGATION_NAME.PIC.timeline);
  } else {
    yield put(OperationActions.finishOperationFailure(response));
  }
}

export function* getListReason(api, action) {
  const {data} = action;
  const response = yield call(api.getListReason, data);

  if (response.ok && response.data) {
    yield put(OperationActions.getListReasonSuccess(response.data));
  } else {
    yield put(OperationActions.getListReasonFailure(response));
  }
}

export function* getListOperation(api, action) {
  const {data} = action;
  const response = yield call(api.getListOperation, data);

  if (response.ok && response.data) {
    yield put(OperationActions.getListOperationSuccess(response.data));
  } else {
    yield put(OperationActions.getListOperationFailure(response));
  }
}

export function* beginOperation(api, action) {
  const {data} = action;
  const response = yield call(api.beginOperation, data);

  if (response.ok && response.data) {
    // yield put(OperationActions.beginOperationSuccess(response.data));
    yield all([
      yield put(SessionActions.setTypeBoarding(TYPE_ONBOARDING.home)),
      yield put(OperationActions.beginOperationSuccess(response.data))
    ]);
    NavigationServices.navigate(NAVIGATION_NAME.PIC.home);
  } else {
    yield put(OperationActions.beginOperationFailure(response));
  }
}

export function* getDetailBatch(api, action) {
  const {data} = action;
  const response = yield call(api.getDetailBatch, data);

  if (response.ok && response.data) {
    yield put(OperationActions.getDetailBatchSuccess(response.data));
  } else {
    yield put(OperationActions.getDetailBatchFailure(response));
  }
}