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
import InputSelect from '../../Components/InputSelect';

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

const TYPE = [
  {
    id: 'P',
    name: 'Preparing',
  },
  {
    id: 'L',
    name: 'Loading',
  },
  {
    id: 'D',
    name: 'Disassembly',
  },
];

class ReportScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.renderItem = this.renderItem.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const {getReportsRequest} = this.props;
    const start_date = moment(new Date()).add(-1, 'day').format('YYYY-MM-DD');
    const end_date = moment(new Date()).format('YYYY-MM-DD');
    getReportsRequest({start_date, end_date});
  }

  handleSubmit(values) {
    const {start_date, end_date, type} = values;
    const {getReportsRequest} = this.props;

    getReportsRequest({start_date, end_date, type: type.id});
  }

  renderForm(props) {
    return (
      <View style={{}}>
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
        <InputSelect
          name="type"
          placeholder="Type"
          title="Type"
          editable={true}
          data={TYPE}
          value={props.values.type ? props.values.type.name : props.values.type}
          onSelect={(item) => {
            props.setFieldValue('type', item);
          }}
        />
        <FullButton
          onPress={(e) => {
            props.handleSubmit(e);
          }}
          text={'CARI'}
        />
      </View>
    );
  }

  renderItem({item}) {
    const {cartSelected} = this.state;
    const isSelected = cartSelected && cartSelected.pt_code === item.pt_code;
    const {detail} = item;
    let desc = '';
    for (let i = 0; i < detail.length; i++) {
      if (i !== 0) {
        desc = desc + ', ';
      }
      desc = desc + detail[i].pt_desc1;
    }
    return (
      <TouchableOpacity
        onPress={() =>
          NavigationServices.push(NAVIGATION_NAME.HOME.detailReport, {item})
        }
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
        <Text>Ket: {desc}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const {reports} = this.props;
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
          data={reports || []}
          renderItem={this.renderItem}
          ListEmptyComponent={() => {
            return (
              <View style={{flex: 1, alignItems: 'center', marginTop: 30}}>
                <Text>Tidak ada Data No. Penetapan</Text>
              </View>
            );
          }}
        />
      </View>
    );
  }
}
const selector = createSelector([OperationSelectors.getReports], (reports) => ({
  reports,
}));

const mapDispatchToProps = (dispatch) => ({
  getReportsRequest: (data) =>
    dispatch(OperationActions.getReportsRequest(data)),
});

const mapStateToProps = (state) => selector(state);

export default connect(mapStateToProps, mapDispatchToProps)(ReportScreen);
