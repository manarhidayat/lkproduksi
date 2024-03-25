import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import {createSelector} from 'reselect';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, Images} from '../../Themes';
import Text from '../../Components/Text';
import SessionActions, {SessionSelectors} from '../../Redux/SessionRedux';
import OperationActions from '../../Redux/OperationRedux';
import NavigationServices from '../../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';
import {OperationSelectors} from '../../Redux/OperationRedux';
import {OPERATIONS, OPERATIONS_TYPES} from '../../Lib/Constans';
import Spacer from '../../Components/Spacer';
import FullButton from '../../Components/FullButton';
import ModalFinish from '../../Components/ModalFinish';

const styles = StyleSheet.create({
  row: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    height: 60,
    width: 60,
  },
  containerIcon: {
    height: 80,
    width: 80,
    borderRadius: 10,
    backgroundColor: Colors.greyLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentItem: {
    marginTop: 10,
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
});

class HomeScreen extends Component {
  modalFinish = undefined;

  constructor(props) {
    super(props);

    this.state = {};

    this.renderItem = this.renderItem.bind(this);
    this.onPressLogout = this.onPressLogout.bind(this);
    this.onPressFinish = this.onPressFinish.bind(this);
    this.onFinish = this.onFinish.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      const {isWorking, currentOperation, getListOperationRequest} = this.props;
      getListOperationRequest();

      if (isWorking) {
        NavigationServices.navigate(NAVIGATION_NAME.PIC.timer, {
          item: currentOperation,
        });
      }

      NavigationServices.setParams({onPressLogout: this.onPressLogout});
    }, 500);
  }

  onPressFinish() {
    const {getJumlahProduksiRequest, operations, batch} = this.props;
    const finishing = operations[operations.length - 1];

    getJumlahProduksiRequest(batch.woi_oid, () => {
      this.modalFinish.show();
    });
  }

  onFinish(gasMeter) {
    const {
      finishOperationRequest,
      progressId,
      setEndGas,
      operations,
      finishMaterial,
    } = this.props;
    const finishing = operations[operations.length - 1];

    setEndGas(gasMeter);
    finishOperationRequest({
      progress_id: progressId,
      gas_end: gasMeter,
      process_id: finishing.wc_id,
      detail_material: finishMaterial,
    });
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
            this.props.removeOperations();
          },
        },
      ],
      {cancelable: false}
    );
  }

  renderItem({item, index}) {
    if (index === 11) {
      return <View style={{width: 80}} />;
    }

    return (
      <TouchableOpacity
        onPress={() =>
          NavigationServices.navigate(NAVIGATION_NAME.PIC.timer, {item})
        }
        style={styles.contentItem}>
        <View style={styles.containerIcon}>
          <Image source={item.icon} style={styles.icon} resizeMode="contain" />
        </View>
        <Spacer height={10} />
        <Text>{item.wc_desc}</Text>
        <Spacer height={10} />
      </TouchableOpacity>
    );
  }

  render() {
    const {operations} = this.props;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.content}>
          <FlatList
            data={operations}
            renderItem={this.renderItem}
            numColumns={3}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 20,
            }}
            columnWrapperStyle={{justifyContent: 'space-between'}}
          />
          <ModalFinish
            setRef={(r) => (this.modalFinish = r)}
            onDone={(gasMeter) => this.onFinish(gasMeter)}
          />
          <FullButton onPress={() => this.onPressFinish()} text="SELESAI" />
        </View>
      </SafeAreaView>
    );
  }
}

const selector = createSelector(
  [
    OperationSelectors.getCurrentOperation,
    OperationSelectors.isWorking,
    OperationSelectors.getListOperation,
    OperationSelectors.getProgressId,
    OperationSelectors.getOperations,
    OperationSelectors.getFinishMaterialRes,
    SessionSelectors.selectBatch
  ],
  (
    currentOperation,
    isWorking,
    operations,
    progressId,
    listOperation,
    finishMaterial,
    batch
  ) => ({
    currentOperation,
    isWorking,
    operations,
    progressId,
    listOperation,
    finishMaterial,
    batch
  })
);

const mapStateToProps = (state) => selector(state);

const mapDispatchToProps = (dispatch) => ({
  setLogin: (params) => dispatch(SessionActions.setLogin(params)),
  removeSession: (params) => dispatch(SessionActions.removeSession(params)),
  removeOperations: (params) =>
    dispatch(OperationActions.removeOperations(params)),

  getListOperationRequest: (params) =>
    dispatch(OperationActions.getListOperationRequest(params)),
  finishOperationRequest: (params) =>
    dispatch(OperationActions.finishOperationRequest(params)),
  getJumlahProduksiRequest: (params, callback) =>
    dispatch(OperationActions.getJumlahProduksiRequest(params, callback)),

  setEndGas: (params) => dispatch(OperationActions.setEndGas(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
