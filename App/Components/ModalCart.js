import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import {createSelector} from 'reselect';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, Fonts} from '../Themes';
import FullButton from './FullButton';
import Input from './Input';
import Spacer from './Spacer';
import Text from './Text';

import OperationActions, {OperationSelectors} from '../Redux/OperationRedux';
import InputSelect from './InputSelect';
import NavigationServices from '../Navigation/NavigationServices';

const styles = StyleSheet.create({
  modalContainer: {},
  container: {
    backgroundColor: Colors.snow,
    padding: 16,
    borderRadius: 8,
    height: 600,
  },
  bottom: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    justifyContent: 'center',
  },
  rowItem: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: Colors.greyLight,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },
});

class ModalCart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isList: true,
      qty: '',
      notes: '',
      qr: {},
      location: {},
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.onDone = this.onDone.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this);
  }

  componentDidMount() {
    const {setRef} = this.props;
    if (setRef) {
      setRef(this);
    }
  }

  onDone() {
    const {onDone} = this.props;
    this.setState({visible: false}, () => onDone());
  }

  show(params, useForm, isEdit) {
    if (params && useForm) {
      this.setState({
        visible: true,
        isList: false,
        qr: params,
        qty: params.qty,
        isEdit: isEdit ? true : false,
        notes: '',
      });
    } else {
      this.setState({visible: true});
    }
  }

  hide() {
    const {onHide} = this.props;
    this.setState({visible: false, isList: true}, () => {
      if (onHide) {
        onHide();
      }
    });
  }

  onSend() {
    const {preparings, loadings, dissamblings, type, onScanMore, cartLoading} =
      this.props;
    const {location} = this.state;

    if (!location.loc_id) {
      Alert.alert('Peringatan', 'Mohon pilih dulu Location');
      return;
    }

    let data = [];

    if (type === 'P') {
      data = preparings.map((item, index) => {
        return {...item, qty: parseFloat(item.qty, 10), rifd_seq: index + 1};
      });
    }
    if (type === 'L') {
      data = loadings.map((item, index) => {
        return {...item, qty: parseFloat(item.qty, 10), rifd_seq: index + 1};
      });
    }
    if (type === 'D') {
      data = dissamblings.map((item, index) => {
        return {...item, qty: parseFloat(item.qty, 10), rifd_seq: index + 1};
      });
    }

    let params = {
      type: type,
      rif_loc_to_id: location.loc_id,
      detail: data,
    };

    if (type === 'L') {
      params = {
        rif_oid: cartLoading.rif_oid,
        ...params,
      };

      this.setState({visible: false, isList: true}, () => {
        this.props.postLoadingRequest(params, (status) => {
          this.alert(status);
        });
      });
    } else {
      this.setState({visible: false, isList: true}, () => {
        this.props.postOperationRequest(params, (status) => {
          this.alert(status);
        });
      });
    }
  }

  alert(status) {
    const {onScanMore} = this.props;
    if (status) {
      Alert.alert(
        'Simpan Cart Berhasil!',
        'Apakah Anda akan men-scan lagi??',
        [
          {
            text: 'Kembali ke Home',
            onPress: () => NavigationServices.pop(),
            style: 'cancel',
          },
          {
            text: 'Scan Lagi',
            onPress: () => {
              if (onScanMore) {
                onScanMore();
              }
            },
          },
        ],
        {cancelable: false}
      );
    } else {
      Alert.alert('Simpan Cart Gagal!');
    }
  }

  onSave() {
    const {qty, notes, qr, isEdit} = this.state;
    const {
      type,
      addPreparing,
      editPreparing,

      addLoading,
      editLoading,

      addDissambling,
      editDissambling,
    } = this.props;

    const params = {
      ...qr,
      qty,
      catatan: notes,
    };

    if (type === 'P') {
      if (isEdit) {
        editPreparing(params);
      } else {
        addPreparing(params);
      }
    }
    if (type === 'L') {
      if (isEdit) {
        editLoading(params);
      } else {
        addLoading(params);
      }
    }
    if (type === 'D') {
      if (isEdit) {
        editDissambling(params);
      } else {
        addDissambling(params);
      }
    }

    this.setState({isList: true});
  }

  onScanMore() {
    const {onScanMore} = this.props;
    this.setState({visible: false}, () => {
      if (onScanMore) {
        onScanMore();
      }
    });
  }

  renderItem({item}) {
    const {deletePreparing, deleteLoading, deleteDissambling, type} =
      this.props;

    return (
      <View style={styles.rowItem}>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <View style={{width: 140}}>
            <Text>PT Code</Text>
            <Text>PT Description</Text>
            <Text>Batch</Text>
            <Text>Pack</Text>
            <Text>Location</Text>
            <Text>In Date</Text>
            <Text>Expire Date</Text>
            <Text>Qty</Text>
            <Text>Notes</Text>
            <Text>Customer</Text>
            <Text>Remark</Text>
          </View>
          <View style={{}}>
            <Text style={{fontWeight: 'bold'}}>: {item.pt_code}</Text>
            <Text style={{fontWeight: 'bold'}}>: {item.pt_desc1}</Text>
            <Text style={{fontWeight: 'bold'}}>: {item.batch}</Text>
            <Text style={{fontWeight: 'bold'}}>
              : {item.pcs} {item.pack}
            </Text>
            <Text style={{fontWeight: 'bold'}}>: {item.loc_desc}</Text>
            <Text style={{fontWeight: 'bold'}}>: {item.in_date}</Text>
            <Text style={{fontWeight: 'bold'}}>: {item.exp_date}</Text>
            <Text style={{fontWeight: 'bold'}}>
              : {item.qty} {item.um}
            </Text>
            <Text style={{fontWeight: 'bold'}}>: {item.catatan}</Text>
            <Text style={{fontWeight: 'bold'}}>: {item.customer}</Text>
            <Text style={{fontWeight: 'bold'}}>: {item.remark}</Text>
          </View>
        </View>
        <View
          style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
          {item.status && (
            <>
              <Icon name="check-circle" size={20} color={'green'} />
              <Spacer width={10} />
            </>
          )}
          <TouchableOpacity
            onPress={() => {
              this.setState({
                isList: false,
                qr: item,
                qty: item.qty,
                notes: item.catatan,
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
                'Apakah Anda yakin akan menghapus cart ini?',
                [
                  {
                    text: 'Tidak',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'Ya',
                    onPress: () => {
                      if (type === 'P') {
                        deletePreparing(item.rifd_qr_code);
                      }
                      if (type === 'L') {
                        deleteLoading(item.rifd_qr_code);
                      }
                      if (type === 'D') {
                        deleteDissambling(item.rifd_qr_code);
                      }
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
    );
  }

  renderEmpty() {
    return (
      <View style={{alignItems: 'center', marginTop: 30}}>
        <Text>Cart masih kosong</Text>
      </View>
    );
  }

  render() {
    const {visible, isList, notes, qty, qr, location} = this.state;
    const {preparings, loadings, dissamblings, type, locations} = this.props;

    let data = [];

    if (type === 'P') {
      data = preparings;
    }
    if (type === 'L') {
      data = loadings;
    }
    if (type === 'D') {
      data = dissamblings;
    }

    return (
      <>
        <Modal
          isVisible={visible}
          // onBackdropPress={this.hide}
          animationIn="fadeIn"
          animationOut="fadeOut"
          // onBackButtonPress={this.hide}
          backdropTransitionOutTiming={0}
          style={styles.modalContainer}>
          <View style={styles.container}>
            <TouchableOpacity
              style={{
                alignItems: 'flex-end',
                marginBottom: 16,
              }}
              onPress={() => this.hide()}>
              <Icon name="close" size={20} color={'black'} />
            </TouchableOpacity>
            {isList ? (
              <>
                <FlatList
                  data={data}
                  renderItem={this.renderItem}
                  ListEmptyComponent={this.renderEmpty}
                />
                <Spacer height={10} />
                <InputSelect
                  name="location"
                  placeholder="Location"
                  title="Location"
                  editable={true}
                  data={locations}
                  value={location.loc_desc}
                  loc_desc
                  onSelect={(item) => {
                    this.setState({location: item});
                  }}
                />
                <View style={{flexDirection: 'row'}}>
                  <FullButton
                    text=" Scan"
                    onPress={() => this.onScanMore()}
                    style={{width: 100}}
                    icon={<Icon name="line-scan" size={20} color={'white'} />}
                  />
                  <Spacer width={10} />
                  <FullButton
                    text="Save"
                    onPress={() => {
                      Alert.alert(
                        '',
                        'Apakah Anda yakin akan akan menyimpan cart ini?',
                        [
                          {
                            text: 'Tidak',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                          },
                          {
                            text: 'Ya',
                            onPress: () => {
                              this.onSend();
                            },
                          },
                        ],
                        {cancelable: false}
                      );
                    }}
                    style={{flex: 1}}
                  />
                </View>
              </>
            ) : (
              <View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: 140}}>
                    <Text>PT Code</Text>
                    <Text>PT Description</Text>
                    <Text>Batch</Text>
                    <Text>Pack</Text>
                    <Text>Location</Text>
                    <Text>In Date</Text>
                    <Text>Expire Date</Text>
                    <Text>Quantity</Text>
                    <Text>Customer</Text>
                    <Text>Remark</Text>
                  </View>
                  <View style={{}}>
                    <Text style={{fontWeight: 'bold'}}>: {qr.pt_code}</Text>
                    <Text style={{fontWeight: 'bold'}}>: {qr.pt_desc1}</Text>
                    <Text style={{fontWeight: 'bold'}}>: {qr.batch}</Text>
                    <Text style={{fontWeight: 'bold'}}>
                      : {qr.pcs} {qr.pack}
                    </Text>
                    <Text style={{fontWeight: 'bold'}}>: {qr.loc_desc}</Text>
                    <Text style={{fontWeight: 'bold'}}>: {qr.in_date}</Text>
                    <Text style={{fontWeight: 'bold'}}>: {qr.exp_date}</Text>
                    <Text style={{fontWeight: 'bold'}}>
                      : {qr.qty} {qr.um}
                    </Text>
                    <Text style={{fontWeight: 'bold'}}>: {qr.customer}</Text>
                    <Text style={{fontWeight: 'bold'}}>: {qr.remark}</Text>
                  </View>
                </View>
                <Input
                  placeholder="Quantity"
                  name="qty"
                  title="Quantity"
                  keyboardType="number-pad"
                  editable={type === 'D'}
                  style={{color: type === 'D' ? 'black' : 'grey'}}
                  value={qty}
                  setFieldValue={(key, value) => {
                    this.setState({qty: value});
                  }}
                  setFieldTouched={() => {}}
                />
                <Input
                  placeholder="Catatan"
                  name="notes"
                  title="Catatan"
                  value={notes}
                  setFieldValue={(key, value) => {
                    this.setState({notes: value});
                  }}
                  setFieldTouched={() => {}}
                />

                <FullButton text="Add to Cart" onPress={() => this.onSave()} />
              </View>
            )}
          </View>
        </Modal>
      </>
    );
  }
}

const selector = createSelector(
  [
    OperationSelectors.getPreparing,
    OperationSelectors.getLoading,
    OperationSelectors.getDissambling,
    OperationSelectors.getLocations,
  ],
  (preparings, loadings, dissamblings, locations) => ({
    preparings,
    loadings,
    dissamblings,
    locations,
  })
);

const mapStateToProps = (state) => selector(state);

const mapDispatchToProps = (dispatch) => ({
  addPreparing: (data) => dispatch(OperationActions.addPreparing(data)),
  editPreparing: (data) => dispatch(OperationActions.editPreparing(data)),
  deletePreparing: (data) => dispatch(OperationActions.deletePreparing(data)),

  addLoading: (data) => dispatch(OperationActions.addLoading(data)),
  editLoading: (data) => dispatch(OperationActions.editLoading(data)),
  deleteLoading: (data) => dispatch(OperationActions.deleteLoading(data)),

  addDissambling: (data) => dispatch(OperationActions.addDissambling(data)),
  editDissambling: (data) => dispatch(OperationActions.editDissambling(data)),
  deleteDissambling: (data) =>
    dispatch(OperationActions.deleteDissambling(data)),

  postOperationRequest: (data, callback) =>
    dispatch(OperationActions.postOperationRequest(data, callback)),
  postLoadingRequest: (data, callback) =>
    dispatch(OperationActions.postLoadingRequest(data, callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalCart);
