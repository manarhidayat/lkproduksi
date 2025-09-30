import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import DocumentPicker from 'react-native-document-picker';
import XLSX from 'xlsx';
import RNBlob from 'react-native-blob-util';
import {Colors, Images, Fonts} from '../../Themes';

import Text from '../../Components/Text';
import NavigationServices from '../../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';
import Spacer from '../../Components/Spacer';
import InventoryActions, {InventorySelectors} from '../../Redux/InventoryRedux';
import {SessionSelectors} from '../../Redux/SessionRedux';
import FullButton from '../../Components/FullButton';
import ButtonWhite from '../../Components/ButtonWhite';
import ModalPrint from '../../Components/ModalPrint';
import LoadingHelper from '../../Lib/LoadingHelper';

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
    flexDirection: 'row',
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

class DetailListItemScreen extends Component {
  modalPrint = undefined;
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

  fetchData() {
    const {route, getChecksheetDetailRequest} = this.props;
    setTimeout(() => {
      const chksheet = route?.params?.chksheet;
      getChecksheetDetailRequest(chksheet.chksheet_oid);
    }, 300);
  }

  print(item) {
    const {location, route, barang} = this.props;
    const chksheet = route?.params?.chksheet;
    const detail = route?.params?.detail;
    const serial = item;

    const {chksheetds_lot_serial, chksheetds_bundle, chksheetds_batch} = serial;

    let locationSelected = {};
    if (location) {
      locationSelected = location.find(
        (loc) => loc.loc_id === serial.chksheetds_loc_id
      );
    }

    let barangSelected = {};
    if (barang) {
      barangSelected = barang.find(
        (loc) => loc.pt_id === detail.chksheetd_pt_id
      );
    }

    const qty = `${parseFloat(serial.chksheetds_qty).toFixed(2)}`;
    const pcs = `${parseFloat(serial.chksheetds_pcs).toFixed(2)}`;

    // const qr_code = `${chksheetds_lot_serial}_${chksheetds_bundle}_${chksheetds_batch}_${qty}_${pcs}_${locationSelected.loc_desc}_${barangSelected.pt_desc1}`;

    this.modalPrint.show(
      serial.chksheetds_qr_code,
      chksheet,
      detail,
      serial,
      locationSelected,
      barangSelected
    );
  }

