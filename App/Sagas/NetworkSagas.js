import {put, take, call, select} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';
import NetInfo from '@react-native-community/netinfo';
import {Alert} from 'react-native';
import DropDownHolder from '../Components/DropDownHolder';
import {batch} from 'react-redux';
import StoreHelper from '../Services/StoreHelper';
import ActivityActions from '../Redux/ActivityRedux';
import NetworkActions, {NetworkSelectors} from '../Redux/NetworkRedux';

const NETWORK_ACTION = {
  STATE_CHANGE: 'state-change'
};

export function networkStateHandler() {
  return eventChannel((emit) => {
    const onConnectionStateChange = (payload) => {
      emit({type: NETWORK_ACTION.STATE_CHANGE, payload});
    };

    const unsubscribe = NetInfo.addEventListener((networkState) => {
      onConnectionStateChange(networkState);
    });

    // Unsubscribe
    return unsubscribe;
  });
}

export function* networkListener() {
  const networkState = yield NetInfo.fetch();
  yield put(NetworkActions.updateNetworkStatus(networkState));

  if (networkState.isConnected === false) {
    DropDownHolder.alert(
      'error',
      "Tidak ada internet",
      "Periksa internet Anda"
    );
  }

  const networkStateEvent = yield call(networkStateHandler);

  try {
    while (true) {
      const eventPayload = yield take(networkStateEvent);
      const {type, payload} = eventPayload;
      switch (type) {
        case NETWORK_ACTION.STATE_CHANGE: {
          const isConnected = yield select(NetworkSelectors.getNetworkStatus);
          if (isConnected === false && payload.isConnected === true) {
            DropDownHolder.alert(
              'info',
              "Koneksi kembali",
              "Internet kembali nyala"
            );
            batch(() => {
              StoreHelper.dispatch(ActivityActions.uploadActivity());
            });
          }

          if (isConnected === true && payload.isConnected === false) {
            DropDownHolder.alert(
              'error',
              "Tidak ada internet",
              "Periksa internet Anda"
            );
          }

          if (isConnected !== payload.isConnected) {
            yield put(NetworkActions.updateNetworkStatus(payload));
          }
          break;
        }
        default: {
          break;
        }
      }
    }
  } catch (error) {
    console.tron.error('NETWORK LISTENER SAGAS ERROR');
  }
}
