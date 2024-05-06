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
      const {navigation, isWorking, currentOperation} = this.props;
      navigation.setParams({hideBackButton: false});

      if (isWorking) {
        this.onPressStart();

        if (currentOperation && currentOperation.notes) {
          this.setState({notes: currentOperation.notes});
        }
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

  onShowStopModal() {
    const {route, currentOperation} = this.props;
    const operation = route.params?.item;
    const item = operation || currentOperation;

    this.modalStopTimer.show(
      parseInt(item.wc_avg_time, 10) * 60 < this.timerRef.getTimer() &&
        !currentOperation.notes
    );
  }

  onPressStart(detailMaterial) {
    const {
      setWorking,
      setCurrentOperation,
      route,
      isWorking,
      currentOperation,
      startOperationRequest,
      // detailMaterial,
      progressId,
    } = this.props;
    const item = route.params?.item || currentOperation;
    const {navigation} = this.props;
    navigation.setParams({hideBackButton: true});

    let startTime = new Date();
    this.isPlaying = true;
    this.setState({startTime});

    if (isWorking) {
      this.timerRef.restartTimer();
      startTime = currentOperation.startTime;
    } else {
      this.timerRef.startTimer(true);

      let operation = {
        ...item,
        startTime,
      };
      if (item.wc_is_material === 'Y') {
        operation = {
          ...operation,
          detailMaterial,
        };
      }

      const params = {
        progress_id: progressId,
        process_id: item.wc_id,
        is_material: item.wc_is_material,
        // detail_material: item.wc_is_material === 'Y' ? detailMaterial : [],
        detail_material: [],
      };

      setCurrentOperation(operation);
      startOperationRequest(params);
      setWorking(true);
    }
  }

  onPressStop(comment) {
    const {
      setWorking,
      setCurrentOperation,
      addOperation,
      currentOperation,
      stopOperationRequest,
      progressDetailId,
    } = this.props;
    const {notes} = this.state;

    let operation = {...currentOperation, endTime: new Date()};
    let params = {
      progress_detail_id: progressDetailId,
      reason_id: null,
      other_reason: null,
    };

    if (notes && notes.reason) {
      params = {
        ...params,
        reason_id: notes ? notes.reason.code_id : '',
        other_reason: notes && notes.reasonOther ? notes.reasonOther : '-',
      };
    }

    if (comment && comment.reason) {
      params = {
        ...params,
        reason_id: comment ? comment.reason.code_id : '',
        other_reason:
          comment && comment.reasonOther ? comment.reasonOther : '-',
      };
      operation = {
        ...operation,
        notes: comment,
      };
    }

    if (this.timerRef) {
      this.timerRef.stopTimer();
    }
    this.isPlaying = false;
    setWorking(false);
    addOperation(operation);
    setCurrentOperation(null);
    stopOperationRequest(params);

    setTimeout(() => {
      NavigationServices.pop();
    }, 100);
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
          <Text>{notes.reason ? notes.reason.code_name : ''}</Text>
          <Text>{notes.reasonOther}</Text>
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
                  onPress={() => this.onShowStopModal()}
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
            onDone={(detailMaterial) => this.onPressStart(detailMaterial)}
            // useMaterial={item.wc_is_material === 'Y'}
            title={'Mulai Proses'}
            desc={'Apakah Anda akan memulai proses?'}
          />
          <ModalStartTimer
            setRef={(r) => (this.modalStopTimer = r)}
            onDone={(comment) => {
              if (comment) {
                this.onAddComment(comment);
              }
              this.onPressStop(comment);
            }}
            title={'Hentikan Proses'}
            desc={'Apakah Anda akan menghentikan proses'}
          />
          <ModalAddComment
            setRef={(r) => (this.modalAddComment = r)}
            onDone={(comment) => this.onAddComment(comment)}
          />
          <ModalCautionTimer
            setRef={(r) => (this.modalCautionTimer = r)}
            // onStop={() => this.onPressStop()}
            onStop={() => this.onShowStopModal()}
            cautionTime={
              item.wc_avg_time ? parseInt(item.wc_avg_time, 10) : '0'
            }
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
