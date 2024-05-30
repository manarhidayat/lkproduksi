import React, {Component} from 'react';
import {
  View,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
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
  usernama: Yup.string().required('Mohon lengkapi Usernama Anda'),
  password: Yup.string()
    .min(2, 'Min 2 Karakter')
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

  componentDidMount() {
    check(
      Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      })
    ).then((result) => {
      switch (result) {
        case RESULTS.GRANTED: {
          // granted
          break;
        }
        case RESULTS.DENIED: {
          setTimeout(() => {
            request(
              Platform.select({
                ios: PERMISSIONS.IOS.CAMERA,
                android: PERMISSIONS.ANDROID.CAMERA,
              })
            ).then((result2) => {
              switch (result2) {
                case RESULTS.GRANTED: {
                  // granted
                  break;
                }
                case RESULTS.DENIED:
                case RESULTS.BLOCKED: {
                  Alert.alert(
                    'Permission denied',
                    'you need to grant camera permission in the settings to continue',
                    [
                      {
                        onPress: async () => {
                          await Linking.openSettings();
                        },
                        text: 'ok',
                        style: 'default',
                      },
                    ]
                  );
                  break;
                }
                default: {
                  break;
                }
              }
            });
          }, 300);
          break;
        }
        case RESULTS.BLOCKED: {
          Alert.alert(
            'Permission denied',
            'you need to grant camera permission in the settings to continue',
            [
              {
                onPress: async () => {
                  await Linking.openSettings();
                },
                text: 'ok',
                style: 'default',
              },
            ]
          );
          break;
        }
        default: {
          break;
        }
      }
    });
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
            alignItems: 'center',
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
              Mac Id Frozen
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
          <Text style={{marginTop: 10, textAlign: 'center'}}>
            Silakan login menggunakan Usernama dan Password Anda untuk masuk
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
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
