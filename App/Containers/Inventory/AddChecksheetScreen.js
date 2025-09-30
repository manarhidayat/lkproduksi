import React, {Component} from 'react';
import {View, StyleSheet, SafeAreaView, Alert, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {Formik} from 'formik';

import InventoryActions, {InventorySelectors} from '../../Redux/InventoryRedux';
import InputDate from '../../Components/InputDate';
import FullButton from '../../Components/FullButton';
import {SessionSelectors} from '../../Redux/SessionRedux';
import InputSelect from '../../Components/InputSelect';
import Input from '../../Components/Input';

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
});

class AddChecksheetScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderForm = this.renderForm.bind(this);
  }

  componentDidMount() {
    const {user, entity, getBranchRequest, getCustomerRequest} = this.props;
    let entitySelected = {};
    if (entity) {
      entitySelected = entity.find((loc) => loc.en_id === user.en_id);
    }

    setTimeout(() => {
      getBranchRequest({en_id: entitySelected.en_id, user_id: user.userid});
      getCustomerRequest({en_id: entitySelected.en_id});
    }, 300);
  }

  handleSubmit(values) {
    const {entity, customer, date, remark, branch} = values;
    const {createCheckseetRequest, updateCheckseetRequest, route} = this.props;
    const isEdit = route?.params?.isEdit;

    if (!entity || !customer || !date) {
      Alert.alert('Peringatan', 'Masukan data dengan benar');
      return;
    }

    let params = {
      en_id: entity.en_id,
      ptnr_id: customer.ptnr_id,
      date: date + ':00',
      remarks: remark,
      branch_id: branch.branch_id,
    };

    if (isEdit) {
      const chksheet = route?.params?.chksheet;
      params = {
        ...params,
        chksheet_oid: chksheet.chksheet_oid,
      };
      updateCheckseetRequest(params);
    } else {
      createCheckseetRequest(params);
    }
  }

  renderForm(props) {
    const {
      entity,
      getCustomerRequest,
      customer,
      getBranchRequest,
      branch,
      user,
    } = this.props;
    return (
      <View>
        <InputSelect
          title="Entity"
          name="entity"
          placeholder="Entity"
          editable={true}
          isEntity
          selected={props.values.entity}
          value={
            props.values.entity
              ? props.values.entity.en_desc
              : props.values.entity
          }
          error={props.errors.entity}
          data={entity}
          onSelect={(item) => {
            props.setFieldValue('entity', item);
            getCustomerRequest({en_id: item.en_id});
            getBranchRequest({en_id: item.en_id, user_id: user.userid});
          }}
        />
        <InputSelect
          title="Branch"
          name="branch"
          placeholder="Branch"
          editable={true}
          isBranch
          selected={props.values.branch}
          value={
            props.values.branch
              ? props.values.branch.branch_name
              : props.values.branch
          }
          error={props.errors.branch}
          data={branch}
          onSelect={(item) => {
            props.setFieldValue('branch', item);
          }}
        />
        <InputSelect
          title="Sold To"
          name="customer"
          placeholder="Sold To"
          editable={true}
          useSearch
          isCustomer
          selected={props.values.customer}
          value={
            props.values.customer
              ? props.values.customer.ptnr_name
              : props.values.customer
          }
          error={props.errors.customer}
          data={customer}
          onSelect={(item) => {
            props.setFieldValue('customer', item);
            // props.setFieldValue('code', item.ptnr_code);
            props.setFieldValue('address', item.ptnra_line_1);
          }}
        />
        {/* <Input
          title="Code"
          placeholder="Code"
          name="code"
          editable={false}
          value={props.values.code}
          error={props.errors.code}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
        /> */}
        <Input
          title="Address"
          placeholder="Address"
          name="address"
          editable={false}
          value={props.values.address}
          error={props.errors.address}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
        />
        <InputDate
          title="Date"
          name="date"
          placeholder="Date"
          maxLength={20}
          pointerEvents="none"
          mode="datetime"
          editable={true}
          selectTextOnFocus={false}
          value={props.values.date}
          error={props.errors.date}
          onSelect={(item) => {
            props.setFieldValue('date', item);
          }}
          setFieldTouched={() => {}}
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
    const {user, entity, route, customer, branch} = this.props;
    const isEdit = route?.params?.isEdit;
    const chksheet = route?.params?.chksheet;

    let entitySelected = {};
    if (entity) {
      entitySelected = entity.find((loc) => loc.en_id === user.en_id);
    }

    let customerSelected = {};
    let branchSelected = {
      branch_name: user.nama_branch,
      branch_id: user.user_branch_id,
    };

    if (isEdit) {
      if (customer) {
        customerSelected = customer.find(
          (loc) => loc.ptnr_id === chksheet.chksheet_ptnr_id_sold
        );
      }

      if (entity) {
        entitySelected = entity.find(
          (loc) => loc.en_id === chksheet.chksheet_en_id
        );
      }

      if (branch) {
        branchSelected = branch.find(
          (loc) => loc.branch_id === chksheet.chksheet_branch_id
        );
      }
    }

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView>
          <View style={styles.content}>
            <Formik
              onSubmit={this.handleSubmit}
              render={this.renderForm}
              enableReinitialize
              initialValues={{
                entity: entitySelected,
                branch: branchSelected,
                date: isEdit ? chksheet.chksheet_add_date : '',
                remark: isEdit ? chksheet.chksheet_trans_rmks : '',
                customer: isEdit ? customerSelected : {},
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
    InventorySelectors.getEntity,
    InventorySelectors.getCustomer,
    InventorySelectors.getBranch,
  ],
  (user, entity, customer, branch) => ({
    user,
    entity,
    customer,
    branch,
  })
);

const mapStateToProps = (state, props) => {
  return selector(state);
};

const mapDispatchToProps = (dispatch) => ({
  getCustomerRequest: (params) =>
    dispatch(InventoryActions.getCustomerRequest(params)),
  getBranchRequest: (params) =>
    dispatch(InventoryActions.getBranchRequest(params)),
  createCheckseetRequest: (params) =>
    dispatch(InventoryActions.createCheckseetRequest(params)),
  updateCheckseetRequest: (params) =>
    dispatch(InventoryActions.updateCheckseetRequest(params)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddChecksheetScreen);
