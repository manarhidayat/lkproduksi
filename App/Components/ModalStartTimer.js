import React, {PureComponent} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {createSelector} from 'reselect';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import {Colors, Fonts} from '../Themes';
import FullButton from './FullButton';
import Input from './Input';
import Spacer from './Spacer';
import Text from './Text';
import {SessionSelectors} from '../Redux/SessionRedux';
import OperationActions, {OperationSelectors} from '../Redux/OperationRedux';
import InputSelect from './InputSelect';

const styles = StyleSheet.create({
  modalContainer: {},
  container: {
    backgroundColor: Colors.snow,
    padding: 16,
    borderRadius: 8,
    paddingTop: 50,
    paddingBottom: 60,
    height: 600,
  },
  containerStop: {
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

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textLabel: {
    flex: 1,
  },
  inputPlan: {
    flex: 0.5,
  },
  inputActual: {
    flex: 0.5,
  },
  textTitle: {fontWeight: 'bold'},
  titleContainer: {
    marginBottom: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderColor: 'grey',
  },
});

class ModalStartTimer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      useReason: false,
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.isVisible = this.isVisible.bind(this);
    this.onDone = this.onDone.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderForm = this.renderForm.bind(this);

    this.handleSubmitReason = this.handleSubmitReason.bind(this);
    this.renderFormReason = this.renderFormReason.bind(this);
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

  onDone(detailMaterial) {
    const {onDone} = this.props;
    this.setState({visible: false}, () => onDone(detailMaterial));
  }

  show(useReason) {
    this.setState({visible: true, useReason});
  }

  hide() {
    const {onCancel} = this.props;
    this.setState({visible: false, useReason: false}, onCancel);
  }

  handleSubmitReason(values) {
    const {reason, reasonOther} = values;
    const {onDone} = this.props;
    this.setState({visible: false}, () => onDone({reason, reasonOther}));
  }

  handleSubmit(values) {
    const {detailBatch, setDetailMaterial} = this.props;
    let validated = true;

    let detailMaterial = [];
    detailBatch.map((item) => {
      // if (values[item.pt_code] > item.wod_qty_req) {
      //   Alert.alert('Peringatan', 'Actual tidak boleh lebih besar dari Plan');
      //   validated = false;
      //   return;
      // }
      detailMaterial.push({
        ...item,
        material_id: item.pt_id,
        qty_open: `${item.wod_qty_req}`,
        qty_use: values[item.pt_code] || '0',
      });
    });

    if (!validated) {
      return;
    }

    setDetailMaterial(detailMaterial);
    this.onDone(detailMaterial);
  }

  renderForm(props) {
    const {detailBatch} = this.props;
    return (
      <View>
        <ScrollView>
          <View style={styles.content}>
            <View style={[styles.row, styles.titleContainer]}>
              <Text style={[styles.textTitle, {flex: 1}]}>Material</Text>
              <Text style={[styles.textTitle, {flex: 0.5}]}>Plan</Text>
              <Text style={[styles.textTitle, {flex: 0.5}]}>Actual</Text>
            </View>
            {detailBatch.map((item) => {
              return (
                <View style={styles.row}>
                  <Text style={styles.textLabel}>{item.pt_desc1}</Text>
                  <Input
                    placeholder=" "
                    name={item.pt_id}
                    keyboardType="number-pad"
                    editable={false}
                    containerStyle={styles.inputPlan}
                    value={`${item.wod_qty_req}`}
                    error={props.errors.baseMetalPlan}
                    setFieldValue={props.setFieldValue}
                    setFieldTouched={() => {}}
                  />
                  <Spacer width={10} />
                  <Input
                    placeholder=" "
                    name={item.pt_code}
                    keyboardType="number-pad"
                    containerStyle={styles.inputActual}
                    defaultValue={'0'}
                    value={props.values[item.pt_code]}
                    error={props.errors[item.pt_code]}
                    setFieldValue={props.setFieldValue}
                    setFieldTouched={() => {}}
                  />
                </View>
              );
            })}
          </View>
        </ScrollView>
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
            // onPress={this.onDone}
            onPress={(e) => {
              props.handleSubmit(e);
            }}
            style={{width: '45%'}}
            text="YES"
          />
        </View>
      </View>
    );
  }

  renderFormReason(props) {
    const {reasons} = this.props;
    return (
      <View style={styles.content}>
        <Text style={{}}>Masukan Catatan karna sudah melebihi overtime</Text>
        <Spacer height={10} />
        <InputSelect
          name="reason"
          placeholder="Alasan"
          editable={true}
          data={reasons}
          containerStyle={{width: 300}}
          value={
            props.values.reason
              ? props.values.reason.code_name
              : props.values.reason
          }
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
          containerStyle={{width: 300}}
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
    const {visible, useReason} = this.state;
    const {title, desc, useMaterial} = this.props;
    const {detailBatch} = this.props;

    let schema = {};
    if (useMaterial && detailBatch && detailBatch.length > 0) {
      detailBatch.map((item) => {
        schema = {
          ...schema,
          [item.pt_code]: Yup.string().max(item.wod_qty_req),
        };
      });
    }

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
          <View style={useMaterial ? styles.container : styles.containerStop}>
            <View style={styles.content}>
              <Text style={styles.title}>{title}</Text>
              <Spacer height={10} />
              <Text>{desc}</Text>
              <Spacer height={10} />
              {useMaterial ? (
                <Formik
                  onSubmit={this.handleSubmit}
                  // validationSchema={Yup.object().shape(schema)}
                  render={this.renderForm}
                />
              ) : useReason ? (
                <Formik
                  onSubmit={this.handleSubmitReason}
                  validationSchema={Yup.object().shape({
                    reason: Yup.string().required('Mohon Masukan alasan'),
                  })}
                  render={this.renderFormReason}
                />
              ) : (
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
                    onPress={() => this.onDone()}
                    style={{width: '45%'}}
                    text="YES"
                  />
                </View>
              )}
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

const selector = createSelector(
  [
    SessionSelectors.selectBatch,
    OperationSelectors.getDetailBatch,
    OperationSelectors.getReasons,
  ],
  (kitchen, detailBatch, reasons) => ({
    kitchen,
    detailBatch,
    reasons,
  })
);

const mapStateToProps = (state) => selector(state);

const mapDispatchToProps = (dispatch) => ({
  setDetailMaterial: (params) =>
    dispatch(OperationActions.setDetailMaterial(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalStartTimer);
