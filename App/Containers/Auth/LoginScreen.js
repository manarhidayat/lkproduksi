import React, {Component} from 'react';
import {
  View,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import AuthActions from '../../Redux/AuthRedux';
import SessionActions from '../../Redux/SessionRedux';

import {Fonts, Metrics, Colors, Images} from '../../Themes';
import Icon from 'react-native-vector-icons/EvilIcons';
import Icon2 from 'react-native-vector-icons/AntDesign';

import Button from '../../Components/FullButton';
import Input from '../../Components/Input';
import Text from '../../Components/Text';
import Spacer from '../../Components/Spacer';
import ModalSetupUrl from '../../Components/ModalSetupUrl';

const schema = Yup.object().shape({
  usernama: Yup.string()
    .required('Mohon lengkapi Usernama Anda'),
  password: Yup.string()
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
      password: values.password,
    };

    this.props.loginRequest(data);
  }

  renderForm(props) {
    return (
      <View
        style={{
          paddingHorizontal: Metrics.doubleBaseMargin,
          paddingTop: Metrics.doubleBaseMargin,
        }}>
        <Input
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
          placeholder="Password"
          name="password"
          maxLength={20}
          secureTextEntry
          value={props.values.password}
          error={props.errors.password}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
          leftIcon={<Icon name="lock" size={30} color={Colors.primary} />}
        />
        <Button
          onPress={(e) => {
            props.handleSubmit(e);
          }}
          style={{marginTop: Metrics.doubleBaseMargin}}
          text="Masuk"
        />
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
        <View
          style={{
            alignSelf: 'center',
            marginTop: 20,
            paddingHorizontal: Metrics.doubleBaseMargin,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Image
              source={Images.logo}
              style={{
                height: 50,
                width: 50,
                marginVertical: 15,
                marginRight: 10,
              }}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text
              style={{
                fontSize: Fonts.size.regular,
                fontFamily: Fonts.type.bold,
              }}>
              LK Produksi by Mac-id
            </Text>
          </View>
          <Text
            style={{
              marginTop: 40,
              fontSize: Fonts.size.h6,
              fontFamily: Fonts.type.bold,
            }}>
            Selamat Datang,
          </Text>
          <Text style={{marginTop: 10}}>
            Silakan login menggunakan Email dan Password Anda untuk masuk
          </Text>
        </View>

        <Formik
          onSubmit={this.handleSubmit}
          validationSchema={schema}
          render={this.renderForm}
        />
        <TouchableOpacity
          onPress={() => this.modalSetupUrl.show()}
          style={styles.footer}>
          <Icon2 name="setting" size={20} />
          <Spacer width={10} />
          <Text>Setup URL</Text>
        </TouchableOpacity>

        <ModalSetupUrl setRef={(r) => (this.modalSetupUrl = r)} />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  doLoginStatus: state.auth.doLogin,
});

const mapDispatchToProps = (dispatch) => ({
  loginRequest: (data) => dispatch(AuthActions.loginRequest(data)),
  setLogin: (params) => dispatch(SessionActions.setLogin(params)),
  setTypeBoarding: (params) => dispatch(SessionActions.setTypeBoarding(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
