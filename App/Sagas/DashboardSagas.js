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

import DashboardActions from '../Redux/DashboardRedux';

export function* getResumeBatch(api, action) {
  const {data} = action;
  const response = yield call(api.getResumeBatch, data);

  if (response.ok && response.data) {
    yield put(DashboardActions.getResumeBatchSuccess(response.data));
  } else {
    yield put(DashboardActions.getResumeBatchFailure(response));
  }
}

export function* getTimelineBatch(api, action) {
  const {data} = action;
  const response = yield call(api.getTimelineBatch, data);

  if (response.ok && response.data) {
    yield put(DashboardActions.getTimelineBatchSuccess(response.data));
  } else {
    yield put(DashboardActions.getTimelineBatchFailure(response));
  }
}
