import React, {Component} from 'react';
import {View, StyleSheet, SafeAreaView, Alert} from 'react-native';
import {connect} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import uuid from 'react-native-uuid';
import {createSelector} from 'reselect';

import Button from '../../Components/FullButton';
import InputSelect from '../../Components/InputSelect';
import Input from '../../Components/Input';
import Text from '../../Components/Text';
import Spacer from '../../Components/Spacer';
import SupportToolsActions from '../../Redux/SupportToolsRedux';
import InventoryActions from '../../Redux/InventoryRedux';
import NavigationServices from '../../Navigation/NavigationServices';
import ButtonWhite from '../../Components/ButtonWhite';
import { InventorySelectors } from '../../Redux/InventoryRedux';

const schema = Yup.object().shape({
  // email: Yup.string()
  //   .email('Mohon masukan format Email dengan benar')
  //   .required('Mohon lengkapi Email Anda'),
  // password: Yup.string()
  //   .min(6, 'Min 6 Karakter')
  //   .required('Mohon lengkapi Kata Sandi Anda')
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  content: {
    padding: 16,
  },
  containerUsage: {
    alignItems: 'center',
    flexDirection: 'row'
  }
});

class AddSupportToolsScreen extends Component {
  constructor(props) {
    super(props);
    const {route} = props;
    const isEdit = route?.params?.isEdit;
    const activity = route?.params?.activity;

    const remaining = this.getActualRemaining();
    // if(isEdit){
    //   const {inventory} = props;
    //   const {initial, used} = inventory;
    //   const {supportTools} = route?.params;

    //   remaining = parseInt(initial) - parseInt(used) + parseInt(supportTools.jumlah);
    // }

    this.state = {
      satuan: isEdit ? route?.params?.supportTools.inventory.alert_unit : "",
      isUpload: activity ? activity.isUpload : false,
      remaining,
      inventorySelected: isEdit ? route?.params?.supportTools.inventory : {}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.onPressDelete = this.onPressDelete.bind(this);
  }

  getActualRemaining(item){
    const {route} = this.props;
    const isEdit = route?.params?.isEdit;

    if(isEdit){
      const {route, inventory} = this.props;
      const {initial, used} = inventory;
      const {supportTools} = route?.params;

      return parseInt(initial) - parseInt(used) + parseInt(supportTools.jumlah);
    }

    if(item){
      return parseInt(item.initial) - parseInt(item.used);
    }

    return -1;
  }

  onPressDelete() {
    const {route, deleteSupportTools} = this.props;
    const supportTools = route?.params?.supportTools;
    const activity = route?.params?.activity;

    deleteSupportTools(supportTools.id, activity.id);
    NavigationServices.pop();
  }

  handleSubmit(values) {
    const {route, saveSupportTools, editSupportTools, editInventory, inventory} = this.props;
    const isEdit = route?.params?.isEdit;
    const activity = route?.params?.activity;
    const supportTools = route?.params?.supportTools;
    // const {inventory, jumlah} = values;
    const {jumlah, bor} = values;
    const {remaining, inventorySelected, satuan} = this.state;

    let params = {
      inventory: inventorySelected,
      jumlah,
      bor,
      isComplete: true,
      isUpload: true,
      isDelete: false
    };

    if(jumlah <= 0){
      return;
    }

    if(satuan !== 'Meter' && satuan !== 'Hour' && jumlah > remaining){
      Alert.alert("Perhatian", "Jumlah melebihi sisa unit");
      return;
    }

    if (isEdit) {
      params = {
        ...params,
        id: supportTools.id,
        activity_id: activity.id,
      };
      editSupportTools(params, activity.id);

      // if(inventorySelected.id === inventory.id){
      //   const actualRemaining = this.getActualRemaining();
      //   const usedBefore = parseInt(inventorySelected.initial) - actualRemaining;
      //   editInventory({
      //     ...inventorySelected,
      //     used: usedBefore + parseInt(jumlah)
      //   });
      // }else{
      //   editInventory({
      //     ...inventorySelected,
      //     used: parseInt(inventorySelected.used) + parseInt(jumlah)
      //   });
      //   editInventory({
      //     ...inventory,
      //     used: parseInt(inventory.used) - parseInt(supportTools.jumlah)
      //   });
      // }
      
    } else {
      params = {
        ...params,
        id: uuid.v4(),
        activity_id: activity.id,
      };
      saveSupportTools(params, activity.id);
      // editInventory({
      //   ...inventorySelected,
      //   used: parseInt(inventorySelected.used) + parseInt(jumlah)
      // });
    }
    
    NavigationServices.pop();
  }

  renderForm(props) {
    const {route, inventories} = this.props;
    const isEdit = route?.params?.isEdit;
    const {satuan, isUpload, remaining, inventorySelected} = this.state;

    return (
      <View style={styles.content}>
        <InputSelect
          useSearch
          name="inventory"
          placeholder="Inventory"
          editable={!isUpload}
          data={inventories}
          isInventory
          value={
            props.values.inventory
              ? props.values.inventory.item_name
              : props.values.inventory
          }
          error={props.errors.inventory}
          onSelect={(item) => {
            props.setFieldValue('inventory', item);
            this.setState({
              satuan: item.alert_unit, 
              remaining: item.initial - item.used, 
              inventorySelected: item
            });
          }}
        />
        <View style={styles.containerUsage}>
          <Input
            placeholder="Amount"
            name="jumlah"
            keyboardType="numeric"
            editable={!isUpload}
            value={props.values.jumlah}
            error={props.errors.jumlah}
            setFieldValue={props.setFieldValue}
            setFieldTouched={() => {}}
            containerStyle={{flex: 0.7}}
          />
          <Spacer width={10}/>
          {satuan !== 'Meter' && satuan !== 'Hour' && satuan !== '' &&
            <Text>{remaining} {satuan} Left</Text>
          }
          { satuan !== '' && satuan !== 'Pcs' && satuan !== 'Set' &&
            <Text>{satuan}</Text>
          }
        </View>

        {
          inventorySelected.behavior === 'Machine' && 
            <View style={styles.containerUsage}>
              <Input
                placeholder="Kemajuan Bor"
                name="bor"
                keyboardType="numeric"
                editable={!isUpload}
                value={props.values.bor}
                error={props.errors.bor}
                setFieldValue={props.setFieldValue}
                setFieldTouched={() => {}}
                containerStyle={{flex: 0.7}}
              />
              <Spacer width={10}/>
              <Text>Meter</Text>
            </View>
        }

        {!isUpload && <Button
          onPress={(e) => {
            props.handleSubmit(e);
          }}
          style={{marginTop: 40}}
          text={isEdit ? 'UPDATE' : 'CREATE'}
        />}

        {isEdit && !isUpload && <ButtonWhite
          onPress={this.onPressDelete}
          text="DELETE"
          style={{marginTop: 10, borderColor: 'red'}}
          textStyle={{color: 'red'}}
        />}
      </View>
    );
  }

  render() {
    const {route} = this.props;
    const supportTools = route?.params?.supportTools;
    const isEdit = route?.params?.isEdit;
    return (
      <SafeAreaView style={styles.container}>
        <Formik
          onSubmit={this.handleSubmit}
          validationSchema={schema}
          render={this.renderForm}
          // validateOnChange={false}
          initialValues={{
            jumlah: isEdit ? supportTools.jumlah : '',
            bor: isEdit ? supportTools.bor : 0,
            inventory: isEdit ? supportTools.inventory : {}
          }}
        />
      </SafeAreaView>
    );
  }
}

const selectorIventory = createSelector(
  [InventorySelectors.getInventory],
  (inventory) => ({
    inventory
  })
);

const selector = createSelector(
  [InventorySelectors.getListInventory],
  (inventories) => ({
    inventories
  })
);

const mapStateToProps = (state, props) => {
  const isEdit = props?.route?.params?.isEdit;
  let inventory = {};
  if(isEdit){
    const inventorySupportTools = props?.route?.params?.supportTools.inventory;
    inventory = selectorIventory(state, inventorySupportTools.id)
  }
  return {
    ...selector(state),
    ...inventory
  }
};

const mapDispatchToProps = (dispatch) => ({
  saveSupportTools: (params, activity_id) =>
    dispatch(SupportToolsActions.saveSupportTools(params, activity_id)),
  editSupportTools: (params, activity_id) =>
    dispatch(SupportToolsActions.editSupportTools(params, activity_id)),
  deleteSupportTools: (params, activity_id) =>
    dispatch(SupportToolsActions.deleteSupportTools(params, activity_id)),
  editInventory: (params) =>
    dispatch(InventoryActions.editInventory(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddSupportToolsScreen);
