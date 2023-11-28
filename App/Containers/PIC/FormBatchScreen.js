import React, {Component} from 'react';
import {TouchableOpacity, View, StyleSheet, SafeAreaView} from 'react-native';
import {createSelector} from 'reselect';
import {connect} from 'react-redux';
import {ApplicationStyles, Colors} from '../../Themes';
import Text from '../../Components/Text';
import Input from '../../Components/Input';
import SessionActions, {SessionSelectors} from '../../Redux/SessionRedux';
import NavigationServices from '../../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';
import Spacer from '../../Components/Spacer';
import {Formik} from 'formik';
import * as Yup from 'yup';
import FullButton from '../../Components/FullButton';
import {TYPE_ONBOARDING} from '../../Lib/Constans';

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
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
  textTitle: {fontWeight: 'bold', },
  titleContainer: {
    marginBottom: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderColor: 'grey'
  }
});

const schema = Yup.object().shape({
  // email: Yup.string()
  //   .email('Mohon masukan format Email dengan benar')
  //   .required('Mohon lengkapi Email Anda'),
  // password: Yup.string()
  //   .min(6, 'Min 6 Karakter')
  //   .required('Mohon lengkapi Kata Sandi Anda')
});

class FormBatchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderForm = this.renderForm.bind(this);
  }

  handleSubmit(values) {
    const {setTypeBoarding} = this.props;
    setTypeBoarding(TYPE_ONBOARDING.timer);
    NavigationServices.pop();
    setTimeout(() => {
      NavigationServices.replace(NAVIGATION_NAME.PIC.timer);
    }, 1);
  }

  renderForm(props) {
    const {route} = this.props;
    return (
      <View style={styles.content}>
        <View style={[styles.row, styles.titleContainer]}>
          <Text style={[styles.textTitle, {flex: 1}]}>Material</Text>
          <Text style={[styles.textTitle, {flex: 0.5}]}>Plan</Text>
          <Text style={[styles.textTitle, {flex: 0.5}]}>Actual</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.textLabel}>BASE METAL</Text>
          <Input
            placeholder=" "
            name="baseMetalPlan"
            keyboardType="number-pad"
            containerStyle={styles.inputPlan}
            value={props.values.baseMetalPlan}
            error={props.errors.baseMetalPlan}
            setFieldValue={props.setFieldValue}
            setFieldTouched={() => {}}
          />
          <Spacer width={10} />
          <Input
            placeholder=" "
            name="baseMetalActual"
            keyboardType="number-pad"
            containerStyle={styles.inputActual}
            value={props.values.baseMetalActual}
            error={props.errors.baseMetalActual}
            setFieldValue={props.setFieldValue}
            setFieldTouched={() => {}}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.textLabel}>AL RONGSOK</Text>
          <Input
            placeholder=" "
            name="rongsokPlan"
            keyboardType="number-pad"
            containerStyle={styles.inputPlan}
            value={props.values.rongsokPlan}
            error={props.errors.rongsokPlan}
            setFieldValue={props.setFieldValue}
            setFieldTouched={() => {}}
          />
          <Spacer width={10} />
          <Input
            placeholder=" "
            name="rongsokActual"
            keyboardType="number-pad"
            containerStyle={styles.inputActual}
            value={props.values.rongsokActual}
            error={props.errors.rongsokActual}
            setFieldValue={props.setFieldValue}
            setFieldTouched={() => {}}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.textLabel}>AL GT</Text>
          <Input
            placeholder=" "
            name="gtPlan"
            keyboardType="number-pad"
            containerStyle={styles.inputPlan}
            value={props.values.gtPlan}
            error={props.errors.gtPlan}
            setFieldValue={props.setFieldValue}
            setFieldTouched={() => {}}
          />
          <Spacer width={10} />
          <Input
            placeholder=" "
            name="gtActual"
            keyboardType="number-pad"
            containerStyle={styles.inputActual}
            value={props.values.gtActual}
            error={props.errors.gtActual}
            setFieldValue={props.setFieldValue}
            setFieldTouched={() => {}}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.textLabel}>AL CHIP SS</Text>
          <Input
            placeholder=" "
            name="chipSSPlan"
            keyboardType="number-pad"
            containerStyle={styles.inputPlan}
            value={props.values.chipSSPlan}
            error={props.errors.chipSSPlan}
            setFieldValue={props.setFieldValue}
            setFieldTouched={() => {}}
          />
          <Spacer width={10} />
          <Input
            placeholder=" "
            name="chipSSActual"
            keyboardType="number-pad"
            containerStyle={styles.inputActual}
            value={props.values.chipSSActual}
            error={props.errors.chipSSActual}
            setFieldValue={props.setFieldValue}
            setFieldTouched={() => {}}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.textLabel}>AL CHIP AWI</Text>
          <Input
            placeholder=" "
            name="chipAwiPlan"
            keyboardType="number-pad"
            containerStyle={styles.inputPlan}
            value={props.values.chipAwiPlan}
            error={props.errors.chipAwiPlan}
            setFieldValue={props.setFieldValue}
            setFieldTouched={() => {}}
          />
          <Spacer width={10} />
          <Input
            placeholder=" "
            name="chipAwiActual"
            keyboardType="number-pad"
            containerStyle={styles.inputActual}
            value={props.values.chipAwiActual}
            error={props.errors.chipAwiActual}
            setFieldValue={props.setFieldValue}
            setFieldTouched={() => {}}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.textLabel}>AL CHIP AHM</Text>
          <Input
            placeholder=" "
            name="chipAhmPlan"
            keyboardType="number-pad"
            containerStyle={styles.inputPlan}
            value={props.values.chipAhmPlan}
            error={props.errors.chipAhmPlan}
            setFieldValue={props.setFieldValue}
            setFieldTouched={() => {}}
          />
          <Spacer width={10} />
          <Input
            placeholder=" "
            name="chipAhmActual"
            keyboardType="number-pad"
            containerStyle={styles.inputActual}
            value={props.values.chipAhmActual}
            error={props.errors.chipAhmActual}
            setFieldValue={props.setFieldValue}
            setFieldTouched={() => {}}
          />
        </View>
        <FullButton
          onPress={(e) => {
            props.handleSubmit(e);
          }}
          style={{marginTop: 40}}
          text={'Begin Charging'}
        />
      </View>
    );
  }

  render() {
    const {batch} = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <Text style={styles.title}>Batch: {batch}</Text>
          <Spacer height={10} />
          <Formik
            onSubmit={this.handleSubmit}
            validationSchema={schema}
            render={this.renderForm}
            // initialValues={
            //   {
            //     // name: isEdit ? inventory.name : ''
            //   }
            // }
          />
        </View>
      </SafeAreaView>
    );
  }
}

const selector = createSelector([SessionSelectors.selectBatch], (batch) => ({
  batch,
}));

const mapStateToProps = (state) => selector(state);

const mapDispatchToProps = (dispatch) => ({
  setTypeBoarding: (params) => dispatch(SessionActions.setTypeBoarding(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormBatchScreen);
