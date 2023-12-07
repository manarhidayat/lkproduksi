import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import {createSelector} from 'reselect';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {Colors} from '../../Themes';
import Text from '../../Components/Text';
import SessionActions, {SessionSelectors} from '../../Redux/SessionRedux';
import OperationActions, {OperationSelectors} from '../../Redux/OperationRedux';
import NavigationServices from '../../Navigation/NavigationServices';
import Spacer from '../../Components/Spacer';
import Timer from './Timer';
import moment from 'moment';
import ModalStartTimer from '../../Components/ModalStartTimer';
import ModalAddComment from '../../Components/ModalAddComment';
import ModalCautionTimer from '../../Components/ModalCautionTimer';

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnStart: {
    borderRadius: 30,
    height: 60,
    width: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    elevation: 1.5,
  },
  btnText: {
    color: Colors.primary,
  },
  typeText: {fontWeight: 'bold', fontSize: 16},
  spaceEvenly: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alignCenter: {
    alignItems: 'center',
    width: 100,
  },
  contentComment: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.greyLight,
    padding: 10,
    marginBottom: 10,
  },
  icon: {
    height: 150,
    width: 150,
  },
  batch: {
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    paddingBottom: 10,
  },
});

class TimerScreen extends Component {
  timerRef = undefined;
  isPlaying = false;

  modalStartTimer = undefined;
  modalStopTimer = undefined;
  modalAddComment = undefined;
  modalCautionTimer = undefined;

  constructor(props) {
    super(props);

    this.state = {
      notes: null,
      startTime: null,
    };

    this.onPressStart = this.onPressStart.bind(this);
    this.onPressStop = this.onPressStop.bind(this);
    this.onAddComment = this.onAddComment.bind(this);
  }

  componentDidMount() {
    this.props.getListReasonRequest();

    setTimeout(() => {
      const {navigation, isWorking} = this.props;
      navigation.setParams({hideBackButton: false});

      if (isWorking) {
        this.onPressStart();
      }

      this.navListener = navigation.addListener('beforeRemove', (e) => {
        if (this.isPlaying) {
          e.preventDefault();

          Alert.alert('Peringatan', 'Mohon tekan tombol Stop', [
            {
              text: 'Batal',
              onPress: () => {},
              style: 'cancel',
            },
          ]);
        }
      });
    }, 100);
  }

  componentWillUnmount() {
    if (this.navListener) {
      this.navListener();
    }
  }

  onAddComment(comment) {
    const {currentOperation, setCurrentOperation} = this.props;
    this.setState({notes: comment});
    setCurrentOperation({...currentOperation, notes: comment});
  }

  onPressStart() {
    const {
      setWorking,
      setCurrentOperation,
      route,
      isWorking,
      currentOperation,
      startOperationRequest,
      detailMaterial,
      progressId,
    } = this.props;
    const item = route.params?.item || currentOperation;

    let startTime = new Date();
    if (this.timerRef) {
      if (isWorking) {
        this.timerRef.restartTimer();
        startTime = currentOperation.startTime;
      } else {
        this.timerRef.startTimer(true);
      }

      const {navigation} = this.props;
      navigation.setParams({hideBackButton: true});
    }
    this.isPlaying = true;
    this.setState({startTime});

    const operation = {
      ...item,
      startTime,
    };
    setCurrentOperation(operation);

    if (!isWorking) {
      const params = {
        progress_id: progressId,
        process_id: item.wc_id,
        // "start_time" : "1701440508",
        is_material: item.wc_is_material,
        detail_material: item.wc_is_material === 'Y' ? detailMaterial : [],
      };
      startOperationRequest(params);
    }

    setWorking(true);
  }

  onPressStop() {
    const {
      setWorking,
      setCurrentOperation,
      addOperation,
      currentOperation,
      stopOperationRequest,
      progressDetailId,
    } = this.props;
    const {notes} = this.state;
    if (this.timerRef) {
      this.timerRef.stopTimer();
    }
    this.isPlaying = false;

    setWorking(false);
    const operation = {...currentOperation, endTime: new Date()};
    addOperation(operation);
    setCurrentOperation(null);
    NavigationServices.pop();

    let params = {
      progress_detail_id: progressDetailId,
      reason_id: null,
      other_reason: null,
    };

    if (notes) {
      params = {
        ...params,
        reason_id: notes ? notes.reason.code_id : '',
        other_reason: notes && notes.reasonOther ? notes.reasonOther : '-',
      };
    }

    stopOperationRequest(params);
  }

  setTimesCaution() {
    if (this.modalStartTimer.isVisible()) {
      return;
    }
    if (this.modalStopTimer.isVisible()) {
      return;
    }
    if (this.modalAddComment.isVisible()) {
      return;
    }
 
    this.timerRef.setCautionAlreadyCall();
    this.modalCautionTimer.show();
  }

