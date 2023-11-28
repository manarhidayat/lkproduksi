import LoadingHelper from '../Lib/LoadingHelper';
import {AuthTypes} from './AuthRedux';

const showLoadingActions = [
  // AUTH
  AuthTypes.LOGIN_REQUEST,


];

const hideLoadingActions = [
  // AUTH
  AuthTypes.DO_LOGIN_SUCCESS,
  AuthTypes.DO_LOGIN_FAILURE,

];

const actionsTracking = () => (next) => (action) => {
  if (showLoadingActions.includes(action.type)) {
    LoadingHelper.show();
  }

  if (hideLoadingActions.includes(action.type)) {
    LoadingHelper.hide();
  }

  return next(action);
};

export default actionsTracking;
