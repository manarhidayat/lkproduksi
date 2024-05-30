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

export function* doLogin(api, action) {
  const {data} = action;

  LoadingHelper.show();
  const response = yield call(api.doLogin, data);
  LoadingHelper.hide();

  if (response.ok && response.data && response.data.status) {
    const {token} = response.data ? response.data : {};
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
    ]);
  } else {
    const message =
      response.data && response.data.message
        ? response.data.message
        : 'Gagal login, mohon periksa koneksi dan url Anda';
    Alert.alert('Peringatan', message);
    yield put(AuthActions.doLoginFailure(response));
  }
}

export function* changePassword(api, action) {
  const {data} = action;
  LoadingHelper.show();
  const response = yield call(api.changePassword, data);
  LoadingHelper.hide();

  if (response.ok) {
    yield all([yield put(AuthActions.changePasswordSuccess(response.data))]);
    Alert.alert('Sukses', 'Ubah Password Berhasil');
    NavigationServices.pop();
  } else {
    Alert.alert('Peringatan', 'Invalid usernama or password');
  }
  yield put(AuthActions.changePasswordFailure(response));
}
