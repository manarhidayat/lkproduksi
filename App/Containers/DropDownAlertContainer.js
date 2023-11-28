import React, {PureComponent} from 'react';
import DropdownAlert from 'react-native-dropdownalert';
import DropDownHolder from '../Components/DropDownHolder';
import {Colors} from '../Themes';
import {useNavigation} from '@react-navigation/native';

class DropDownAlertCont extends PureComponent {
  dropdownRef;

  componentDidMount() {
    const {navigation, isModal} = this.props;
    if (isModal && navigation) {
      this.unsubscribeFocus = navigation.addListener('focus', () => {
        DropDownHolder.setModalInstance(this.dropdownRef);
      });
    }
  }

  componentWillUnmount() {
    const {isModal} = this.props;

    if (isModal) {
      DropDownHolder.setModalInstance(undefined);
    } else {
      DropDownHolder.setInstance(undefined);
    }

    if (this.unsubscribeFocus !== undefined) {
      if (typeof this.unsubscribeFocus === 'function') {
        this.unsubscribeFocus();
      }
    }
  }

  render() {
    const {isModal} = this.props;
    return (
      <DropdownAlert
        ref={(ref) => {
          if (ref) {
            if (isModal) {
              this.dropdownRef = ref;
            } else {
              DropDownHolder.setInstance(ref);
            }
          }
        }}
        closeInterval={1000}
        inactiveStatusBarBackgroundColor={Colors.snow}
        inactiveStatusBarStyle="dark-content"
        titleNumOfLines={5}
        messageNumOfLines={5}
        elevation={1.0}
        zIndex={99}
      />
    );
  }
}

const DropDownAlertContainer = (props) => {
  if (props?.isModal) {
    const navigation = useNavigation();
    return <DropDownAlertCont {...props} navigation={navigation} />;
  }
  return <DropDownAlertCont {...props} />;
};

export default DropDownAlertContainer;
