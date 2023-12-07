import {NAVIGATION_NAME} from '../Navigation/NavigationName';
import {Images} from '../Themes';

export const API_URL = 'http://122812301790.ip-dynamic.com:8888/api.lkp/';

export const JENIS_ACTIVITY = [
  {
    id: 1,
    name: 'jenis 1',
  },
  {
    id: 2,
    name: 'jenis 2',
  },
  {
    id: 3,
    name: 'jenis 3',
  },
];

export const JENIS_OPERASI = [
  {
    id: 1,
    name: 'Preparation',
  },
  {
    id: 2,
    name: 'Drilling',
  },
  {
    id: 3,
    name: 'Perbaikan',
  },
  {
    id: 4,
    name: 'Kemajuan bor',
  },
  {
    id: 5,
    name: 'Istirahat',
  },
];

export const TYPE_ONBOARDING = {
  selectBatch: NAVIGATION_NAME.PIC.selectBatch,
  timer: NAVIGATION_NAME.PIC.timer,
  home: NAVIGATION_NAME.PIC.home,
  timeline: NAVIGATION_NAME.PIC.timeline,
};

export const OPERATIONS = {
  charging: {
    name: 'Charging',
    icon: Images.charging,
  },
  burner: {
    name: 'Burner',
    icon: Images.burner,
  },
  mixing: {
    name: 'Mixing',
    icon: Images.mixing,
  },
  casting: {
    name: 'Casting',
    icon: Images.casting,
  },
  drossing: {
    name: 'Drossing',
    icon: Images.drossing,
  },
  sampling: {
    name: 'Sampling',
    icon: Images.sampling,
  },
  alloying: {
    name: 'Alloying',
    icon: Images.alloying,
  },
  fluxing: {
    name: 'Fluxing',
    icon: Images.fluxing,
  },
  transfer: {
    name: 'Transfer',
    icon: Images.transfer,
  },
  holding: {
    name: 'holding',
    icon: Images.holding,
  },
  degassing: {
    name: 'Degassing',
    icon: Images.degassing,
  },
};

export const OPERATIONS_TYPES = {
  charging: 'CHR',
  burner: 'BRN',
  mixing: 'MXG',

  casting: 'CST',
  drossing: 'DRS',
  sampling: 'SML',

  alloying: 'ALY',
  fluxing: 'FLX',
  transfer: 'TRF',

  holding: 'HLD',
  degassing: 'DGS',
};
