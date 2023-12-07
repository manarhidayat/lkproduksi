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
import MMKVStoragePersistHelper from '../Lib/MMKVStoragePersistHelper';

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
});

const schema = Yup.object().shape({
  url: Yup.string().required('Mohon Masukan URL'),
});

class ModalSetupUrl extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      url: ''
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.onDone = this.onDone.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderForm = this.renderForm.bind(this);
  }

  async componentDidMount() {
    const {setRef} = this.props;
    if (setRef) {
      setRef(this);
    }

    const url = await MMKVStoragePersistHelper.getItem('url');
    this.setState({url});
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

  handleSubmit(values) {
    MMKVStoragePersistHelper.setItem('url', values.url);
    this.setState({visible: false, url: values.url});
  }

  renderForm(props) {
    return (
      <View style={styles.content}>
        <Input
          placeholder="Masukan Base Url"
          name="url"
          title="Setup URL"
          value={props.values.url}
          error={props.errors.url}
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
            text="BATAL"
            textStyle={{color: 'black'}}
          />
          <Spacer width={20} />
          <FullButton
            onPress={(e) => {
              props.handleSubmit(e);
            }}
            style={{width: '45%'}}
            text="SIMPAN"
          />
        </View>
      </View>
    );
  }

  render() {
    const {visible} = this.state;
    const {url} = this.state;

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
              initialValues={{
                url: url || '',
              }}
            />
          </View>
        </Modal>
      </>
    );
  }
}

export default ModalSetupUrl;
