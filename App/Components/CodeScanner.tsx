import * as React from 'react';
import {useCallback} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import type {Code} from 'react-native-vision-camera';
import {useCameraDevice, useCodeScanner} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/core';
import IonIcon from 'react-native-vector-icons/Ionicons';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  button: {
    marginBottom: 15,
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonRow: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  preview: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  rectangle: {
    // position: 'absolute',
    // backgroundColor: 'transparent',
    borderLeftColor: 'rgba(0, 0, 0, .6)',
    borderRightColor: 'rgba(0, 0, 0, .6)',
    borderTopColor: 'rgba(0, 0, 0, .6)',
    borderBottomColor: 'rgba(0, 0, 0, .6)',
    borderLeftWidth: deviceWidth / 1,
    borderRightWidth: deviceWidth / 1,
    borderTopWidth: deviceHeight / 3,
    borderBottomWidth: deviceHeight / 2,
    // top: scalePx(-21),
    // bottom
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rectangleColor: {
    height: 230,
    width: 230,
    backgroundColor: 'transparent',
  },
  topLeft: {
    width: 20,
    height: 20,
    left: -4,
    top: -4,
    borderTopWidth: 6,
    borderLeftWidth: 6,
    position: 'absolute',
    borderLeftColor: '#FFF',
    borderTopColor: '#FFF',
  },
  bottomLeft: {
    width: 20,
    height: 20,
    left: -4,
    bottom: -4,
    borderBottomWidth: 6,
    borderLeftWidth: 6,
    position: 'absolute',
    borderLeftColor: '#FFF',
    borderBottomColor: '#FFF',
  },
  bottomRight: {
    width: 20,
    height: 20,
    right: -4,
    bottom: -4,
    borderBottomWidth: 6,
    borderRightWidth: 6,
    position: 'absolute',
    borderRightColor: '#FFF',
    borderBottomColor: '#FFF',
  },
  topRight: {
    width: 20,
    height: 20,
    right: -4,
    top: -4,
    borderTopWidth: 6,
    borderRightWidth: 6,
    position: 'absolute',
    borderRightColor: '#FFF',
    borderTopColor: '#FFF',
  },
});

const CodeScanner = ({onBarCodeRead}: any) => {
  const device = useCameraDevice('back');

  const isFocused = useIsFocused();

  const isForeground = true;
  const isActive = isFocused && isForeground;

  // const [torch, setTorch] = useState(false);

  const onCodeScanned = useCallback(
    (codes: Code[]) => {
      console.log(`Scanned ${codes.length} codes:`, codes);

      onBarCodeRead(codes[0].value);
    },
    [onBarCodeRead]
  );

  // 5. Initialize the Code Scanner to scan QR codes and Barcodes
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: onCodeScanned,
  });

  return (
    <View style={styles.container}>
      {device != null && (
        <Camera
          style={{flex: 1}}
          device={device}
          isActive={isActive}
          codeScanner={codeScanner}
          // torch={torch ? 'on' : 'off'}
          torch={'off'}
          enableZoomGesture={true}
        />
      )}
      <View style={styles.preview}>
        <View style={styles.rectangle}>
          <View style={styles.rectangleColor} />
          <View style={styles.topLeft} />
          <View style={styles.topRight} />
          <View style={styles.bottomLeft} />
          <View style={styles.bottomRight} />
        </View>
      </View>

      {/* <View style={styles.rightButtonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setTorch(!torch)}>
          <IonIcon
            name={torch ? 'flash' : 'flash-off'}
            color="white"
            size={24}
          />
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default CodeScanner;
