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

import UseActions from '../Redux/UseRedux';

import NavigationServices from '../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../Navigation/NavigationName';

export function* getListItemUse(api, action) {
  const {data} = action;
  const response = yield call(api.getListItemUse, data);

  if (response.ok) {
    yield put(UseActions.getListItemUseSuccess(response.data));
  } else {
    yield put(UseActions.getListItemUseFailure(response));
  }
}

export function* postUse(api, action) {
  const {data} = action;
  const response = yield call(api.postUse, data);

  if (response.ok) {
    yield put(UseActions.postUseSuccess(response.data));
  } else {
    yield put(UseActions.postUseFailure(response));
  }
}

export function* postReturn(api, action) {
  const {data} = action;
  const response = yield call(api.postReturn, data);

  if (response.ok) {
    yield put(UseActions.postReturnSuccess(response.data));
  } else {
    yield put(UseActions.postReturnFailure(response));
  }
}
