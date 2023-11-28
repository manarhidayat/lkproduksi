import {Platform, Dimensions} from 'react-native';
import {Colors, Fonts} from '../../Themes';
import {scaleWithPixel} from '../../Transforms';

const DefaultOptions = {
  statusBar: {
    visible: true, // Optional
    style: 'dark', // Optional ('light', 'dark')
    backgroundColor: 'white' // Optional, Android only
  },
  topBar: {
    visible: true, // Optional
    animate: true, // Optional
    title: {
      // fontSize: scaleWithPixel(16), // Optional
      color: Colors.primary, // Optional
      fontFamily: Fonts.type.regular // Optional
    }, // Optional
    backButton: {
      color: Colors.primary, // Optional
      showTitle: false // Optional, IOs only
    }, // Optional
    background: {
      color: 'white' // Optional
    } // Optional
  }, // Optional
  bottomTabs: {
    animate: true, // Optional
    visible: true, // Optional
    barStyle: 'black', // Optional (default, black)
    backgroundColor: 'white', // Optional
    translucent: false, // Optional, IOs only
    currentTabIndex: 0, // Optional
    drawBehind: true, // Optional
    elevation: 1, // Optional, Android only
    hideShadow: false, // Optional, IOs only
    hideOnScroll: false, // Optional, Android only
    preferLargeIcons: true, // Optional, Android only
    // tabsAttachMode: "afterInitialTab", // Optional ('together','afterInitialTab','onSwitchToTab')
    // selectedIconColor: Colors.primary, // Optional
    titleDisplayMode: 'alwaysShow' // Optional ('alwaysShow','showWhenActive','alwaysHide')
  },
  bottomTab: {
    fontFamily: Fonts.type.regular,
    textColor: Colors.placeholder,
    // selectedTextColor: Colors.primary,
    // selectedIconColor: Colors.primary,
    // iconColor: 'grey' // Optional
  },
  layout: {
    backgroundColor: 'white',
    componentBackgroundColor: 'transparent',
    fitSystemWindows: true,
    orientation: 'portrait', // Optional ['portrait', 'landscape']
    topMargin: 0 // Optional, Android only
  },
  animations: {
    setRoot: {
      waitForRender: true,
    },
    push: {
      waitForRender: true,
      content: Platform.select({
        ios: {
          enter: {
            translationX: {
              from: Dimensions.get('window').width,
              to: 0,
              duration: 1,
            },
          },
        },
        android: {
          enter: {
            translationY: {
              from: Dimensions.get('window').height,
              to: 0,
              duration: 1,
            },
          },
        },
      }),
    },
    showModal: {
      waitForRender: true,
    },
  },
  overlay: {
    interceptTouchOutside: false,
  },
  // modal: {}, // Optional,
  // preview: {}, // Optional,
  // splitView: {}, // Optional,
  // fab: {}, // Optional, Android only
};

export default DefaultOptions;
