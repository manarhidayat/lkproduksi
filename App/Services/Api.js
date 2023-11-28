// a library to wrap and simplify api calls
import apisauce from 'apisauce';

import {API_URL} from '../Lib/Constans';
import NavigationServices from '../Navigation/NavigationServices';
import AuthActions from '../Redux/AuthRedux';

import {NAVIGATION_NAME} from '../Navigation/NavigationName';
import StoreHelper from '../Services/StoreHelper';

// our "constructor"
const create = (baseURL = API_URL) => {
  // const create = (baseURL = ConfigAndroid.API_URL) => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    // 10 second timeout...
    timeout: 10000
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
            responsemessage: 'Silahkan Logout dan login kembali'
          };

          StoreHelper.dispatch(AuthActions.doLogOut());
          NavigationServices.dispatch(AuthActions.doLogOut());
          NavigationServices.push(NAVIGATION_NAME.AUTH.login);
        }
      }
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

  const doLogin = (data) => api.post(`/login`, data);
  const doLoginAzure = (data) => api.post(`/signin`, data);

  const getListActiveMachine = () => api.get(`/machine/active`);
  const getListItemOfMachine = (id) => api.get(`/machine/${id}/items`);
  const getListItemGoingToMaintenance = (data) => api.get(`/signin`, data);
  const postBundleActivity = (data) => api.post(`/activity`, data);
  const getListItemUse = (data) => api.get(`/signin`, data);
  const postUseRequest = (data) => api.post(`/signin`, data);
  const postReturnRequest = (data) => api.post(`/signin`, data);

  const getLocations = (data) => api.get(`/master/location/data`, data);

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
    doLoginAzure,

    getListActiveMachine,
    getListItemOfMachine,
    getListItemGoingToMaintenance,
    postBundleActivity,
    getListItemUse,
    postUseRequest,
    postReturnRequest,
    getLocations,

    api
  };
};

// let's return back our create method as the default.
export default {
  create
};