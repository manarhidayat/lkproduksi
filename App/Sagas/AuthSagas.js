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
import {Alert} from 'react-native';
import AuthActions from '../Redux/AuthRedux';
import SessionActions from '../Redux/SessionRedux';

import NavigationServices from '../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../Navigation/NavigationName';
import LoadingHelper from '../Lib/LoadingHelper';
import {TYPE_ONBOARDING} from '../Lib/Constans';

export function* doLogin(api, action) {
  const {data} = action;

  LoadingHelper.show();
  const response = yield call(api.doLogin, data);
  LoadingHelper.hide();

  if (response.ok) {
    const {token, data} = response.data ? response.data : {};
    api.api.setHeaders({
      Authorization: `Bearer ${token}`,
    });
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    yield all([
      yield put(AuthActions.doLoginSuccess(response.data)),
      yield put(SessionActions.saveUserHeaders(headers)),
      yield put(SessionActions.setLogin(true)),
      yield put(SessionActions.saveUserData(data)),
      yield put(SessionActions.setTypeBoarding(TYPE_ONBOARDING.selectBatch)),
    ]);
  } else {
    const message =
      response.data && response.data.error
        ? response.data.error
        : 'Login Gagal';
    Alert.alert('Peringatan', message);
    yield put(AuthActions.doLoginFailure(response));
  }
}

export function* doLoginAzure(api, action) {
  const {data} = action;
  const response = yield call(api.doLoginAzure, data);

  if (response.ok) {
    const {token, user, role} = response.data ? response.data.data : {};
    api.api.setHeaders({
      token,
    });
    const headers = {
      token,
    };

    yield all([
      yield put(AuthActions.doLoginSuccess(response.data)),
      yield put(SessionActions.saveUserData(user)),
      yield put(SessionActions.saveUserRole(role)),
      yield put(SessionActions.saveUserHeaders(headers)),
      yield put(SessionActions.setLogin(true)),
    ]);
  } else {
    Alert.alert('Peringatan', 'Login gagal');
  }
  yield put(AuthActions.doLoginAzureFailure(response));
}
