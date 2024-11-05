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

import {Alert} from 'react-native';
import {call, put, all, select} from 'redux-saga/effects';
import {NAVIGATION_NAME} from '../Navigation/NavigationName';
import NavigationServices from '../Navigation/NavigationServices';

import OperationActions from '../Redux/OperationRedux';
import SessionActions from '../Redux/SessionRedux';
import LoadingHelper from '../Lib/LoadingHelper';

export function* postOperation(api, action) {
  const {data, callback} = action;
  LoadingHelper.show();
  const response = yield call(api.postOperation, data);
  LoadingHelper.hide();

  if (response.ok) {
    if (callback) {
      if (response.data.status) {
        callback(response.data.status);
        yield put(OperationActions.postOperationSuccess(response.data));
      } else {
        Alert.alert('', response.data.message);
        yield put(OperationActions.postOperationFailure(response));
      }
    }
  } else {
    Alert.alert('', 'Penyimpanan gagal, periksa koneksi Anda');
    yield put(OperationActions.postOperationFailure(response));
  }
}

export function* postLoading(api, action) {
  const {data, callback} = action;
  LoadingHelper.show();
  const response = yield call(api.postLoading, data);
  LoadingHelper.hide();

  if (response.ok) {
    yield put(OperationActions.postLoadingSuccess(response.data));
    if (callback) {
      callback(response.data.status, response.data.message);
    }
  } else {
    Alert.alert('', 'Penyimpanan gagal, periksa koneksi Anda');
    yield put(OperationActions.postLoadingFailure(response));
  }
}

export function* getLocations(api, action) {
  const {data, callback} = action;
  const response = yield call(api.getLocations, data);

  if (response.ok && response.data) {
    yield put(OperationActions.getLocationsSuccess(response.data.data));
    if (callback) {
      callback();
    }
  } else {
    Alert.alert('', 'Penyimpanan gagal, periksa koneksi Anda');
    yield put(OperationActions.getLocationsFailure(response));
  }
}

export function* getReports(api, action) {
  const {data, callback} = action;
  LoadingHelper.show();
  const response = yield call(api.getReports, data);
  LoadingHelper.hide();

  if (response.ok && response.data) {
    yield put(OperationActions.getReportsSuccess(response.data.data));
    if (callback) {
      callback();
    }
  } else {
    Alert.alert('', 'Penyimpanan gagal, periksa koneksi Anda');
    yield put(OperationActions.getReportsFailure(response));
  }
}

export function* getSetupLoading(api, action) {
  const {data, callback} = action;
  LoadingHelper.show();
  const response = yield call(api.getSetupLoading, data);
  LoadingHelper.hide();

  if (response.ok && response.data) {
    yield put(OperationActions.getSetupLoadingSuccess(response.data.data));
    if (callback) {
      callback();
    }
  } else {
    Alert.alert('', 'Penyimpanan gagal, periksa koneksi Anda');
    yield put(OperationActions.getSetupLoadingFailure(response));
  }
}

export function* searchQR(api, action) {
  const {data, callback} = action;
  // LoadingHelper.show();
  const response = yield call(api.searchQR, data);
  if (callback) {
    callback();
  }
  // LoadingHelper.hide();

  if (response.ok && response.data) {
    yield put(OperationActions.searchQRSuccess(response.data.data));
  } else {
    Alert.alert('', 'Penyimpanan gagal, periksa koneksi Anda');
    yield put(OperationActions.searchQRFailure(response));
  }
}
