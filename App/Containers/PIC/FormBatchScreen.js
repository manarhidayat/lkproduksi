import React, {Component} from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {createSelector} from 'reselect';
import {connect} from 'react-redux';
import {ApplicationStyles, Colors} from '../../Themes';
import Text from '../../Components/Text';
import Input from '../../Components/Input';
import SessionActions, {SessionSelectors} from '../../Redux/SessionRedux';
import OperationActions, {OperationSelectors} from '../../Redux/OperationRedux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import FullButton from '../../Components/FullButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: Colors.background,
    padding: 16,
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

class FormBatchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderForm = this.renderForm.bind(this);
  }

  componentDidMount() {
    const {getDetailBatchRequest, batch} = this.props;
    getDetailBatchRequest({id: batch.woi_code});
  }

  handleSubmit(values) {
    const {meterGas} = values;
    const {kitchen, batch, beginOperationRequest, setStartGas} = this.props;

    const params = {
      material_request_id: batch.woi_oid,
      kitchen_id: kitchen.mch_id,
      batch_no: batch.woi_remarks,
      gas_start: meterGas,
    };

    setStartGas(meterGas);
    beginOperationRequest(params);
  }

  renderForm(props) {
    const {detailBatch} = this.props;
    return (
      <View>
        <Text style={styles.textTitle}>Gas</Text>
        <Input
          title="Meter Gas"
          placeholder="Meter Gas"
          name="meterGas"
          keyboardType="number-pad"
          value={props.values.meterGas}
          error={props.errors.meterGas}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
        />
        <FullButton
          onPress={(e) => {
            props.handleSubmit(e);
          }}
          style={{marginTop: 40}}
          text={'Mulai'}
        />
      </View>
    );
  }

  render() {
    const {batch, detailBatch} = this.props;

    let schema = {
      meterGas: Yup.string().required('Mohon lengkapi Meter Gas'),
    };

    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          <View style={styles.container}>
            <Formik
              onSubmit={this.handleSubmit}
              validationSchema={Yup.object().shape(schema)}
              render={this.renderForm}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const selector = createSelector(
  [
    SessionSelectors.selectBatch,
    SessionSelectors.selectKitchen,
    OperationSelectors.getDetailBatch,
  ],
  (batch, kitchen, detailBatch) => ({
    batch,
    kitchen,
    detailBatch,
  })
);

const mapStateToProps = (state) => selector(state);

const mapDispatchToProps = (dispatch) => ({
  setTypeBoarding: (params) => dispatch(SessionActions.setTypeBoarding(params)),
  setStartGas: (params) => dispatch(OperationActions.setStartGas(params)),

  beginOperationRequest: (params) =>
    dispatch(OperationActions.beginOperationRequest(params)),
  getDetailBatchRequest: (params) =>
    dispatch(OperationActions.getDetailBatchRequest(params)),
  setDetailMaterial: (params) =>
    dispatch(OperationActions.setDetailMaterial(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormBatchScreen);
