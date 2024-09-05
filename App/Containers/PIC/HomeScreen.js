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
    flex: 1,
  },
});

class HomeScreen extends Component {
  modalFinish = undefined;

  constructor(props) {
    super(props);

    this.state = {};

    this.renderItem = this.renderItem.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onPressLogout = this.onPressLogout.bind(this);
    this.onPressFinish = this.onPressFinish.bind(this);
    this.onFinish = this.onFinish.bind(this);
  }

  componentDidMount() {
    this.onRefresh();
  }

  onRefresh() {
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

  renderEmpty() {
    return (
      <View style={{alignItems: 'center'}}>
        <FullButton
          onPress={() => this.onRefresh()}
          text="REFRESH"
          style={{width: 200}}
        />
        <Spacer height={10} />
        <Text>Gagal memuat proses, mohon di refresh</Text>
      </View>
    );
  }

  onPressFinish() {
    const {getJumlahProduksiRequest, operations, batch} = this.props;
    const finishing = operations[operations.length - 1];

    getJumlahProduksiRequest(batch.woi_oid, () => {
      setTimeout(() => {
        this.modalFinish.show();
      }, 500);
    });
  }

  onFinish(gasMeter) {
    const {
      finishOperationRequest,
      progressId,
      setEndGas,
      operations,
      finishMaterial,
      progressDetailId,
      stopOperationRequest,
    } = this.props;
    const finishing = operations[operations.length - 1];

    if (progressDetailId) {
      let params = {
        progress_detail_id: progressDetailId,
        reason_id: null,
        other_reason: null,
      };

      stopOperationRequest(params, () => {
        setEndGas(gasMeter);
        finishOperationRequest({
          progress_id: progressId,
          gas_end: gasMeter,
          process_id: finishing.wc_id,
          detail_material: finishMaterial,
        });
      });
    } else {
      setEndGas(gasMeter);
      finishOperationRequest({
        progress_id: progressId,
        gas_end: gasMeter,
        process_id: finishing.wc_id,
        detail_material: finishMaterial,
      });
    }
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
    if (item.wc_desc === 'FINISHING') {
      return <View style={{width: 80}} />;
    }
    // if (index === 11) {
    //   return <View style={{width: 80}} />;
    // }

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
            onRefresh={this.onRefresh}
            refreshing={false}
            data={operations}
            renderItem={this.renderItem}
            ListEmptyComponent={this.renderEmpty}
            numColumns={3}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 20,
              justifyContent: 'center',
              // alignItems: 'center',
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
    SessionSelectors.selectBatch,
    OperationSelectors.getProgressDetailId,
  ],
  (
    currentOperation,
    isWorking,
    operations,
    progressId,
    listOperation,
    finishMaterial,
    batch,
    progressDetailId
  ) => ({
    currentOperation,
    isWorking,
    operations,
    progressId,
    listOperation,
    finishMaterial,
    batch,
    progressDetailId,
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
  stopOperationRequest: (params, callback) =>
    dispatch(OperationActions.stopOperationRequest(params, callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
