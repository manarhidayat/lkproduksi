import {select, fork} from 'redux-saga/effects';
import {SessionSelectors} from '../Redux/SessionRedux';
import ActivityActions from '../Redux/ActivityRedux';
import {networkListener} from './NetworkSagas';
import StoreHelper from '../Services/StoreHelper';

export function* startup(api) {
  const isLogin = yield select(SessionSelectors.isLogin);
  if (isLogin) {
    const headers = yield select(SessionSelectors.selectHeader);
    if (headers) {
      api.api.setHeaders({
        ...headers,
      });
    }

    yield fork(networkListener);
    StoreHelper.dispatch(ActivityActions.uploadActivity());

    // const selectBoarding = yield select(SessionSelectors.selectBoarding);

    // if (selectBoarding === TYPE_ONBOARDING.home) {
    //   NavigationServices.navigate(NAVIGATION_NAME.HOME.home);
    // } else if (selectBoarding === TYPE_ONBOARDING.chooseMachine) {
    //   NavigationServices.navigate(NAVIGATION_NAME.HOME.chooseMachine);
    // }
  }
}
