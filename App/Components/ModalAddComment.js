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
  },
  title: {
    fontWeight: 'bold',
    fontSize: 17,
  },
});

const schema = Yup.object().shape({
  comment: Yup.string().required('Mohon Masukan Comment'),
});

class ModalAddComment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.isVisible = this.isVisible.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderForm = this.renderForm.bind(this);
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

  show() {
    this.setState({visible: true});
  }

  hide() {
    const {onCancel} = this.props;
    this.setState({visible: false}, onCancel);
  }

  handleSubmit(values) {
    const {comment} = values;
    const {onDone} = this.props;
    this.setState({visible: false}, () => onDone(comment));
  }

  renderForm(props) {
    return (
      <View style={styles.content}>
        <Text style={styles.title}>Add Comment</Text>
        <Spacer height={10} />
        <Input
          placeholder="Fill comment here"
          name="comment"
          multiline
          style={{height: 300}}
          value={props.values.comment}
          error={props.errors.comment}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
        />

        <View style={styles.bottom}>
          <FullButton
            onPress={this.hide}
            style={{
              width: '45%',
              backgroundColor: Colors.button,
              borderWidth: 1,
            }}
            text="CANCEL"
            textStyle={{color: 'black'}}
          />
          <Spacer width={20} />
          <FullButton
            onPress={(e) => {
              props.handleSubmit(e);
            }}
            style={{width: '45%'}}
            text="SAVE"
          />
        </View>
      </View>
    );
  }

  render() {
    const {visible} = this.state;
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
            <Formik
              onSubmit={this.handleSubmit}
              validationSchema={schema}
              render={this.renderForm}
            />
          </View>
        </Modal>
      </>
    );
  }
}

export default ModalAddComment;
