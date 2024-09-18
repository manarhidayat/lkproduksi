import React, {Component} from 'react';
import {StyleSheet, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {Colors, Images, Fonts} from '../../Themes';
import Text from '../../Components/Text';
import CodeScanner from '../../Components/CodeScanner';
import NavigationServices from '../../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';
import ModalCart from '../../Components/ModalCart';
import OperationActions, {OperationSelectors} from '../../Redux/OperationRedux';
import {getDataQr} from '../../Lib/Helper';

const styles = StyleSheet.create({});

class ScanScreen extends Component {
  modalCart = undefined;
  hasScan = false;

  constructor(props) {
    super(props);
    this.state = {};

    this.onPressCart = this.onPressCart.bind(this);
  }

  componentDidMount() {
    this.props.getLocationsRequest();
    setTimeout(() => {
      this.setCart();

      NavigationServices.setParams({onPressCart: this.onPressCart});
    }, 500);
  }

  setCart() {
    const {preparings, loadings, dissamblings, route} = this.props;
    const type = route.params.type;

    let count = 0;

    if (type === 'P' && preparings) {
      count = preparings.length;
    }
    if (type === 'L' && loadings) {
      count = loadings.length;
    }
    if (type === 'D' && dissamblings) {
      count = dissamblings.length;
    }

    NavigationServices.setParams({count});
  }

  onPressCart() {
    this.modalCart.show();
  }

  warningQr() {
    Alert.alert(
      'Peringatan',
      'Qr ini sudah pernah dimasukan',
      [
        {
          text: 'Ok',
          onPress: () => {
            this.hasScan = false;
          },
        },
      ],
      {cancelable: false}
    );
  }

  onSuccess = (result) => {
    const {preparings, loadings, dissamblings, route, editLoading} = this.props;
    const type = route.params.type;

    if (type === 'P' && preparings) {
      if (preparings.some((item) => item.rifd_qr_code === result)) {
        this.warningQr();
        return;
      }

      const params = getDataQr(result);
      if (params.pt_id) {
        this.modalCart.show(params, true);
      } else {
        Alert.alert(
          'Peringatan',
          'QR Code tidak ditemukan',
          [
            {
              text: 'Ok',
              onPress: () => {
                this.hasScan = false;
              },
            },
          ],
          {cancelable: false}
        );
        return;
      }
    }
    if (type === 'D' && dissamblings) {
      if (dissamblings.some((item) => item.rifd_qr_code === result)) {
        this.warningQr();
        return;
      }

      const params = getDataQr(result);
      if (params.pt_id) {
        this.modalCart.show(params, true);
      } else {
        Alert.alert(
          'Peringatan',
          'QR Code tidak ditemukan',
          [
            {
              text: 'Ok',
              onPress: () => {
                this.hasScan = false;
              },
            },
          ],
          {cancelable: false}
        );
        return;
      }
    }
    if (type === 'L' && loadings) {
      const loading = loadings.filter((item) => item.rifd_qr_code === result);
      if (loading.length > 0) {
        const params = {
          ...loading[0],
          status: true,
        };

        editLoading(params);
        this.modalCart.show(params, true, true);
      } else {
        // const params = getDataQr(result);
        // this.modalCart.show(params, true);
        Alert.alert(
          'Peringatan',
          'QR Code tidak ditemukan',
          [
            {
              text: 'Ok',
              onPress: () => {
                this.hasScan = false;
              },
            },
          ],
          {cancelable: false}
        );
        return;
      }
    }
  };

  render() {
    const {route} = this.props;
    const type = route.params.type;
    const cartLoading = route.params.cartLoading;

    return (
      <SafeAreaView style={{flex: 1}}>
        {/* <TouchableOpacity
          onPress={() => {
            // const params = {
            //   pt_id: 266,
            //   pt_code: 'FZ0048',
            //   pt_desc1: 'PARTING B FZ',
            //   batch: 'P210330552M5Laa8',
            //   qty: '120',
            //   um_id: 991403,
            //   um: 'KG',
            //   pcs: 12,
            //   pack_id: 991556,
            //   pack: 'EKOR',
            //   loc_id: 10006,
            //   loc_desc: 'Frozen',
            //   in_date: '18/03/2024',
            //   exp_date: '18/03/2025',
            // };
            // this.modalCart.show(params, true);
            this.onSuccess(
              // '235_FZ0007_AYAM WHOLE 1,1-1,2 FZ_P240526008ML51b_1100 wew _991403_KG_1100_991508_Ekor_100018_Frozen_26/05/2024_26/05/2024'
              '101387_FZ0414_BLP Pot. Dadu FZ_TMS_19_991403_KG_10_991556_EKOR_100033_Gudang K_10/04/2024_18/12/2025'
            );
          }}>
          <Text>Dummy scan</Text>
        </TouchableOpacity> */}
        <CodeScanner
          onBarCodeRead={(result) => {
            if (result && !this.hasScan) {
              this.hasScan = true;
              this.onSuccess(result);
            }
          }}
        />
        <ModalCart
          setRef={(r) => (this.modalCart = r)}
          type={type}
          cartLoading={cartLoading}
          onHide={() => {
            this.hasScan = false;
            this.setCart();
          }}
          onScanMore={() => {
            this.hasScan = false;
            this.setCart();
          }}
        />
      </SafeAreaView>
    );
  }
}
const selector = createSelector(
  [
    OperationSelectors.getPreparing,
    OperationSelectors.getLoading,
    OperationSelectors.getDissambling,
  ],
  (preparings, loadings, dissamblings) => ({
    preparings,
    loadings,
    dissamblings,
  })
);

const mapDispatchToProps = (dispatch) => ({
  getLocationsRequest: (data) =>
    dispatch(OperationActions.getLocationsRequest(data)),
  editLoading: (data) => dispatch(OperationActions.editLoading(data)),
});

const mapStateToProps = (state) => selector(state);

export default connect(mapStateToProps, mapDispatchToProps)(ScanScreen);
