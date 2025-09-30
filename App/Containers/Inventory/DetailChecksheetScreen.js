import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {Colors, Images, Fonts} from '../../Themes';

import Text from '../../Components/Text';
import NavigationServices from '../../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';
import InventoryActions, {InventorySelectors} from '../../Redux/InventoryRedux';
import {SessionSelectors} from '../../Redux/SessionRedux';
import FullButton from '../../Components/FullButton';
import Spacer from '../../Components/Spacer';

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
});

class DetailChecksheetScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: '',
    };
    this.renderItem = this.renderItem.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this);
  }

  componentDidMount() {
    this.fetchData();

    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.fetchData();
    });
  }

  componentWillUnmount() {
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.checksheetDetail !== this.props.checksheetDetail) {
      const {getLocationRequest, route} = this.props;
      setTimeout(() => {
        const chksheet_en_id = route?.params?.chksheet_en_id;
        if (this.props.checksheetDetail.chksheet_branch_id) {
          getLocationRequest({
            en_id: chksheet_en_id,
            branch_id: this.props.checksheetDetail.chksheet_branch_id,
          });
        }
      }, 300);
    }
  }

  fetchData() {
    const {
      route,
      getChecksheetDetailRequest,
      getBarangRequest,
      getLocationRequest,
      user,
    } = this.props;
    setTimeout(() => {
      const chksheet_oid = route?.params?.chksheet_oid;
      const chksheet_en_id = route?.params?.chksheet_en_id;
      getChecksheetDetailRequest(chksheet_oid);
      getBarangRequest({en_id: chksheet_en_id});
      // getLocationRequest({en_id: chksheet_en_id, branch_id: });
    }, 300);
  }

  renderEmpty() {
    return (
      <View style={styles.empty}>
        <Text>Tidak ada List Item</Text>
      </View>
    );
  }

  renderItem({item}) {
    const {route, barang, location, checksheetDetail} = this.props;

    const {
      chksheetd_dt,
      chksheetd_qty,
      chksheetd_um_conv,
      chksheetd_qty_real,
      chksheetd_qty_packaging,
    } = item;

    const barangSelected = barang
      ? barang.find((brg) => brg.pt_id === item.chksheetd_pt_id)
      : {};
    const locationSelected = location
      ? location.find((brg) => brg.loc_id === item.chksheetd_loc_id)
      : {};

    return (
      <TouchableOpacity
        onPress={() =>
          NavigationServices.navigate(NAVIGATION_NAME.HOME.detailListItem, {
            detail: item,
            chksheet: checksheetDetail,
          })
        }
        style={styles.item}>
        <Text>
          Part Number: {barangSelected ? barangSelected.pt_code : '-'}
        </Text>
        <Text>Desc1: {barangSelected ? barangSelected.pt_desc1 : '-'}</Text>
        <Text>Desc2: {barangSelected ? barangSelected.pt_desc2 : '-'}</Text>
        <Text>Lot/Serial: {barangSelected ? barangSelected.pt_ls : '-'}</Text>
        <Text>
          Qty: {chksheetd_qty ? parseFloat(chksheetd_qty).toFixed(2) : '-'}
        </Text>
        <Text>UM: {barangSelected ? barangSelected.um_name : '-'}</Text>
        <Text>
          UM Conversion:{' '}
          {chksheetd_um_conv ? parseFloat(chksheetd_um_conv).toFixed(2) : '-'}
        </Text>
        <Text>
          Qty Real:{' '}
          {chksheetd_qty_real ? parseFloat(chksheetd_qty_real).toFixed(2) : '-'}
        </Text>
        <Text>
          Qty Packaging:{' '}
          {chksheetd_qty_packaging
            ? parseFloat(chksheetd_qty_packaging).toFixed(2)
            : '-'}
        </Text>

        <Text>
          Location: {locationSelected ? locationSelected.loc_desc : '-'}
        </Text>
        <Text>{chksheetd_dt}</Text>
        <View
          style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              NavigationServices.navigate(NAVIGATION_NAME.HOME.addListItem, {
                detail: item,
                chksheet: checksheetDetail,
                isEdit: true,
              });
            }}>
            <Text style={{color: Colors.primary, fontWeight: 'bold'}}>
              Edit
            </Text>
          </TouchableOpacity>
          <Spacer width={16} />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      getChecksheetDetailFetching,
      route,
      checksheetDetail,
      branch,
      customer,
    } = this.props;

    let branchSelected = {};
    if (branch && checksheetDetail) {
      branchSelected = branch.find(
        (loc) => loc.branch_id === checksheetDetail.chksheet_branch_id
      );
    }

    let customerSelected = {};

    if (customer && checksheetDetail) {
      customerSelected = customer.find(
        (loc) => loc.ptnr_id === checksheetDetail.chksheet_ptnr_id_sold
      );
    }

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.content}>
          <View>
            <Text>
              {checksheetDetail ? checksheetDetail.chksheet_add_date : ''}
            </Text>
            <Text>
              {checksheetDetail ? checksheetDetail.chksheet_add_by : ''}
            </Text>
            <Text>
              {checksheetDetail ? checksheetDetail.chksheet_code : ''}
            </Text>
            <Text>{branchSelected ? branchSelected.branch_name : ''}</Text>
            <Text>{customerSelected ? customerSelected.ptnr_name : ''}</Text>
            <Text>
              {customerSelected
                ? `${customerSelected.ptnra_line_1} ${customerSelected.ptnra_line_2} ${customerSelected.ptnra_line_3}`
                : ''}
            </Text>
            <Text>
              {checksheetDetail ? checksheetDetail.chksheet_trans_rmks : ''}
            </Text>
          </View>
          <FullButton
            text={'Tambah List Item'}
            style={{width: 200}}
            onPress={() =>
              NavigationServices.push(NAVIGATION_NAME.HOME.addListItem, {
                chksheet: checksheetDetail,
              })
            }
          />
          {getChecksheetDetailFetching ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              contentContainerStyle={{
                flexGrow: 1,
              }}
              style={{marginBottom: 250}}
              data={checksheetDetail ? checksheetDetail.details : []}
              renderItem={this.renderItem}
              ListEmptyComponent={this.renderEmpty}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const selector = createSelector(
  [
    SessionSelectors.selectUser,
    InventorySelectors.getChecksheetDetail,
    InventorySelectors.getBarang,
    InventorySelectors.getLocation,
    InventorySelectors.getChecksheetDetailFetching,
    InventorySelectors.getBranch,
    InventorySelectors.getCustomer,
  ],
  (
    user,
    checksheetDetail,
    barang,
    location,
    getChecksheetDetailFetching,
    branch,
    customer
  ) => ({
    user,
    checksheetDetail,
    barang,
    location,
    getChecksheetDetailFetching,
    branch,
    customer,
  })
);

const mapStateToProps = (state, props) => {
  return selector(state);
};

const mapDispatchToProps = (dispatch) => ({
  getChecksheetDetailRequest: (params) =>
    dispatch(InventoryActions.getChecksheetDetailRequest(params)),
  getBarangRequest: (params) =>
    dispatch(InventoryActions.getBarangRequest(params)),
  getLocationRequest: (params) =>
    dispatch(InventoryActions.getLocationRequest(params)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailChecksheetScreen);
