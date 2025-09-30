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
import LoadingHelper from '../Lib/LoadingHelper';

import InventoryActions from '../Redux/InventoryRedux';
import NavigationServices from '../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../Navigation/NavigationName';

export function* getEntity(api, action) {
  const {data} = action;
  const response = yield call(api.getEntity, data);
  // const response = {
  //   ok: true,
  //   data: [
  //     {
  //       en_id: '1',
  //       en_code: '10',
  //       en_desc: 'Alumindo',
  //     },
  //     {
  //       en_id: '2',
  //       en_code: '11',
  //       en_desc: 'Alumindi',
  //     },
  //   ],
  // };

  if (response.ok && response.data) {
    yield put(InventoryActions.getEntitySuccess(response.data.data));
  } else {
    yield put(InventoryActions.getEntityFailure(response));
  }
}

export function* getBranch(api, action) {
  const {data} = action;
  const response = yield call(api.getBranch, data);

  if (response.ok && response.data) {
    yield put(InventoryActions.getBranchSuccess(response.data.data));
  } else {
    yield put(InventoryActions.getBranchFailure(response));
  }
}

export function* getCustomer(api, action) {
  const {data} = action;
  const response = yield call(api.getCustomer, data);

  if (response.ok && response.data) {
    yield put(InventoryActions.getCustomerSuccess(response.data.data));
  } else {
    yield put(InventoryActions.getCustomerFailure(response));
  }
}

export function* createCheckseet(api, action) {
  const {data} = action;
  const response = yield call(api.createCheckseet, data);

  if (response.ok && response.data) {
    yield put(InventoryActions.createCheckseetSuccess(response.data));
    NavigationServices.replace(NAVIGATION_NAME.HOME.detailChecksheet, {
      chksheet_oid: response.data.checksheet_oid,
      chksheet_en_id: data.en_id,
    });
  } else {
    yield put(InventoryActions.createCheckseetFailure(response));
  }
}

export function* updateCheckseet(api, action) {
  const {data} = action;
  const response = yield call(api.updateCheckseet, data);

  if (response.ok && response.data) {
    yield put(InventoryActions.updateCheckseetSuccess(response.data));
    // NavigationServices.pop();
    NavigationServices.replace(NAVIGATION_NAME.HOME.detailChecksheet, {
      chksheet_oid: response.data.checksheet_oid,
      chksheet_en_id: data.en_id,
    });
  } else {
    yield put(InventoryActions.updateCheckseetFailure(response));
  }
}

export function* deleteCheckseet(api, action) {
  const {data, callback} = action;
  const response = yield call(api.deleteCheckseet, data);

  if (response.ok && response.data) {
    if (callback) {
      callback();
    }
    yield put(InventoryActions.deleteCheckseetSuccess(response.data));
  } else {
    yield put(InventoryActions.deleteCheckseetFailure(response));
  }
}

export function* getBarang(api, action) {
  const {data} = action;
  const response = yield call(api.getBarang, data);

  if (response.ok && response.data) {
    yield put(InventoryActions.getBarangSuccess(response.data.data));
  } else {
    yield put(InventoryActions.getBarangFailure(response));
  }
}

export function* getLocation(api, action) {
  const {data} = action;
  const response = yield call(api.getLocation, data);

  if (response.ok && response.data) {
    yield put(InventoryActions.getLocationSuccess(response.data.data));
  } else {
    yield put(InventoryActions.getLocationFailure(response));
  }
}

export function* getChecksheet(api, action) {
  const {data} = action;
  const response = yield call(api.getChecksheet, data);

  if (response.ok && response.data) {
    yield put(InventoryActions.getChecksheetSuccess(response.data.data));
  } else {
    yield put(InventoryActions.getChecksheetFailure(response));
  }
}

export function* getChecksheetDetail(api, action) {
  const {data} = action;
  const response = yield call(api.getChecksheetDetail, data);

  if (response.ok && response.data) {
    yield put(InventoryActions.getChecksheetDetailSuccess(response.data.data));
  } else {
    yield put(InventoryActions.getChecksheetDetailFailure(response));
  }
}

export function* createChecksheetDetail(api, action) {
  const {data} = action;
  const response = yield call(api.createChecksheetDetail, data);

  if (response.ok && response.data) {
    yield put(InventoryActions.createChecksheetDetailSuccess(response.data));
    NavigationServices.pop();
  } else {
    yield put(InventoryActions.createChecksheetDetailFailure(response));
  }
}

export function* updateChecksheetDetail(api, action) {
  const {data} = action;
  const response = yield call(api.updateChecksheetDetail, data);

  if (response.ok && response.data) {
    yield put(InventoryActions.updateChecksheetDetailSuccess(response.data));
    NavigationServices.pop();
  } else {
    yield put(InventoryActions.updateChecksheetDetailFailure(response));
  }
}

export function* deleteChecksheetDetail(api, action) {
  const {data, callback} = action;
  const response = yield call(api.deleteChecksheetDetail, data);

  if (response.ok && response.data) {
    if (callback) {
      callback();
    }
    yield put(InventoryActions.deleteChecksheetDetailSuccess(response.data));
  } else {
    yield put(InventoryActions.deleteChecksheetDetailFailure(response));
  }
}

export function* createChecksheetSerial(api, action) {
  const {data, callback} = action;
  const response = yield call(api.createChecksheetSerial, data);

  if (response.ok && response.data) {
    yield put(InventoryActions.createChecksheetSerialSuccess(response.data));
    if (callback) {
      callback(response.data);
    } else {
      NavigationServices.pop();
    }
  } else {
    yield put(InventoryActions.createChecksheetSerialFailure(response));
  }
}

export function* updateChecksheetSerial(api, action) {
  const {data} = action;
  const response = yield call(api.updateChecksheetSerial, data);

  if (response.ok && response.data) {
    yield put(InventoryActions.updateChecksheetSerialSuccess(response.data));
    NavigationServices.pop();
  } else {
    yield put(InventoryActions.updateChecksheetSerialFailure(response));
  }
}

export function* deleteChecksheetSerial(api, action) {
  const {data, callback} = action;
  const response = yield call(api.deleteChecksheetSerial, data);

  if (response.ok && response.data) {
    if (callback) {
      callback();
    }
    yield put(InventoryActions.deleteChecksheetSerialSuccess(response.data));
  } else {
    yield put(InventoryActions.deleteChecksheetSerialFailure(response));
  }
}