  renderComment() {
    const {notes} = this.state;

    return (
      <View>
        <Spacer height={20} />
        <Text style={{fontWeight: 'bold'}}>Catatan</Text>
        <Spacer height={10} />
        <View style={styles.contentComment}>
          <Text>{notes.reason.code_name}</Text>
          <Text>{notes.reason.reasonOther}</Text>
        </View>
      </View>
    );
  }

  render() {
    const {batch, route, currentOperation, progressDetailId} = this.props;
    const {notes, startTime} = this.state;
    const operation = route.params?.item;
    const item = operation || currentOperation;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.container}>
          <Spacer height={20} />
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={item.icon}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
          <Spacer height={30} />
          <View style={styles.batch}>
            <View style={styles.spaceBetween}>
              <Text>Batch</Text>
              <Text style={styles.title}>{batch.woi_remarks}</Text>
            </View>
            <View style={styles.spaceBetween}>
              <Text>Mulai </Text>
              <Text style={styles.title}>
                {startTime ? moment(startTime).format('HH:mm') : '-'}
              </Text>
            </View>
          </View>
          <Spacer height={10} />

          <Timer
            setRef={(r) => (this.timerRef = r)}
            cautionTime={item && item.wc_avg_time ? item.wc_avg_time : '1000'}
            isTimesCaution={() => this.setTimesCaution()}
          />
          <Spacer height={40} />

          <View style={styles.spaceEvenly}>
            {!this.isPlaying ? (
              <View style={styles.alignCenter}>
                <TouchableOpacity
                  onPress={() => this.modalStartTimer.show()}
                  disabled={this.isPlaying}
                  style={styles.btnStart}>
                  <Icon name="caretright" size={30} color={Colors.primary} />
                </TouchableOpacity>
                <Spacer height={10} />
                <Text style={styles.btnText}>Start</Text>
              </View>
            ) : (
              <View style={styles.alignCenter}>
                <TouchableOpacity
                  disabled={!this.isPlaying}
                  onPress={() => this.modalStopTimer.show()}
                  style={styles.btnStart}>
                  <Entypo name="controller-stop" size={30} color={'red'} />
                </TouchableOpacity>
                <Spacer height={10} />
                <Text style={styles.btnText}>Stop</Text>
              </View>
            )}
            {this.isPlaying && (
              <View style={styles.alignCenter}>
                <TouchableOpacity
                  disabled={!this.isPlaying}
                  onPress={() => this.modalAddComment.show(notes)}
                  style={styles.btnStart}>
                  <Entypo name="edit" size={30} color={Colors.primary} />
                </TouchableOpacity>
                <Spacer height={10} />
                <Text style={styles.btnText}>Catatan</Text>
              </View>
            )}
          </View>
          {notes && this.renderComment()}
          <ModalStartTimer
            setRef={(r) => (this.modalStartTimer = r)}
            onDone={() => this.onPressStart()}
            useMaterial={item.wc_is_material === 'Y'}
            title={'Mulai Proses'}
            desc={'Apakah Anda akan memulai proses?'}
          />
          <ModalStartTimer
            setRef={(r) => (this.modalStopTimer = r)}
            onDone={() => this.onPressStop()}
            title={'Hentikan Proses'}
            desc={'Apakah Anda akan menghentikan proses'}
          />
          <ModalAddComment
            setRef={(r) => (this.modalAddComment = r)}
            onDone={(comment) => this.onAddComment(comment)}
          />
          <ModalCautionTimer
            setRef={(r) => (this.modalCautionTimer = r)}
            onStop={() => this.onPressStop()}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const selector = createSelector(
  [
    SessionSelectors.selectBatch,
    OperationSelectors.getCurrentOperation,
    OperationSelectors.isWorking,
    OperationSelectors.getDetailMaterial,
    OperationSelectors.getProgressId,
    OperationSelectors.getProgressDetailId,
  ],
  (
    batch,
    currentOperation,
    isWorking,
    detailMaterial,
    progressId,
    progressDetailId
  ) => ({
    batch,
    currentOperation,
    isWorking,
    detailMaterial,
    progressId,
    progressDetailId,
  })
);

const mapStateToProps = (state) => selector(state);

const mapDispatchToProps = (dispatch) => ({
  saveTimer: (params) => dispatch(SessionActions.saveTimer(params)),

  addOperation: (params) => dispatch(OperationActions.addOperation(params)),
  setCurrentOperation: (params) =>
    dispatch(OperationActions.setCurrentOperation(params)),
  setWorking: (params) => dispatch(OperationActions.setWorking(params)),

  getListReasonRequest: (params) =>
    dispatch(OperationActions.getListReasonRequest(params)),
  startOperationRequest: (params) =>
    dispatch(OperationActions.startOperationRequest(params)),
  stopOperationRequest: (params) =>
    dispatch(OperationActions.stopOperationRequest(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimerScreen);
