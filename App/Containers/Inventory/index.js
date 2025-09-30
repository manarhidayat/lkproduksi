import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Colors, Images, Fonts} from '../../Themes';
import Icon from 'react-native-vector-icons/Entypo';

import Text from '../../Components/Text';
import NavigationServices from '../../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';
import Spacer from '../../Components/Spacer';
import InventoryActions, {InventorySelectors} from '../../Redux/InventoryRedux';
import SessionActions from '../../Redux/SessionRedux';
import InputDate from '../../Components/InputDate';
import FullButton from '../../Components/FullButton';
import {SessionSelectors} from '../../Redux/SessionRedux';
import moment from 'moment';

const styles = StyleSheet.create({
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: Colors.greyLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  item: {
    padding: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.border,
    margin: 5,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    elevation: 1.5,
    marginTop: 10,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 50,
  },
  contentHeader: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    flex: 1,
    height: 100,
    width: 150,
    marginTop: 20,
    marginRight: 10,
  },
  flexRow: {flexDirection: 'row', alignItems: 'center'},
  containerStatus: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  textTime: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  textBatch: {
    fontWeight: 'bold',
    fontSize: 21,
  },
  form: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
});

const STORAGE_PERM =
  Platform.OS === 'android'
    ? Platform.Version >= 33
      ? // Android 13+: pilih yang relevan. TAPI untuk Excel (dokumen), permission ini tetap tidak membantu.
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
      : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    : PERMISSIONS.IOS.MEDIA_LIBRARY;

class InventoryScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      params: '',
      start_date: moment(new Date()).add(-2, 'day').format('YYYY-MM-DD'),
      end_date: moment(new Date()).format('YYYY-MM-DD'),
    };
    this.renderItem = this.renderItem.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this);
    this.onPressLogout = this.onPressLogout.bind(this);
    this.renderHeaderItem = this.renderHeaderItem.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onPressFilter = this.onPressFilter.bind(this);
  }

  componentDidMount() {
    const {navigation} = this.props;

    navigation.setParams({onPressLogout: this.onPressLogout});

    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.fetchData();
    });

    this.requestStoragePermission();
  }

  async requestStoragePermission() {
    const status = await check(STORAGE_PERM);

    if (status === RESULTS.GRANTED) return true;

    if (status === RESULTS.BLOCKED) {
      // = never_ask_again
      Alert.alert(
        'Izin diperlukan',
        'Aktifkan izin di Pengaturan agar aplikasi bisa membaca file.',
        [
          {text: 'Batal', style: 'cancel'},
          {text: 'Buka Pengaturan', onPress: () => openSettings()},
        ]
      );
      return false;
    }

    // DENIED/limited/unavailable → coba request
    const req = await request(STORAGE_PERM);
    if (req === RESULTS.GRANTED) return true;

    if (req === RESULTS.BLOCKED) {
      Alert.alert(
        'Izin diblokir',
        'Aktifkan izin secara manual di Pengaturan.',
        [
          {text: 'Batal', style: 'cancel'},
          {text: 'Buka Pengaturan', onPress: () => openSettings()},
        ]
      );
    }
    return false;
  }

  componentWillUnmount() {
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  fetchData() {
    const {
      getEntityRequest,
      getChecksheetRequest,
      getBranchRequest,
      user,
      getCustomerRequest,
    } = this.props;

    setTimeout(() => {
      const {start_date, end_date} = this.state;
      getEntityRequest();
      getChecksheetRequest({start: start_date, end: end_date});
      getBranchRequest({en_id: user.en_id, user_id: user.userid});
      getCustomerRequest({en_id: user.en_id});
    }, 300);
  }

  handleSubmit(values) {
    const {start_date, end_date} = this.state;
    const {getChecksheetRequest} = this.props;

    getChecksheetRequest({start: start_date, end: end_date});
  }

  onPressFilter(item) {
    const {params} = this.state;
    this.setState({params: params === item ? '' : item});
  }

  onPressLogout() {
    Alert.alert(
      'Peringatan',
      'Apakan Anda akan keluar aplikasi?',
      [
        {
          text: 'Batal',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            this.props.setLogin(false);
            this.props.removeSession();
          },
        },
      ],
      {cancelable: false}
    );
  }

  renderHeaderItem({item}) {
    const {params} = this.state;
    return (
      <TouchableOpacity
        onPress={() => this.onPressFilter(item.id)}
        style={[
          styles.contentHeader,
          {borderColor: params === item.id ? Colors.primary : Colors.border},
        ]}>
        <Text style={{fontSize: 32}}>{item.value}</Text>
        <Spacer height={10} />
        <View style={styles.flexRow}>
          {item.icon}
          <Spacer width={10} />
          <Text style={{flex: 1}}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderEmpty() {
    return (
      <View style={styles.empty}>
        <Text>Tidak ada Entity</Text>
      </View>
    );
  }

  renderItem({item}) {
    const {deleteChecksheetRequest, branch, customer} = this.props;
    const {
      chksheet_add_by,
      chksheet_add_date,
      chksheet_code,
      chksheet_trans_rmks,
    } = item;

    let branchSelected = {};
    if (branch) {
      branchSelected = branch.find(
        (loc) => loc.branch_id === item.chksheet_branch_id
      );
    }

    let customerSelected = {};

    if (customer) {
      customerSelected = customer.find(
        (loc) => loc.ptnr_id === item.chksheet_ptnr_id_sold
      );
    }

    return (
      <TouchableOpacity
        onPress={() =>
          NavigationServices.navigate(NAVIGATION_NAME.HOME.detailChecksheet, {
            chksheet: item,
            chksheet_oid: item.chksheet_oid,
            chksheet_en_id: item.chksheet_en_id,
          })
        }
        style={styles.item}>
        <Text>{chksheet_add_date}</Text>
        <Text>{chksheet_add_by}</Text>
        <Text>{chksheet_code}</Text>
        <Text>{branchSelected ? branchSelected.branch_name : ''}</Text>
        <Text>{customerSelected ? customerSelected.ptnr_code : ''}</Text>
        <Text>{customerSelected ? customerSelected.ptnr_name : ''}</Text>
        <Text>
          {customerSelected
            ? `${customerSelected.ptnra_line_1} ${customerSelected.ptnra_line_2} ${customerSelected.ptnra_line_3}`
            : ''}
        </Text>
        <Text>{chksheet_trans_rmks || ''}</Text>

        <View
          style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              NavigationServices.push(NAVIGATION_NAME.HOME.addChecksheet, {
                chksheet: item,
                isEdit: true,
              });
            }}>
            <Text style={{color: Colors.primary, fontWeight: 'bold'}}>
              Edit
            </Text>
          </TouchableOpacity>
          <Spacer width={16} />
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                '',
                'Apakah Anda yakin akan menghapus checksheet ini?',
                [
                  {
                    text: 'Tidak',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'Ya',
                    onPress: () => {
                      deleteChecksheetRequest(
                        {
                          chksheet_oid: item.chksheet_oid,
                        },
                        () => {
                          this.fetchData();
                        }
                      );
                    },
                  },
                ],
                {cancelable: false}
              );
            }}>
            <Text style={{color: 'red', fontWeight: 'bold'}}>Hapus</Text>
          </TouchableOpacity>
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
            value={this.state.start_date}
            containerStyle={{flex: 0.5}}
            mode="date"
            onSelect={(item) => {
              this.setState({start_date: item});
            }}
            maximumDate={
              this.state.end_date ? new Date(this.state.end_date) : undefined
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
            value={this.state.end_date}
            onSelect={(item) => {
              this.setState({end_date: item});
            }}
            minimumDate={
              this.state.start_date
                ? new Date(this.state.start_date)
                : undefined
            }
          />
        </View>
        <FullButton
          onPress={(e) => {
            this.handleSubmit(e);
          }}
          text={'CARI CHECKSHEET'}
        />
      </View>
    );
  }

  render() {
    const {user, checksheet, getChecksheetFetching} = this.props;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.content}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.avatar}>
              <Icon name="user" size={25} color={'grey'} />
            </View>
            <Spacer width={10} />
            <View>
              <Text>Halo, {user.usernama}</Text>
              <Text>{user.nama_branch}</Text>
            </View>
          </View>
          <Spacer height={20} />
          {this.renderForm()}
          {getChecksheetFetching ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              contentContainerStyle={{
                flexGrow: 1,
              }}
              style={{marginBottom: 220}}
              data={checksheet}
              refreshing={getChecksheetFetching}
              renderItem={this.renderItem}
              ListEmptyComponent={this.renderEmpty}
            />
          )}
        </View>
        <TouchableOpacity
          onPress={() =>
            NavigationServices.push(NAVIGATION_NAME.HOME.addChecksheet)
          }
          style={styles.fab}>
          <Icon name="plus" size={25} color={'white'} />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const selector = createSelector(
  [
    SessionSelectors.selectUser,
    InventorySelectors.getChecksheet,
    InventorySelectors.getChecksheetFetching,
    InventorySelectors.getBranch,
    InventorySelectors.getCustomer,
  ],
  (user, checksheet, getChecksheetFetching, branch, customer) => ({
    user,
    checksheet,
    getChecksheetFetching,
    branch,
    customer,
  })
);

const mapStateToProps = (state, props) => {
  return selector(state);
};

const mapDispatchToProps = (dispatch) => ({
  getEntityRequest: (params) =>
    dispatch(InventoryActions.getEntityRequest(params)),
  getChecksheetRequest: (params) =>
    dispatch(InventoryActions.getChecksheetRequest(params)),
  updateChecksheetRequest: (params) =>
    dispatch(InventoryActions.updateChecksheetRequest(params)),
  deleteChecksheetRequest: (params, callback) =>
    dispatch(InventoryActions.deleteCheckseetRequest(params, callback)),
  setLogin: (params) => dispatch(SessionActions.setLogin(params)),
  removeSession: (params) => dispatch(SessionActions.removeSession(params)),
  getBranchRequest: (params) =>
    dispatch(InventoryActions.getBranchRequest(params)),
  getCustomerRequest: (params) =>
    dispatch(InventoryActions.getCustomerRequest(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InventoryScreen);
