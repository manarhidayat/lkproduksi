// import {Navigation as RNNavigation} from 'react-native-navigation';
// import {Platform, UIManager, InteractionManager} from 'react-native';
// import SplashScreen from 'react-native-splash-screen';
// import NavigationServices from './NavigationServices';
// import MMKVStoragePersistHelper from '../Lib/MMKVStoragePersistHelper';
// import RegisterComponent from './RegisterComponent';
// import {NAVIGATION_NAME} from './NavigationName';
// import DefaultOptions from './Styles';
// import StackComponent from './StackComponent';

// RNNavigation.events().registerComponentWillAppearListener((nav) => {
//   console.tron.send('state.action.complete', {
//     name: `NAVIGATE/${nav.componentName}`,
//     action: nav,
//   });
//   NavigationServices.setActiveNavigation(nav);
// });

// RNNavigation.events().registerBottomTabPressedListener(({tabIndex}) => {
//   if (Platform.OS === 'android') {
//     if (tabIndex === 2) {
//       NavigationServices.push(NAVIGATION_NAME.HOME.panic);
//     }
//   }
// });

// if (Platform.OS === 'ios') {
//   RNNavigation.events().registerAppLaunchedListener(async () => {
//     handleInitialNavigation();
//   });
// }

// RNNavigation.setDefaultOptions({
//   statusBar: DefaultOptions.statusBar,
//   topBar: DefaultOptions.topBar,
//   bottomTabs: DefaultOptions.bottomTabs,
//   bottomTab: DefaultOptions.bottomTab,
//   layout: DefaultOptions.layout,
//   animations: DefaultOptions.animations,
// });

// let initListener = false;

// RegisterComponent();

// if (Platform.OS === 'android') {
//   if (UIManager.setLayoutAnimationEnabledExperimental) {
//     UIManager.setLayoutAnimationEnabledExperimental(true);
//   }
// }

// if (Platform.OS === 'android') {
//   handleInitialNavigation();
// }

// async function handleInitialNavigation() {
//   // await MMKVStoragePersistHelper.init();
//   const isWelcomeDone = await MMKVStoragePersistHelper.getItem('isWelcomeDone');
//   if (isWelcomeDone === 'true') {
//     StackComponent.setRootMain();
//   } else {
//     StackComponent.setRootAuth();
//   }

//   InteractionManager.runAfterInteractions(() => {
//     SplashScreen.hide();
//   });

//   if (!initListener) {
//     initListener = true;

//     InteractionManager.runAfterInteractions(() => {
//       SplashScreen.hide();
//     });
//   }
// }