  async pickFile() {
    try {
      const {createChecksheetSerialRequest, route, location} = this.props;
      const detail = route?.params?.detail;

      const res = await DocumentPicker.pickSingle({
        // gunakan mime-types agar tepat
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
          'application/vnd.ms-excel', // .xls
          'text/csv', // .csv
        ],
        // copyTo: 'cachesDirectory', // optional kalau mau copy ke cache iOS/Android
      });
      LoadingHelper.show();

      const {uri, name, mimeType} = res;
      console.tron.log('File URI:', uri);

      let base64;
      try {
        // coba baca langsung dari URI
        base64 = await RNBlob.fs.readFile(uri, 'base64');
      } catch (readError) {
        console.tron.log(
          'Direct read failed, trying alternative methods:',
          readError
        );

        // jika gagal, coba dengan stat dulu untuk cek file
        try {
          const stat = await RNBlob.fs.stat(uri);
          console.tron.log('File stat:', stat);
          base64 = await RNBlob.fs.readFile(uri, 'base64');
        } catch (statError) {
          // jika masih gagal, lempar error yang informatif
          throw new Error(
            `Tidak dapat membaca file. URI: ${uri}. Error: ${readError.message}`
          );
        }
      }

      // parse workbook dari base64
      // XLSX akan handle xlsx/xls/csv kalau type:'base64'
      const wb = XLSX.read(base64, {type: 'base64'});

      // ambil sheet pertama
      const sheetName = wb.SheetNames[0];
      const ws = wb.Sheets[sheetName];

      // sheet_to_json dengan header:1 => array of arrays
      const aoa = XLSX.utils.sheet_to_json(ws, {header: 1, raw: false});

      // jika baris pertama berisi header
      const headers = (aoa[0] || []).map((h) => (h ?? '').toString());
      const rows = aoa
        .slice(1)
        .map((r) => r.map((cell) => (cell ?? '').toString()));

      console.tron.log({headers, rows});

      let seq = detail.serials ? detail.serials.length : 0;
      for (const row in rows) {
        const bundle = rows[row][3];
        const batch = rows[row][4];
        const qty = rows[row][5];
        const pcs = rows[row][6];
        const lot_serial = bundle + batch;

        let locationSelected = {};
        if (detail && location) {
          locationSelected = location.find(
            (loc) => loc.loc_id === detail.chksheetd_loc_id
          );
        }

        let params = {
          checksheet_detail_oid: detail.chksheetd_oid,
          seq,
          qty: Number(qty || 0),
          pcs: Number(pcs || 0),
          loc_id: Number(locationSelected.loc_id || 0),
          bundle: bundle,
          batch: batch,
          lot_serial: lot_serial,
          qr_code: `${lot_serial}_${bundle}_${batch}_${qty}_${pcs}_${locationSelected.loc_desc}`,
        };

        console.tron.log('params', params);
        await createChecksheetSerialRequest(params, () => {
          setTimeout(() => {
            LoadingHelper.hide();
            this.fetchData();
          }, 1000);
        });
        seq = seq + 1;
      }
    } catch (err) {
      LoadingHelper.hide();
      console.tron.log('pickfile error', err);

      let errorMessage = 'Gagal membuka file';

      if (err.message) {
        if (
          err.message.includes('ENOENT') ||
          err.message.includes('no such file')
        ) {
          errorMessage =
            'File tidak ditemukan. Pastikan file masih ada di lokasi yang dipilih.';
        } else if (err.message.includes('Permission denied')) {
          errorMessage =
            'Tidak memiliki izin untuk mengakses file. Coba pilih file dari lokasi lain.';
        } else if (err.message.includes('User canceled')) {
          return; // jangan tampilkan error jika user cancel
        } else {
          errorMessage = `Gagal membuka file: ${err.message}`;
        }
      }

      Alert.alert('Error', errorMessage);
    }
  }

  renderEmpty() {
    return (
      <View style={styles.empty}>
        <Text>Tidak ada Serial</Text>
      </View>
    );
  }

  renderItem({item}) {
    const {route, deleteChecksheetSerialRequest} = this.props;
    const chksheet = route?.params?.chksheet;
    const detail = route?.params?.detail;
    const {
      chksheetds_dt,
      chksheetds_lot_serial,
      chksheetds_qty,
      chksheetds_pcs,
      chksheetds_qty_packaging,
    } = item;

    return (
      <View style={styles.item}>
        <View style={{flex: 1}}>
          <Text>{chksheetds_dt}</Text>
          <Text>{chksheetds_lot_serial}</Text>
          <Text>
            Qty:{' '}
            {chksheetds_qty
              ? Math.abs(parseFloat(chksheetds_qty)).toFixed(2)
              : ''}
          </Text>
          <Text>
            Qty Packaging:{' '}
            {chksheetds_pcs
              ? Math.abs(parseFloat(chksheetds_pcs)).toFixed(2)
              : '0'}
          </Text>
          {/* <Text>
            Qty pcs:{' '}
            {chksheetds_qty_packaging
              ? Math.abs(parseFloat(chksheetds_qty_packaging)).toFixed(2)
              : '0'}
          </Text> */}

          <View
            style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                NavigationServices.navigate(NAVIGATION_NAME.HOME.addSerial, {
                  serial: item,
                  chksheet,
                  detail,
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
                  'Apakah Anda yakin akan menghapus lot/serial ini?',
                  [
                    {
                      text: 'Tidak',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'Ya',
                      onPress: () => {
                        deleteChecksheetSerialRequest(
                          {
                            chksheetds_oid: item.chksheetds_oid,
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
        </View>
        <ButtonWhite
          onPress={(e) => {
            this.print(item);
          }}
          style={{width: 140}}
          text={'PRINT'}
        />
      </View>
    );
  }

  render() {
    const {user, route, checksheetDetail, barang, entity, branch, customer} =
      this.props;
    const chksheet = route?.params?.chksheet;
    let detail = route?.params?.detail || checksheetDetail;
    if (checksheetDetail && checksheetDetail.chksheet_oid) {
      detail = checksheetDetail.details.find(
        (d) => d.chksheetd_oid === detail.chksheetd_oid
      );
    }

    let qtyTotal = 0;
    detail.serials.map((serial) => {
      qtyTotal = qtyTotal + Math.abs(parseFloat(serial.chksheetds_qty));
    });
    let qtyPackagingTotal = 0;
    detail.serials.map((serial) => {
      qtyPackagingTotal =
        qtyPackagingTotal + Math.abs(parseFloat(serial.chksheetds_pcs) || 0);
    });

    const chksheetd_qty_real = detail.chksheetd_qty_real
      ? parseFloat(detail.chksheetd_qty_real)
      : 0;
    const chksheetd_um_conv = detail.chksheetd_um_conv
      ? parseFloat(detail.chksheetd_um_conv)
      : 0;

    const chksheetd_qty = detail.chksheetd_qty
      ? Math.abs(parseFloat(detail.chksheetd_qty))
      : 0;
    const isLessThan = chksheetd_qty > qtyTotal;

    const chksheetd_qty_packaging = detail.chksheetd_qty_packaging
      ? Math.abs(parseFloat(detail.chksheetd_qty_packaging))
      : 0;
    const isPackagingLessThan = chksheetd_qty_packaging > qtyPackagingTotal;

    let barangSelected = {};
    if (barang) {
      barangSelected = barang.find(
        (loc) => loc.pt_id === detail.chksheetd_pt_id
      );
    }

    let entitySelected = {};
    if (entity) {
      entitySelected = entity.find(
        (loc) => loc.en_id === chksheet.chksheet_en_id
      );
    }

    let branchSelected = null;
    if (branch && chksheet) {
      branchSelected = branch.find(
        (loc) => loc.branch_id === chksheet.chksheet_branch_id
      );
    }

    let customerSelected = null;

    if (customer && chksheet) {
      customerSelected = customer.find(
        (loc) => loc.ptnr_id === chksheet.chksheet_ptnr_id_sold
      );
    }

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.content}>
          <View>
            <Text>{chksheet.chksheet_add_date}</Text>
            <Text>{chksheet.chksheet_add_by}</Text>
            {/* <Text>{entitySelected.pt_desc1}</Text> */}
            <Text>{chksheet.chksheet_code}</Text>
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
            <Spacer height={8} />
            <View
              style={{
                height: 1,
                width: '100%',
                backgroundColor: Colors.border,
              }}></View>
            <Spacer height={16} />
            <Text>{detail.chksheetd_add_date}</Text>
            <Text>{barangSelected.pt_code}</Text>
            <Text>{barangSelected.pt_desc1}</Text>
            <Text>
              Qty: {chksheetd_qty.toFixed(2)}
              {qtyTotal !== chksheetd_qty && (
                <Text style={{color: 'red'}}>
                  {isLessThan
                    ? ` (Qty kurang: ${chksheetd_qty - qtyTotal}) `
                    : ` (Qty lebih: ${qtyTotal - chksheetd_qty}) `}
                </Text>
              )}
            </Text>
            <Text>
              Qty Packaging: {chksheetd_qty_packaging.toFixed(2)}{' '}
              {qtyPackagingTotal !== chksheetd_qty_packaging && (
                <Text style={{color: 'red'}}>
                  {isPackagingLessThan
                    ? ` (Qty packaging kurang: ${
                        chksheetd_qty_packaging - qtyPackagingTotal
                      })`
                    : ` (Qty packaging lebih: ${
                        qtyPackagingTotal - chksheetd_qty_packaging
                      })`}
                </Text>
              )}
            </Text>
            <Text>UM Conversion: {chksheetd_um_conv.toFixed(2)}</Text>
            {/* <Text>Qty Real: {chksheetd_qty_real.toFixed(2)}</Text> */}
            <Text>{detail.chksheetd_add_date}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <FullButton
              text={'Tambah Lot'}
              style={{width: 160}}
              onPress={() =>
                NavigationServices.push(NAVIGATION_NAME.HOME.addSerial, {
                  chksheet,
                  detail,
                  lastSerial:
                    detail.serials && detail.serials.length > 0
                      ? detail.serials[detail.serials.length - 1]
                      : {},
                })
              }
            />
            <Spacer width={10} />
            <FullButton
              text={'Pilih File'}
              style={{width: 160}}
              onPress={() => this.pickFile()}
            />
          </View>
          <FlatList
            contentContainerStyle={{
              flexGrow: 1,
            }}
            style={{marginBottom: 400}}
            data={detail ? detail.serials : []}
            renderItem={this.renderItem}
            ListEmptyComponent={this.renderEmpty}
          />
          <ModalPrint setRef={(r) => (this.modalPrint = r)} />
        </View>
      </SafeAreaView>
    );
  }
}

const selector = createSelector(
  [
    SessionSelectors.selectUser,
    InventorySelectors.getChecksheetDetail,
    InventorySelectors.getLocation,
    InventorySelectors.getBarang,
    InventorySelectors.getEntity,
    InventorySelectors.getBranch,
    InventorySelectors.getCustomer,
  ],
  (user, checksheetDetail, location, barang, entity, branch, customer) => ({
    user,
    checksheetDetail,
    location,
    barang,
    entity,
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
  getLocationRequest: (params) =>
    dispatch(InventoryActions.getLocationRequest(params)),
  deleteChecksheetSerialRequest: (params, callback) =>
    dispatch(InventoryActions.deleteChecksheetSerialRequest(params, callback)),
  createChecksheetSerialRequest: (params, callback) =>
    dispatch(InventoryActions.createChecksheetSerialRequest(params, callback)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailListItemScreen);
