import React, {Component} from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import AuthActions from '../../Redux/AuthRedux';

import {Fonts, Metrics, Colors, Images} from '../../Themes';
import Icon from 'react-native-vector-icons/EvilIcons';

import Button from '../../Components/FullButton';
import Input from '../../Components/Input';

const schema = Yup.object().shape({
  usernama: Yup.string().required('Mohon lengkapi Usernama Anda'),
  oldPassword: Yup.string()
    .min(6, 'Min 6 Karakter')
    .required('Mohon lengkapi Kata Sandi Anda'),
  newPassword: Yup.string()
    .min(6, 'Min 6 Karakter')
    .required('Mohon lengkapi Kata Sandi Anda'),
});

const styles = StyleSheet.create({
  footer: {
    // position: 'absolute',
    // bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
  },
});

class LoginScreen extends Component {
  modalSetupUrl = undefined;

  constructor(props) {
    super(props);
    this.state = {};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderForm = this.renderForm.bind(this);
  }

  async handleSubmit(values) {
    let data = {
      usernama: values.usernama,
      old_password: values.oldPassword,
      new_password: values.newPassword,
    };

    this.props.changePasswordRequest(data);
  }

  renderForm(props) {
    return (
      <View
        style={{
          paddingHorizontal: Metrics.doubleBaseMargin,
          paddingTop: Metrics.doubleBaseMargin,
        }}>
        <Input
          title="Usernama"
          placeholder="Usernama"
          name="usernama"
          maxLength={50}
          autoCapitalize="none"
          value={props.values.usernama}
          error={props.errors.usernama}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
          leftIcon={<Icon name="user" size={27} color={Colors.primary} />}
        />
        <Input
          title="Password Lama"
          placeholder="Password Lama"
          name="oldPassword"
          maxLength={20}
          secureTextEntry
          value={props.values.oldPassword}
          error={props.errors.oldPassword}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
          leftIcon={<Icon name="lock" size={30} color={Colors.primary} />}
        />
        <Input
          title="Password Baru"
          placeholder="Password Baru"
          name="newPassword"
          maxLength={20}
          secureTextEntry
          value={props.values.newPassword}
          error={props.errors.newPassword}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
          leftIcon={<Icon name="lock" size={30} color={Colors.primary} />}
        />
        <Button
          onPress={(e) => {
            props.handleSubmit(e);
          }}
          style={{marginTop: Metrics.doubleBaseMargin}}
          text="Ubah"
        />
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
        <Formik
          onSubmit={this.handleSubmit}
          validationSchema={schema}
          render={this.renderForm}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  changePasswordRequest: (data) =>
    dispatch(AuthActions.changePasswordRequest(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
