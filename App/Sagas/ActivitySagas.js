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

import ActivityActions, {ActivitySelectors} from '../Redux/ActivityRedux';
import MachineActions from '../Redux/MachineRedux';
import {SessionSelectors} from '../Redux/SessionRedux';

import NavigationServices from '../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../Navigation/NavigationName';
import {SupportToolsSelectors} from '../Redux/SupportToolsRedux';

export function* uploadActivity() {
  const activitiesNotUploaded = yield select(
    ActivitySelectors.getActivitieNotUploaded,
    {}
  );

  if (activitiesNotUploaded.length > 0) {
    const activity = activitiesNotUploaded[0];

    const machine = yield select(SessionSelectors.selectMachine, {});
    const location = yield select(SessionSelectors.selectLocation, {});

    const supportTools = yield select(
      SupportToolsSelectors.getListSupportTools,
      {activity_id: activity.id}
    );

    const params = {
      name: activity.name,
      machine_id: machine.id,
      location_id: location.id,
      desc: activity.desc,
      start: `${activity.start_date}:00`,
      end: `${activity.end_date}:00`,
      type: activity.operasi.name,
      items: supportTools
        ? supportTools.map((item) => {
            return {
              active_id: item.inventory.id,
              used: item.jumlah,
            };
          })
        : []
    };
    yield put(ActivityActions.postActivityRequest({params, activity}));
  }
}

export function* postActivity(api, action) {
  const {data} = action;
  const {params, activity} = data;
  const response = yield call(api.postBundleActivity, params);

  if (response.ok && response.data) {
    const payload = {...activity, isUpload: true};

    const machine = yield select(SessionSelectors.selectMachine, {});

    yield put(ActivityActions.editActivity(payload));
    yield put(ActivityActions.postActivitySuccess(response.data));
    yield put(MachineActions.getListItemOfMachineRequest(machine.id));

    if (activity.id) {
      yield* uploadActivity();
    }
  } else {
    yield put(ActivityActions.postActivityFailure(response));
  }
}

export function* getLocations(api, action) {
  const {data} = action;
  const response = yield call(api.getLocations, data);

  if (response.ok && response.data && response.data.data) {
    yield put(ActivityActions.getLocationsSuccess(response.data.data));
  } else {
    yield put(ActivityActions.getLocationsFailure(response));
  }
}
