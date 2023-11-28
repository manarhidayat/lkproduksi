import LoadingHelper from './Lib/LoadingHelper';
import React, {PureComponent} from 'react';
import Modal from 'react-native-modal';
import {View, ActivityIndicator} from 'react-native';
import {Colors} from './Themes';

class LoadingOverlay extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  componentDidMount() {
    LoadingHelper.setInstance(this);
  }

  show() {
    this.setState({visible: true});
  }

  hide() {
    this.setState({visible: false});
  }

  render() {
    const {visible} = this.state;
    return (
      <Modal
        isVisible={visible}
        style={{padding: 0, margin: 0}}
        animationIn="fadeIn"
        animationOut="fadeOut">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.1)'
          }}>
          <ActivityIndicator size="large" color={Colors.activeBlue} />
        </View>
      </Modal>
    );
  }
}

export default LoadingOverlay;
