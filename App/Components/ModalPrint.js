import React, {PureComponent, createRef} from 'react';
import {View, StyleSheet, Image, Alert} from 'react-native';
import Modal from 'react-native-modal';
import {Buffer} from 'buffer';
import {Colors, Fonts, Images} from '../Themes';
import FullButton from './FullButton';
import Spacer from './Spacer';
import 'text-encoding';
import {SvgXml} from 'react-native-svg';
import ViewShot from 'react-native-view-shot';
import * as SunmiPrinterLibrary from '@mitsuharu/react-native-sunmi-printer-library';
import Text from './Text';

const styles = StyleSheet.create({
  modalContainer: {},
  container: {
    backgroundColor: Colors.snow,
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  bottom: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    justifyContent: 'center',
  },
  qr: {
    width: 220,
    height: 220,
    backgroundColor: 'red',
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: 'black',
  },
  textLeft: {paddingLeft: 8, paddingRight: 2, fontSize: 18, flex: 1},
});

class ModalPrint extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      qr: '',
      qrDecode: '',
      labelData: {},
    };

    this.viewShotRef = createRef();

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.onDone = this.onDone.bind(this);
  }

  async componentDidMount() {
    const {setRef} = this.props;
    if (setRef) {
      setRef(this);
    }
  }

  onDone() {
    const {onDone} = this.props;
    this.setState({visible: false}, () => onDone());
  }

  currencyFormat(num) {
    const numericValue = Number(num); // Convert the value to number
    if (isNaN(numericValue)) {
      // If not a valid number, return an empty string or the original value
      return '';
    } else {
      return numericValue.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'); // And this would be the function
    }
  }

  show(qr, chksheet, detail, serial, locationSelected, barangSelected) {
    console.tron.log(
      'wew ',
      chksheet,
      detail,
      serial,
      locationSelected,
      barangSelected
    );
    var QRCode = require('qrcode');
    QRCode.toString(qr, {
      width: 300,
      height: 300,
    })
      .then((url) => {
        const labelData = {
          // serial: `No batch: ${serial.chksheetds_lot_serial}`,
          // qty: `QTY: ${
          //   serial.chksheetds_qty
          //     ? Math.abs(parseFloat(serial.chksheetds_qty)).toFixed(2)
          //     : '0'
          // }`,
          // loc_desc: locationSelected.loc_desc,
          // desc: barangSelected.pt_desc1,
          // deliveryDate: `Delivery Date: \n${serial.chksheetds_dt}`,
          // qrCodeData: qr, // Data yang akan di-encode di QR Code
          qty:
            `${
              serial.chksheetds_qty
                ? this.currencyFormat(
                    Math.abs(parseFloat(serial.chksheetds_qty)).toFixed(2)
                  )
                : '0'
            } ` + barangSelected.um_name,
          maker: 'Maker: PT AAA',
          barang_name: barangSelected.pt_desc1,
          qrCodeData: qr, // Data yang akan di-encode di QR Code
        };

        this.setState({
          visible: true,
          qr: url,
          qrDecode: qr,
          labelData,
        });
      })

      .catch((err) => console.error(err));
  }

  hide() {
    const {onCancel} = this.props;
    this.setState({visible: false}, onCancel);
  }

  async print() {
    const {qrDecode, labelData} = this.state;

    try {
      const base64Image = await this.viewShotRef.current.capture({
        format: 'png',
        quality: 1.0,
        result: 'base64',
      });

      console.tron.log('wew base64Image', base64Image);

      // // [PERBAIKAN] Menggunakan prepare() untuk inisialisasi dan koneksi
      await SunmiPrinterLibrary.prepare();

      await SunmiPrinterLibrary.setAlignment('center');

      await SunmiPrinterLibrary.printImage(
        `data:image/png;base64,${base64Image}`,
        384,
        'grayscale'
      );

      await SunmiPrinterLibrary.lineWrap(4);
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Printing Error',
        error.message || 'Terjadi kesalahan saat mencetak.'
      );
    } finally {
      // [PERBAIKAN] Mengirim semua perintah di buffer ke printer
      // await SunmiPrinterLibrary.commitTransaction();
    }
  }

  render() {
    const {visible, qr} = this.state;
    const {qrDecode, labelData} = this.state;

    return (
      <>
        <Modal
          isVisible={visible}
          onBackdropPress={this.hide}
          animationIn="fadeIn"
          animationOut="fadeOut"
          onBackButtonPress={this.hide}
          backdropTransitionOutTiming={0}
          style={styles.modalContainer}>
          <View style={styles.container}>
            {/* <Text>{labelData.qrCodeData}</Text> */}
            <ViewShot
              ref={this.viewShotRef}
              options={{format: 'png', quality: 1.0, result: 'base64'}}>
              <View style={{flexDirection: 'row', borderWidth: 1}}>
                <View style={{flex: 1, borderRightWidth: 1}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 24,
                      borderBottomWidth: 1,
                      width: '100%',
                      textAlign: 'center',
                      flex: 1,
                    }}>
                    {labelData.qty}
                  </Text>
                  <Spacer height={4} />
                  <Text style={styles.textLeft}>{labelData.barang_name}</Text>
                  <Spacer height={4} />
                  <View style={styles.line} />
                  <Spacer height={4} />
                  <Text style={styles.textLeft}>{labelData.maker}</Text>
                  {/* <Spacer height={4} />
                  <View style={styles.line} />
                  <Spacer height={8} />
                  <Text style={[styles.textLeft, {fontWeight: 'bold'}]}>
                    {labelData.serial}
                  </Text>
                  <Spacer height={8} />
                  <Spacer height={4} />
                  <View style={styles.line} />
                  <Spacer height={4} />
                  <Text style={styles.textLeft}>{labelData.deliveryDate}</Text> */}
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <SvgXml xml={qr} width="140" height="140" />
                </View>
              </View>
            </ViewShot>
            <FullButton
              onPress={(e) => {
                this.print(e);
              }}
              width={300}
              text="PRINT"
            />
          </View>
        </Modal>
      </>
    );
  }
}

export default ModalPrint;
