import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import Modal from 'react-native-modal';
import {Colors, Fonts} from '../Themes';
import FullButton from './FullButton';
import Input from './Input';
import Spacer from './Spacer';
import Text from './Text';
import {OperationSelectors} from '../Redux/OperationRedux';
import InputSelect from './InputSelect';

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
  reason: Yup.string().required('Mohon Masukan reason'),
  // reasonOther: Yup.string().required('Mohon Masukan reason'),
});

class ModalAddComment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      notes: null,
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

  show(notes) {
    console.tron.log('wew notes', notes);
    this.setState({visible: true, notes});
  }

  hide() {
    const {onCancel} = this.props;
    this.setState({visible: false}, onCancel);
  }

  handleSubmit(values) {
    const {reason, reasonOther} = values;
    const {onDone} = this.props;
    this.setState({visible: false}, () => onDone({reason, reasonOther}));
  }

  renderForm(props) {
    const {reasons} = this.props;
    return (
      <View style={styles.content}>
        <Text style={styles.title}>Masukan Catatan</Text>
        <Spacer height={10} />
        <InputSelect
          name="reason"
          placeholder="Alasan"
          editable={true}
          data={reasons}
          value={
            props.values.reason
              ? props.values.reason.code_name
              : props.values.reason
          }
          selected={props.values.reason}
          code_name
          useSearch
          error={props.errors.reason}
          onSelect={(item) => {
            props.setFieldValue('reason', item);
          }}
        />
        <Input
          placeholder="Alasan lainnya"
          name="reasonOther"
          multiline
          style={{height: 100}}
          value={props.values.reasonOther}
          error={props.errors.reasonOther}
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
    const {visible, notes} = this.state;
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
              initialValues={{
                reason: notes ? notes.reason : {},
                reasonOther: notes ? notes.reasonOther : '',
              }}
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

const selector = createSelector([OperationSelectors.getReasons], (reasons) => ({
  reasons,
}));

const mapStateToProps = (state) => selector(state);

export default connect(mapStateToProps, null)(ModalAddComment);
