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

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
});

class AddListItemScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderForm = this.renderForm.bind(this);
  }

  componentDidMount() {
    const {navigation, getBarangRequest, getLocationRequest, route} =
      this.props;

    setTimeout(() => {
      const chksheet = route?.params?.chksheet;
      // getBarangRequest({en_id: chksheet.chksheet_en_id});
      // getLocationRequest({en_id: chksheet.chksheet_en_id});
    }, 300);
  }

  handleSubmit(values) {
    const {
      barang,
      qty,
      um_conv,
      qty_real,
      location,
      qty_packaging,
      packaging,
      remark,
    } = values;
    const {
      route,
      createChecksheetDetailRequest,
      updateChecksheetDetailRequest,
    } = this.props;
    const chksheet = route?.params?.chksheet;
    const isEdit = route?.params?.isEdit;

    if (
      !barang ||
      !qty ||
      // !um_conv ||
      // !qty_real ||
      !qty_packaging ||
      // !packaging ||
      !location
    ) {
      Alert.alert('Peringatan', 'Masukan data dengan benar');
      return;
    }

    let params = {
      en_id: Number(chksheet.chksheet_en_id || 0),
      pt_id: Number(barang.pt_id || 0),
      checksheet_oid: chksheet.chksheet_oid,
      qty: Number(qty || 0),
      um_id: Number(barang.um_id || 0),
      // um_conv: Number(um_conv || 0),
      um_conv: 1,
      qty_real: Number(qty || 0),
      loc_id: Number(location.loc_id || 0),
      qty_packaging: Number(qty_packaging || 0),
      // packaging: Number(packaging || 0),
      packaging: 0,
      remarks: remark,
    };

    if (isEdit) {
      const detail = route?.params?.detail;
      params = {
        chksheetd_oid: detail.chksheetd_oid,
        ...params,
      };
      updateChecksheetDetailRequest(params);
    } else {
      createChecksheetDetailRequest(params);
    }
  }

  renderForm(props) {
    const {barang, location} = this.props;
    return (
      <View>
        <InputSelect
          title="Part Number"
          name="barang"
          placeholder="Part Number"
          editable={true}
          useSearch
          isBarang
          selected={props.values.barang}
          value={
            props.values.barang
              ? props.values.barang.pt_code
              : props.values.barang
          }
          error={props.errors.entity}
          data={barang}
          onSelect={(item) => {
            props.setFieldValue('barang', item);
            props.setFieldValue('description', item.pt_desc1);
            props.setFieldValue('description2', item.pt_desc2);
            props.setFieldValue('lot', item.pt_ls);
            props.setFieldValue('um', item.um_name);
          }}
        />
        <Input
          title="Description"
          placeholder="Description"
          name="description"
          editable={false}
          value={props.values.description}
          error={props.errors.description}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
        />
        <Input
          title="Description 2"
          placeholder="Description 2"
          name="description2"
          editable={false}
          value={props.values.description2}
          error={props.errors.description2}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
        />
        {/* <Input
          title="Lot/Serial"
          placeholder="Lot/Serial"
          name="lot"
          editable={false}
          value={props.values.lot}
          error={props.errors.lot}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
        /> */}
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
        {/* <Input
          title="UM"
          placeholder="UM"
          name="um"
          editable={false}
          value={props.values.um}
          error={props.errors.um}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
        />
        <Input
          title="UM Conversaion"
          placeholder="UM Conversaion"
          name="um_conv"
          keyboardType="number-pad"
          value={props.values.um_conv}
          error={props.errors.um_conv}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
        />
        <Input
          title="Qty Real"
          placeholder="Qty Real"
          name="qty_real"
          keyboardType="number-pad"
          value={props.values.qty_real}
          error={props.errors.qty_real}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
        /> */}
        <Input
          title="Qty Packaging"
          placeholder="Qty Packaging"
          name="qty_packaging"
          keyboardType="number-pad"
          value={props.values.qty_packaging}
          error={props.errors.qty_packaging}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
        />
        {/* <Input
          title="Packaging"
          placeholder="Packaging"
          name="packaging"
          keyboardType="number-pad"
          value={props.values.packaging}
          error={props.errors.packaging}
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
        <Input
          title="Remark"
          placeholder="Remark"
          name="remark"
          multiline
          style={{height: 70, textAlignVertical: 'top'}}
          value={props.values.remark}
          error={props.errors.remark}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
        />
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
    const {route, location, barang} = this.props;
    const detail = route?.params?.detail;
    const isEdit = route?.params?.isEdit;

    let locationSelected = {};
    if (isEdit && detail.chksheetd_loc_id && location) {
      locationSelected = location.find(
        (loc) => loc.loc_id === detail.chksheetd_loc_id
      );
    }

    const barangSelected =
      barang && isEdit
        ? barang.find((brg) => brg.pt_id === detail.chksheetd_pt_id)
        : {};

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView>
          <View style={styles.content}>
            <Formik
              onSubmit={this.handleSubmit}
              render={this.renderForm}
              enableReinitialize
              initialValues={{
                remark: isEdit ? detail.chksheetd_rmks : '',
                qty: isEdit
                  ? `${parseFloat(detail.chksheetd_qty).toFixed(2)}`
                  : '',
                qty_packaging: isEdit
                  ? `${parseFloat(detail.chksheetd_qty_packaging).toFixed(2)}`
                  : '',
                location: locationSelected,
                barang: barangSelected,
                description: isEdit ? barangSelected.pt_desc1 : '',
                description2: isEdit ? barangSelected.pt_desc2 : '',
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const selector = createSelector(
  [
    SessionSelectors.selectUser,
    InventorySelectors.getBarang,
    InventorySelectors.getLocation,
  ],
  (user, barang, location) => ({
    user,
    barang,
    location,
  })
);

const mapStateToProps = (state, props) => {
  return selector(state);
};

const mapDispatchToProps = (dispatch) => ({
  getBarangRequest: (params) =>
    dispatch(InventoryActions.getBarangRequest(params)),
  getLocationRequest: (params) =>
    dispatch(InventoryActions.getLocationRequest(params)),
  createChecksheetDetailRequest: (params) =>
    dispatch(InventoryActions.createChecksheetDetailRequest(params)),
  updateChecksheetDetailRequest: (params) =>
    dispatch(InventoryActions.updateChecksheetDetailRequest(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddListItemScreen);
