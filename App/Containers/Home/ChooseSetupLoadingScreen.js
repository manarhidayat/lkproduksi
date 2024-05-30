import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import {Formik} from 'formik';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {Colors, Images, Fonts} from '../../Themes';
import OperationActions, {OperationSelectors} from '../../Redux/OperationRedux';
import moment from 'moment';
import FullButton from '../../Components/FullButton';
import Spacer from '../../Components/Spacer';
import InputDate from '../../Components/InputDate';
import Text from '../../Components/Text';
import NavigationServices from '../../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';
import {getDataQr} from '../../Lib/Helper';

const styles = StyleSheet.create({
  menu: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  form: {
    flexDirection: 'row',
  },
  rowItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    marginBottom: 10,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },
});

class ChooseSetupLoadingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartSelected: null,
    };

    this.renderItem = this.renderItem.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const {getSetupLoadingRequest} = this.props;
    const start_date = moment(new Date()).add(-1, 'day').format('YYYY-MM-DD');
    const end_date = moment(new Date()).format('YYYY-MM-DD');
    getSetupLoadingRequest({start_date, end_date});
  }

  addToCart() {
    const {addLoading} = this.props;
    const {cartSelected} = this.state;
    if (cartSelected === null) {
      Alert.alert('Peringatan', 'Mohon pilih dulu no. penetapan');
      return;
    }

    const {detail} = cartSelected;

    for (let i = 0; i < detail.length; i++) {
      if (detail[i].rifd_qr_code) {
        const params = getDataQr(detail[i].rifd_qr_code);
        addLoading(params);
      }
    }
    NavigationServices.replace(NAVIGATION_NAME.HOME.scan, {type: 'L'});
  }

  handleSubmit(values) {
    const {start_date, end_date} = values;
    const {getSetupLoadingRequest} = this.props;

    getSetupLoadingRequest({start_date, end_date});
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
          text={'CARI NO PENETAPAN'}
        />
      </View>
    );
  }

  renderItem({item}) {
    const {cartSelected} = this.state;
    const isSelected = cartSelected && cartSelected.pt_code === item.pt_code;
    return (
      <TouchableOpacity
        onPress={() => this.setState({cartSelected: item})}
        style={[
          styles.rowItem,
          {
            borderWidth: isSelected ? 3 : 1,
            borderColor: isSelected ? Colors.primary : Colors.greyLight,
          },
        ]}>
        <Text>{item.pt_code}</Text>
        <Text>{item.rif_date}</Text>
        <Text>{item.rif_remarks}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const {penetepan} = this.props;
    const {cartSelected} = this.state;
    return (
      <View style={{flex: 1, padding: 16}}>
        <Formik
          onSubmit={this.handleSubmit}
          render={this.renderForm}
          initialValues={{
            start_date: moment(new Date()).add(-1, 'day').format('YYYY-MM-DD'),
            end_date: moment(new Date()).format('YYYY-MM-DD'),
          }}
        />
        <FlatList
          data={penetepan || []}
          renderItem={this.renderItem}
          ListEmptyComponent={() => {
            return (
              <View style={{flex: 1, alignItems: 'center', marginTop: 30}}>
                <Text>Tidak ada Data No. Penetapan</Text>
              </View>
            );
          }}
        />
        {cartSelected && (
          <FullButton
            onPress={() => {
              this.addToCart();
            }}
            text={'ADD TO CART'}
          />
        )}
      </View>
    );
  }
}
const selector = createSelector(
  [OperationSelectors.getSetupLoading],
  (penetepan) => ({
    penetepan,
  })
);

const mapDispatchToProps = (dispatch) => ({
  getSetupLoadingRequest: (data) =>
    dispatch(OperationActions.getSetupLoadingRequest(data)),
  addLoading: (data) => dispatch(OperationActions.addLoading(data)),
});

const mapStateToProps = (state) => selector(state);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseSetupLoadingScreen);
