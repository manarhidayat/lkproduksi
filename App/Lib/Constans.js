import {NAVIGATION_NAME} from '../Navigation/NavigationName';
import { Images } from '../Themes';

export const API_URL = 'https://ams.penggiat-riset5.com/api/';

export const JENIS_ACTIVITY = [
  {
    id: 1,
    name: 'jenis 1'
  },
  {
    id: 2,
    name: 'jenis 2'
  },
  {
    id: 3,
    name: 'jenis 3'
  }
];

export const JENIS_OPERASI = [
  {
    id: 1,
    name: 'Preparation'
  },
  {
    id: 2,
    name: 'Drilling'
  },
  {
    id: 3,
    name: 'Perbaikan'
  },
  {
    id: 4,
    name: 'Kemajuan bor'
  },
  {
    id: 5,
    name: 'Istirahat'
  }
];

export const TYPE_ONBOARDING = {
  selectBatch: NAVIGATION_NAME.PIC.selectBatch,
  timer: NAVIGATION_NAME.PIC.timer,
  home: NAVIGATION_NAME.PIC.home
};

export const OPERATIONS = {
  charging: {
    name: "Charging",
    icon: Images.charging
  },
  burner: {
    name: "Burner",
    icon: Images.burner
  },
  mixing: {
    name: "Mixing",
    icon: Images.mixing
  },
  casting: {
    name: "Casting",
    icon: Images.casting
  },
  drossing: {
    name: "Drossing",
    icon: Images.drossing
  },
  sampling: {
    name: "Sampling",
    icon: Images.sampling
  },
  alloying: {
    name: "Alloying",
    icon: Images.alloying
  },
  fluxing: {
    name: "Fluxing",
    icon: Images.fluxing
  },
  transfer: {
    name: "Transfer",
    icon: Images.transfer
  },
  holding: {
    name: "hHlding",
    icon: Images.holding
  },
  degassing: {
    name: "Degassing",
    icon: Images.degassing
  },
}

export const OPERATIONS_TYPES = {
  charging: 'Charging',
  burner: 'Burner',
  mixing: 'Mixing',

  casting: 'Casting',
  drossing: 'Drossing',
  sampling: 'Sampling',

  alloying: 'Alloying',
  fluxing: 'Fluxing',
  transfer: 'Transfer',

  holding: 'Holding',
  degassing: 'Degassing',
};
