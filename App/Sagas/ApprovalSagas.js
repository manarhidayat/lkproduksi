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
import NavigationServices from '../Navigation/NavigationServices';

import ApprovalActions from '../Redux/ApprovalRedux';
import DashboardActions, {DashboardSelectors} from '../Redux/DashboardRedux';

export function* approve(api, action) {
  const {data} = action;
  const response = yield call(api.approve, data);

  if (response.ok && response.data) {
    yield put(ApprovalActions.approveSuccess(response.data));
    const resumeRequest = yield select(DashboardSelectors.getResumeRequest, {});
    const {start_date, end_date} = resumeRequest;

    yield put(DashboardActions.getResumeBatchRequest({start_date, end_date}));
    NavigationServices.pop();
  } else {
    yield put(ApprovalActions.approveFailure(response));
  }
}

export function* decline(api, action) {
  const {data} = action;
  const response = yield call(api.decline, data);

  if (response.ok && response.data) {
    yield put(ApprovalActions.declineSuccess(response.data));
    NavigationServices.pop();
    const resumeRequest = yield select(DashboardSelectors.getResumeRequest, {});
    const {start_date, end_date} = resumeRequest;

    yield put(DashboardActions.getResumeBatchRequest({start_date, end_date}));
  } else {
    yield put(ApprovalActions.declineFailure(response));
  }
}
