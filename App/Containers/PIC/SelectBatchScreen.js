import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import {Colors} from '../../Themes';
import Text from '../../Components/Text';
import SessionActions, {SessionSelectors} from '../../Redux/SessionRedux';
import NavigationServices from '../../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';
import Spacer from '../../Components/Spacer';
import InputDate from '../../Components/InputDate';

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
    borderRadius: 10
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
    flexDirection: 'row'
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

class SelectBatchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      batchSelected: undefined,
      kitchenSelected: undefined
    };
 
    this.renderItemBatch = this.renderItemBatch.bind(this);
    this.renderItemKitchen = this.renderItemKitchen.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this);
    this.onPressDone = this.onPressDone.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      NavigationServices.setParams({onPressDone: this.onPressDone});
    }, 500);
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

    NavigationServices.navigate(NAVIGATION_NAME.PIC.formBatch);
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
          borderWidth: 2
        }
      : {};

    return (
      <TouchableOpacity
        onPress={() => this.setState({batchSelected: item})}
        style={[styles.row, style]}>
        <View>
          <Text>2309011.1c{item}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderItemKitchen(item) {
    const isSelected = item === this.state.kitchenSelected;
    const style = isSelected
      ? {
          borderColor: Colors.primary,
          borderWidth: 2
        }
      : {};

    return (
      <TouchableOpacity
        onPress={() => this.setState({kitchenSelected: item})}
        style={[styles.row, style]}>
        <View>
          <Text>2309011.1c{item}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderForm(props) {
    return (
      <View style={styles.form}>
        <InputDate
          title="Start Date"
          placeholder="Start Date"
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
            props.values.end_date ? new Date(props.values.end_date) : undefined
          }
        />
        <Spacer width={10} />
        <InputDate
          title="End Date"
          placeholder="End Date"
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
    );
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.content}>
        <Formik
          onSubmit={this.handleSubmit}
          validationSchema={schema}
          render={this.renderForm}
        />
        <Spacer height={20} />
          <Text style={styles.title}>Select Batch</Text>
          {[1, 2, 3, 4].map((item) => this.renderItemBatch(item))}
          <Spacer height={10} />
          <Text style={styles.title}>Select Kitchen</Text>
          {[1, 2, 3, 4].map((item) => this.renderItemKitchen(item))}
        </View>
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  saveBatch: (params) => dispatch(SessionActions.saveBatch(params)),
  saveKitchen: (params) => dispatch(SessionActions.saveKitchen(params)),
});

export default connect(null, mapDispatchToProps)(SelectBatchScreen);
