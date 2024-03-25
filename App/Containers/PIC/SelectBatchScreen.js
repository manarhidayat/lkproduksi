import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {createSelector} from 'reselect';
import {connect} from 'react-redux';
import {Colors} from '../../Themes';
import Text from '../../Components/Text';
import SessionActions from '../../Redux/SessionRedux';
import OperationActions, {OperationSelectors} from '../../Redux/OperationRedux';
import NavigationServices from '../../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';
import Spacer from '../../Components/Spacer';
import InputDate from '../../Components/InputDate';
import FullButton from '../../Components/FullButton';
import {getStatusOperation} from '../../Lib/Helper';
import moment from 'moment';

const styles = StyleSheet.create({
  row: {
    padding: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 10,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  form: {
    flexDirection: 'row',
  },
  containerStatus: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    width: 160,
    alignItems: 'center',
  },
});

const schema = Yup.object().shape({
  // email: Yup.string()
  //   .email('Mohon masukan format Email dengan benar')
  //   .required('Mohon lengkapi Email Anda'),
  // password: Yup.string()
  //   .min(6, 'Min 6 Karakter')
  //   .required('Mohon lengkapi Kata Sandi Anda')
});

class SelectBatchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      batchSelected: undefined,
      kitchenSelected: undefined,
    };

    this.renderItemBatch = this.renderItemBatch.bind(this);
    this.renderItemKitchen = this.renderItemKitchen.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this);
    this.onPressDone = this.onPressDone.bind(this);
    this.onPressLogout = this.onPressLogout.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const {getListKitchenRequest, getListBatchRequest, batches} = this.props;

    setTimeout(() => {
      NavigationServices.setParams({onPressLogout: this.onPressLogout});
      getListKitchenRequest();

      if (batches.length < 1) {
        const start_date = moment(new Date())
          .add(-1, 'day')
          .format('YYYY-MM-DD');
        const end_date = moment(new Date()).format('YYYY-MM-DD');
        getListBatchRequest({start_date, end_date});
      }
    }, 500);
  }

  handleSubmit(values) {
    const {start_date, end_date} = values;
    const {getListBatchRequest} = this.props;

    getListBatchRequest({start_date, end_date});
  }

  onPressLogout() {
    Alert.alert(
      'Peringatan',
      'Apakan Anda akan keluar aplikasi?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            this.props.setLogin(false);
            this.props.removeSession();
            this.props.removeOperations();
          },
        },
      ],
      {cancelable: false}
    );
  }

  onPressDone() {
    const {batchSelected, kitchenSelected} = this.state;
    const {saveBatch, saveKitchen} = this.props;

    if (batchSelected === undefined || kitchenSelected === undefined) {
      Alert.alert('Warning', 'Please choose Batch & Kitchen first');
      return;
    }

    saveBatch(batchSelected);
    saveKitchen(kitchenSelected);

    NavigationServices.navigate(NAVIGATION_NAME.PIC.formBatch, {
      batch: batchSelected,
    });
  }

  renderEmpty() {
    return (
      <View style={styles.empty}>
        <Text>There is no Machine</Text>
      </View>
    );
  }

  renderItemBatch(item) {
    const isSelected = item === this.state.batchSelected;
    const style = isSelected
      ? {
          borderColor: Colors.primary,
          borderWidth: 2,
        }
      : {};

    const {status, statusColor, statusBackground} = getStatusOperation(item);

    return (
      <TouchableOpacity
        onPress={() =>
          status === '' ? this.setState({batchSelected: item}) : {}
        }
        style={[styles.row, style]}>
        <View style={{flex: 1}}>
          <Text>{item.woi_remarks}</Text>
          {status !== '' && (
            <>
              <Spacer height={8} />
              <View
                style={[
                  styles.containerStatus,
                  {backgroundColor: statusBackground},
                ]}>
                <Text style={{fontWeight: 'bold', color: statusColor}}>
                  {status}
                </Text>
              </View>
            </>
          )}
          <Spacer height={8} />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>{item.woi_code}</Text>
            <Text>
              {item.woi_date
                ? moment(item.woi_date, 'YYYY-MM-DD').format('DD-MM-YYYY')
                : '-'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderItemKitchen(item) {
    const isSelected = item === this.state.kitchenSelected;
    const style = isSelected
      ? {
          borderColor: Colors.primary,
          borderWidth: 2,
        }
      : {};

    return (
      <TouchableOpacity
        onPress={() => this.setState({kitchenSelected: item})}
        style={[styles.row, style]}>
        <View>
          <Text>{item.mch_name}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderForm(props) {
    return (
      <View>
        <View style={styles.form}>
          <InputDate
            title="Tanggal Awal"
            placeholder="Tanggal Awal"
            name="start_date"
            pointerEvents="none"
            editable={true}
            selectTextOnFocus={false}
            value={props.values.start_date}
            error={props.errors.start_date}
            containerStyle={{flex: 0.5}}
            mode="date"
            onSelect={(item) => {
              props.setFieldValue('start_date', item);
            }}
            setFieldTouched={() => {}}
            maximumDate={
              props.values.end_date
                ? new Date(props.values.end_date)
                : undefined
            }
          />
          <Spacer width={10} />
          <InputDate
            title="Tanggal Akhir"
            placeholder="Tanggal Akhir"
            name="end_date"
            pointerEvents="none"
            editable={true}
            selectTextOnFocus={false}
            containerStyle={{flex: 0.5}}
            mode="date"
            value={props.values.end_date}
            error={props.errors.end_date}
            onSelect={(item) => {
              props.setFieldValue('end_date', item);
            }}
            setFieldTouched={() => {}}
            minimumDate={
              props.values.start_date
                ? new Date(props.values.start_date)
                : undefined
            }
          />
        </View>
        <FullButton
          onPress={(e) => {
            props.handleSubmit(e);
          }}
          text={'CARI BATCH'}
        />
      </View>
    );
  }

  render() {
    const {kitchens, batches} = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          <View style={styles.content}>
            <Formik
              onSubmit={this.handleSubmit}
              validationSchema={schema}
              render={this.renderForm}
              initialValues={{
                start_date: moment(new Date())
                  .add(-1, 'day')
                  .format('YYYY-MM-DD'),
                end_date: moment(new Date()).format('YYYY-MM-DD'),
              }}
            />
            <Spacer height={20} />
            {batches && batches.length > 0 ? (
              <>
                <Text style={styles.title}>Pilih Batch</Text>
                {batches && batches.map((item) => this.renderItemBatch(item))}
              </>
            ) : (
              <>
                <Text>Batch tidak ditemukan</Text>
                <Spacer height={20} />
              </>
            )}
            <Spacer height={10} />
            <Text style={styles.title}>Pilih Kitchen</Text>
            {kitchens && kitchens.map((item) => this.renderItemKitchen(item))}
            <FullButton onPress={this.onPressDone} text="PILIH" />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const selector = createSelector(
  [OperationSelectors.getKitchens, OperationSelectors.getBatchs],
  (kitchens, batches) => {
    return {
      kitchens,
      batches,
    };
  }
);

const mapStateToProps = (state) => {
  return selector(state);
};

const mapDispatchToProps = (dispatch) => ({
  saveBatch: (params) => dispatch(SessionActions.saveBatch(params)),
  saveKitchen: (params) => dispatch(SessionActions.saveKitchen(params)),

  getListKitchenRequest: (params) =>
    dispatch(OperationActions.getListKitchenRequest(params)),
  getListBatchRequest: (params) =>
    dispatch(OperationActions.getListBatchRequest(params)),

  setLogin: (params) => dispatch(SessionActions.setLogin(params)),
  removeSession: (params) => dispatch(SessionActions.removeSession(params)),
  removeOperations: (params) =>
    dispatch(OperationActions.removeOperations(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectBatchScreen);
