// a library to wrap and simplify api calls
import apisauce from 'apisauce';

import {API_URL} from '../Lib/Constans';
import NavigationServices from '../Navigation/NavigationServices';
import AuthActions from '../Redux/AuthRedux';

import {NAVIGATION_NAME} from '../Navigation/NavigationName';
import StoreHelper from '../Services/StoreHelper';
import MMKVStoragePersistHelper from '../Lib/MMKVStoragePersistHelper';
import {Alert} from 'react-native';

// our "constructor"
const create = (baseURL = API_URL) => {
  // const create = (baseURL = ConfigAndroid.API_URL) => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const url = MMKVStoragePersistHelper.getString('url');
  const api = apisauce.create({
    // base URL is read from the "constructor"
    // baseURL: baseURL,
    baseURL: url,
    // here are some default headers
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    // 10 second timeout...
    timeout: 10000,
  });

  api.addResponseTransform((response) => {
    if (response.ok) {
      if (response.data) {
        if (
          response.data.responsemessage &&
          response.data.responsemessage === 'Session Expired'
        ) {
          response.data = {
            responsecode: '0',
            responsemessage: 'Silahkan Logout dan login kembali',
          };

          StoreHelper.dispatch(AuthActions.doLogOut());
          NavigationServices.dispatch(AuthActions.doLogOut());
          NavigationServices.push(NAVIGATION_NAME.AUTH.login);
        }
      } else {
        Alert.alert('server error / tidak bisa menghubungkan ke server');
      }
    } else {
      Alert.alert('server error / tidak bisa menghubungkan ke server');
    }
  });

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //

  const doLogin = (data) => api.post('/public/auth/login', data);
  const changePassword = (data) =>
    api.post('/public/auth/changePassword', data);

  const getEntity = (data) => api.get('/public/common/entity', data);
  const getBranch = (data) => api.get('/public/common/branch', data);
  const getCustomer = (data) => api.get('/public/common/customer', data);
  const createCheckseet = (data) => api.post('/public/checksheet/create', data);
  const updateCheckseet = (data) => api.post('/public/checksheet/update', data);
  const deleteCheckseet = (data) => api.post('/public/checksheet/delete', data);

  const getBarang = (data) => api.get('/public/common/barang', data);
  const getLocation = (data) => api.get('/public/common/location', data);
  const getChecksheet = (data) => api.get('/public/checksheet', data);
  const getChecksheetDetail = (data) =>
    api.get(`/public/checksheet/detail/${data}`, data);
  const createChecksheetDetail = (data) =>
    api.post('/public/checksheet/create_detail', data);
  const updateChecksheetDetail = (data) =>
    api.post('/public/checksheet/update_detail', data);
  const deleteChecksheetDetail = (data) =>
    api.post('/public/checksheet/delete_detail', data);
  const createChecksheetSerial = (data) =>
    api.post('/public/checksheet/create_serial', data);
  const updateChecksheetSerial = (data) =>
    api.post('/public/checksheet/update_serial', data);
  const deleteChecksheetSerial = (data) =>
    api.post('/public/checksheet/delete_serial', data);
  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    doLogin,
    changePassword,

    getEntity,
    getBranch,
    getCustomer,
    createCheckseet,
    updateCheckseet,
    deleteCheckseet,
    getBarang,
    getLocation,
    getChecksheet,
    getChecksheetDetail,
    createChecksheetDetail,
    updateChecksheetDetail,
    deleteChecksheetDetail,
    createChecksheetSerial,
    updateChecksheetSerial,
    deleteChecksheetSerial,

    api,
  };
};

// let's return back our create method as the default.
export default {
  create,
};
