import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Modal from 'react-native-modal';
import {Colors, Fonts} from '../Themes';
import FullButton from './FullButton';
import Input from './Input';
import Spacer from './Spacer';
import Text from './Text';

const styles = StyleSheet.create({
  modalContainer: {},
  container: {
    backgroundColor: Colors.snow,
    padding: 16,
    borderRadius: 8,
  },
  bottom: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 17,
  },
});

class ModalStartTimer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.isVisible = this.isVisible.bind(this);
    this.onDone = this.onDone.bind(this);
  }

  componentDidMount() {
    const {setRef} = this.props;
    if (setRef) {
      setRef(this);
    }
  }

  isVisible() {
    return this.state.visible;
  }

  onDone() {
    const {onDone} = this.props;
    this.setState({visible: false}, () => onDone());
  }

  show() {
    this.setState({visible: true});
  }

  hide() {
    const {onCancel} = this.props;
    this.setState({visible: false}, onCancel);
  }

  render() {
    const {visible} = this.state;
    const {title, desc} = this.props;
    return (
      <>
        <Modal
          isVisible={visible}
          onBackdropPress={this.hide}
          animationIn="fadeIn"
          animationOut="fadeOut"
          onBackButtonPress={this.hide}
          backdropTransitionOutTiming={0}
          style={styles.modalContainer}>
          <View style={styles.container}>
            <View style={styles.content}>
              <Text style={styles.title}>{title}</Text>
              <Spacer height={10} />
              <Text>{desc}</Text>

              <View style={styles.bottom}>
                <FullButton
                  onPress={this.hide}
                  style={{
                    width: '45%',
                    backgroundColor: Colors.greyLight,
                  }}
                  text="NO"
                  textStyle={{color: 'black'}}
                />
                <Spacer width={20} />
                <FullButton
                  onPress={this.onDone}
                  style={{width: '45%'}}
                  text="YES"
                />
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

export default ModalStartTimer;
