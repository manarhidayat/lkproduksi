import {select, fork} from 'redux-saga/effects';
import {SessionSelectors} from '../Redux/SessionRedux';
import {networkListener} from './NetworkSagas';
import StoreHelper from '../Services/StoreHelper';

export function* startup(api) {
  const isLogin = yield select(SessionSelectors.isLogin);
  if (isLogin) {
    const headers = yield select(SessionSelectors.selectHeader);
    if (headers && !headers.Authorization.includes('undefined')) {
      console.tron.log('wew headers', headers);
      api.api.setHeaders({
        ...headers,
      });
    }

    yield fork(networkListener);
  }
}
