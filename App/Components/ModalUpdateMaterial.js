import React, {PureComponent} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {createSelector} from 'reselect';
import {connect} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Modal from 'react-native-modal';
import {Colors, Fonts} from '../Themes';
import FullButton from './FullButton';
import Input from './Input';
import Spacer from './Spacer';
import Text from './Text';
import OperationActions, {OperationSelectors} from '../Redux/OperationRedux';
import {SessionSelectors} from '../Redux/SessionRedux';
import DashboardActions, {DashboardSelectors} from '../Redux/DashboardRedux';

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
    maxHeight: 600,
  },
  content2: {
    paddingBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  titleLabel: {
    fontWeight: '600',
    marginBottom: 10,
  },
  heightField: {
    height: 50,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: Colors.greyLight,
  },
  heightInput: {
    height: 18,
    marginTop: 1,
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

class ModalUpdateMaterial extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      materials: [],
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

  show(materials) {
    const {getDetailBatchRequest, batch} = this.props;
    getDetailBatchRequest({id: batch.woi_code});
    this.setState({visible: true, materials});
  }

  hide() {
    const {onCancel} = this.props;
    this.setState({visible: false}, onCancel);
  }

  handleSubmit(values) {
    const {
      onDone,
      detailDashboard,
      updateBatchRequest,
      getTimelineBatchRequest,
      batch,
    } = this.props;

    const {detailBatch} = this.props;
    let validated = true;

    let detailMaterial = [];
    detailBatch.map((item) => {
      if (values[item.pt_id]) {
        if (values[item.pt_id] > item.wod_qty_req) {
          Alert.alert('Peringatan', 'Actual tidak boleh lebih besar dari Plan');
          validated = false;
          return;
        }
        detailMaterial.push({
          material_id: item.pt_id,
          qty_use: values[item.pt_id],
        });
      }
    });

    if (!validated) {
      return;
    }

    const params = {
      wocpdm_wocpd_oid: detailDashboard.wocp_oid,
      detail_material: detailMaterial,
    };

    updateBatchRequest(params, () => {
      getTimelineBatchRequest({woi_oid: batch.woi_oid});
      this.setState({visible: false});
    });
  }

  renderForm(props) {
    const {detailBatch} = this.props;
    return (
      <View style={styles.content}>
        <Text style={styles.title}>Masukan Material</Text>
        <Spacer height={10} />
        <ScrollView>
          <View style={styles.content2}>
            {detailBatch.length > 0 && (
              <View style={[styles.row, styles.titleContainer]}>
                <Text style={[styles.textTitle, {flex: 1}]}>Material</Text>
                <Text style={[styles.textTitle, {flex: 0.5}]}>Plan</Text>
                <Text style={[styles.textTitle, {flex: 0.5}]}>Actual</Text>
              </View>
            )}
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
                    name={item.pt_id}
                    keyboardType="number-pad"
                    containerStyle={styles.inputActual}
                    value={props.values[item.pt_id]}
                    error={props.errors[item.pt_id]}
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
    const {visible, materials} = this.state;

    let initialValues = {};
    materials.map((item) => {
      initialValues = {
        ...initialValues,
        [item.wocpdm_pt_id]: `${parseInt(item.wocpdm_qty_use, 10)}`,
      };
    });
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
              render={this.renderForm}
              initialValues={initialValues}
            />
          </View>
        </Modal>
      </>
    );
  }
}

const selector = createSelector(
  [
    OperationSelectors.getDetailBatch,
    SessionSelectors.selectBatch,
    DashboardSelectors.getDetailDashboard,
    DashboardSelectors.getTimeline,
  ],
  (detailBatch, batch, detailDashboard, timeline) => ({
    detailBatch,
    batch,
    detailDashboard,
    timeline
  })
);

const mapStateToProps = (state) => selector(state);

const mapDispatchToProps = (dispatch) => ({
  updateBatchRequest: (params, callback) =>
    dispatch(OperationActions.updateBatchRequest(params, callback)),
  getDetailBatchRequest: (params) =>
    dispatch(OperationActions.getDetailBatchRequest(params)),
  getTimelineBatchRequest: (params) =>
    dispatch(DashboardActions.getTimelineBatchRequest(params)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalUpdateMaterial);
