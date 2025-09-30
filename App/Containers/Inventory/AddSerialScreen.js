import React, {Component} from 'react';
import {View, StyleSheet, SafeAreaView, Alert, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {Formik} from 'formik';

import InventoryActions, {InventorySelectors} from '../../Redux/InventoryRedux';
import FullButton from '../../Components/FullButton';
import {SessionSelectors} from '../../Redux/SessionRedux';
import InputSelect from '../../Components/InputSelect';
import Input from '../../Components/Input';
import ButtonWhite from '../../Components/ButtonWhite';
import Spacer from '../../Components/Spacer';
import ModalPrint from '../../Components/ModalPrint';

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
});

class AddSerialScreen extends Component {
  modalPrint = undefined;
  constructor(props) {
    super(props);
    this.state = {
      params: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderForm = this.renderForm.bind(this);
  }

  componentDidMount() {
    const {navigation, getLocationRequest, route} = this.props;

    setTimeout(() => {
      const chksheet = route?.params?.chksheet;
      // getLocationRequest({en_id: chksheet.chksheet_en_id});
    }, 300);
  }

  handleSubmit(values) {
    const {bundle, qty, lot_serial, batch, location, qty_packaging, pcs} =
      values;
    const {
      route,
      createChecksheetSerialRequest,
      updateChecksheetSerialRequest,
    } = this.props;
    const chksheet = route?.params?.chksheet;
    const detail = route?.params?.detail;
    const isEdit = route?.params?.isEdit;
    const serial = route?.params?.serial;

    if (!qty || !pcs || !location) {
      Alert.alert('Peringatan', 'Masukan data dengan benar');
      return;
    }

    let params = {
      checksheet_detail_oid: detail.chksheetd_oid,
      seq: Number(detail.serials.length),
      qty: Number(qty || 0),
      pcs: Number(pcs || 0),
      loc_id: Number(location.loc_id || 0),
      bundle: bundle,
      batch: batch,
      lot_serial: lot_serial,
      qr_code: `${lot_serial}_${bundle}_${batch}_${qty}_${pcs}_${location.loc_desc}`,
    };

    if (isEdit) {
      params = {
        ...params,
        chksheetds_oid: serial.chksheetds_oid,
      };
      updateChecksheetSerialRequest(params);
    } else {
      createChecksheetSerialRequest(params);
    }
  }

  print() {
    const {route, location} = this.props;
    const serial = route?.params?.serial;

    const {chksheetds_lot_serial, chksheetds_bundle, chksheetds_batch} = serial;

    let locationSelected = {};
    if (location) {
      locationSelected = location.find(
        (loc) => loc.loc_id === serial.chksheetds_loc_id
      );
    }

    const qty = `${parseFloat(serial.chksheetds_qty).toFixed(2)}`;
    const pcs = `${parseFloat(serial.chksheetds_pcs).toFixed(2)}`;

    const qr_code = `${chksheetds_lot_serial}_${chksheetds_bundle}_${chksheetds_batch}_${qty}_${pcs}_${locationSelected.loc_desc}`;

    this.modalPrint.show(qr_code);
  }

  renderForm(props) {
    const {route, location} = this.props;
    const isEdit = route?.params?.isEdit;
    return (
      <View>
        <Input
          title="Bundle"
          placeholder="Bundle"
          name="bundle"
          value={props.values.bundle}
          error={props.errors.bundle}
          setFieldValue={(item, value) => {
            props.setFieldValue(item, value);
            props.setFieldValue('lot_serial', value + props.values.batch);
          }}
          setFieldTouched={() => {}}
        />
        <Input
          title="Batch"
          placeholder="Batch"
          name="batch"
          value={props.values.batch}
          error={props.errors.batch}
          setFieldValue={(item, value) => {
            props.setFieldValue(item, value);
            props.setFieldValue('lot_serial', props.values.bundle + value);
          }}
          setFieldTouched={() => {}}
        />
        <Input
          title="Lot/Serial Number"
          placeholder="Lot/Serial Number"
          name="lot_serial"
          editable={false}
          value={props.values.lot_serial}
          error={props.errors.lot_serial}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
        />
        <Input
          title="Qty"
          placeholder="Qty"
          name="qty"
          keyboardType="number-pad"
          value={props.values.qty}
          error={props.errors.qty}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
        />
        <Input
          title="Qty Packaging"
          placeholder="Qty Packaging"
          name="pcs"
          keyboardType="number-pad"
          value={props.values.pcs}
          error={props.errors.pcs}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
        />
        {/* <Input
          title="Qty Packaging"
          placeholder="Qty Packaging"
          name="qty_packaging"
          keyboardType="number-pad"
          value={props.values.qty_packaging}
          error={props.errors.qty_packaging}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
        /> */}

        <InputSelect
          title="Location"
          name="location"
          placeholder="Location"
          editable={true}
          useSearch
          isLocation
          value={
            props.values.location
              ? props.values.location.loc_desc
              : props.values.location
          }
          error={props.errors.location}
          data={location}
          onSelect={(item) => {
            props.setFieldValue('location', item);
          }}
        />

        <Spacer height={16} />

        <FullButton
          onPress={(e) => {
            props.handleSubmit(e);
          }}
          text={'SIMPAN'}
        />
      </View>
    );
  }

  render() {
    const {user, route, location} = this.props;
    const lastSerial = route?.params?.lastSerial;
    const detail = route?.params?.detail;
    const serial = route?.params?.serial;
    const isEdit = route?.params?.isEdit;

    let locationSelected = {};
    if (detail && location) {
      locationSelected = location.find(
        (loc) => loc.loc_id === detail.chksheetd_loc_id
      );
    }

    if (isEdit && location) {
      locationSelected = location.find(
        (loc) => loc.loc_id === serial.chksheetds_loc_id
      );
    }

    let newBundle = '';
    if (!isEdit && lastSerial.chksheetds_bundle) {
      let a = lastSerial.chksheetds_bundle || '';
      let prefix = a.match(/^\D+/)[0]; // ambil huruf & tanda non-digit di depan
      let num = parseInt(a.match(/\d+$/)[0], 10) + 1; // ambil angka di akhir dan tambah 1
      newBundle =
        prefix + num.toString().padStart(a.match(/\d+$/)[0].length, '0');
    }

    const chksheetds_batch = !isEdit ? lastSerial.chksheetds_batch || '' : '';

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView>
          <View style={styles.content}>
            <Formik
              onSubmit={this.handleSubmit}
              render={this.renderForm}
              enableReinitialize
              initialValues={{
                lot_serial: isEdit
                  ? serial.chksheetds_lot_serial
                  : newBundle + chksheetds_batch,
                bundle: isEdit ? serial.chksheetds_bundle : newBundle,
                batch: isEdit ? serial.chksheetds_batch : chksheetds_batch,
                qty: isEdit
                  ? `${Math.abs(parseFloat(serial.chksheetds_qty)).toFixed(2)}`
                  : '',
                pcs: isEdit
                  ? `${Math.abs(parseFloat(serial.chksheetds_pcs)).toFixed(2)}`
                  : '',
                qty_packaging:
                  isEdit && serial.chksheetds_qty_packaging
                    ? `${parseFloat(serial.chksheetds_qty_packaging).toFixed(
                        2
                      )}`
                    : '',
                location: locationSelected,
              }}
            />
            <ModalPrint setRef={(r) => (this.modalPrint = r)} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const selector = createSelector(
  [SessionSelectors.selectUser, InventorySelectors.getLocation],
  (user, location) => ({
    user,
    location,
  })
);

const mapStateToProps = (state, props) => {
  return selector(state);
};

const mapDispatchToProps = (dispatch) => ({
  getLocationRequest: (params) =>
    dispatch(InventoryActions.getLocationRequest(params)),
  createChecksheetSerialRequest: (params) =>
    dispatch(InventoryActions.createChecksheetSerialRequest(params)),
  updateChecksheetSerialRequest: (params) =>
    dispatch(InventoryActions.updateChecksheetSerialRequest(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddSerialScreen);
