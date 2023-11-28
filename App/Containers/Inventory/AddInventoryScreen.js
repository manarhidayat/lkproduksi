import React, {Component} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import uuid from 'react-native-uuid';

import {Colors, Images, Fonts} from '../../Themes';

import Button from '../../Components/FullButton';
import Input from '../../Components/Input';
import Text from '../../Components/Text';
import InventoryActions from '../../Redux/InventoryRedux';
import NavigationServices from '../../Navigation/NavigationServices';
import ButtonWhite from '../../Components/ButtonWhite';

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
  }
});

class AddInventoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.onPressDelete = this.onPressDelete.bind(this);
  }

  onPressDelete() {
    const {route, deleteInventory} = this.props;
    const inventory = route?.params?.inventory;

    deleteInventory(inventory.id);
    NavigationServices.pop();
  }

  handleSubmit(values) {
    const {route, saveInventory, editInventory} = this.props;
    const isEdit = route?.params?.isEdit;
    const {name} = values;
    let params = {
      name,
      isComplete: true,
      isUpload: true,
      isDelete: false
    };

    if (isEdit) {
      editInventory(params);
    } else {
      params = {
        ...params,
        id: uuid.v4(),
      };
      saveInventory(params);
    }
    NavigationServices.pop();
  }

  renderForm(props) {
    const {route} = this.props;
    const isEdit = route?.params?.isEdit;
    return (
      <View style={styles.content}>
        <Input
          placeholder="Name"
          name="name"
          value={props.values.name}
          error={props.errors.name}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
        />

        <Button
          onPress={(e) => {
            props.handleSubmit(e);
          }}
          style={{marginTop: 40}}
          text={isEdit ? 'UBAH' : 'BUAT'}
        />

        {isEdit && <ButtonWhite
          onPress={this.onPressDelete}
          text="HAPUS"
          style={{marginTop: 10, borderColor: 'red'}}
          textStyle={{color: 'red'}}
        />}
      </View>
    );
  }

  render() {
    const {route} = this.props;
    const inventory = route?.params?.inventory;
    const isEdit = route?.params?.isEdit;
    return (
      <SafeAreaView style={styles.container}>
        <Formik
          onSubmit={this.handleSubmit}
          validationSchema={schema}
          render={this.renderForm}
          // validateOnChange={false}
          initialValues={{
            name: isEdit ? inventory.name : '',
          }}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.session.user
});

const mapDispatchToProps = (dispatch) => ({
  saveInventory: (params) =>
    dispatch(InventoryActions.saveInventory(params)),
  editInventory: (params) =>
    dispatch(InventoryActions.editInventory(params)),
  deleteInventory: (params) =>
    dispatch(InventoryActions.deleteInventory(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddInventoryScreen);
