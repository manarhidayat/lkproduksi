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
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';
import Spacer from '../../Components/Spacer';
import Timer from './Timer';
import moment from 'moment';
import ModalStartTimer from '../../Components/ModalStartTimer';
import ModalAddComment from '../../Components/ModalAddComment';
import ModalCautionTimer from '../../Components/ModalCautionTimer';
import ModalAddMaterial from '../../Components/ModalAddMaterial';

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
});

class TimerScreen extends Component {
  timerRef = undefined;
  isPlaying = false;

  modalStartTimer = undefined;
  modalStopTimer = undefined;
  modalAddComment = undefined;
  modalCautionTimer = undefined;
  modalAddMaterial = undefined;

  constructor(props) {
    super(props);

    this.state = {
      notes: [],
      startTime: null,
    };

    this.onPressStart = this.onPressStart.bind(this);
    this.onPressStop = this.onPressStop.bind(this);
    this.onAddComment = this.onAddComment.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      const {navigation, isWorking} = this.props;
      navigation.setParams({hideBackButton: false});

      if (isWorking) {
        this.onPressStart();
      }
    }, 100);
  }

  onAddComment(comment) {
    const {currentOperation, setCurrentOperation} = this.props;
    const {notes} = this.state;
    const newNotes = [...notes, {comment, date: new Date()}];
    this.setState({notes: newNotes});
    setCurrentOperation({...currentOperation, notes: newNotes});
  }

  onPressStart() {
    const {
      setWorking,
      setCurrentOperation,
      route,
      isWorking,
      currentOperation,
    } = this.props;
    const item = route.params?.item;

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

    setWorking(true);
    const operation = {
      ...item,
      startTime,
    };
    setCurrentOperation(operation);
  }

  onPressStop() {
    const {setWorking, setCurrentOperation, addOperation, currentOperation} =
      this.props;
    if (this.timerRef) {
      this.timerRef.stopTimer();
    }
    this.isPlaying = false;

    setWorking(false);
    const operation = {...currentOperation, endTime: new Date()};
    addOperation(operation);
    setCurrentOperation(null);
    NavigationServices.pop();
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
    if (this.modalAddMaterial.isVisible()) {
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
        <Text style={{fontWeight: 'bold'}}>Comments</Text>
        <Spacer height={10} />
        {notes.map((item) => (
          <View style={styles.contentComment}>
            <Text style={{color: 'grey'}}>
              {item.date ? moment(item.date).format('DD MMMM YYYY HH:mm') : ''}
            </Text>
            <Text>{item.comment}</Text>
          </View>
        ))}
      </View>
    );
  }

  render() {
    const {batch, route, currentOperation} = this.props;
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
          <Timer
            setRef={(r) => (this.timerRef = r)}
            isTimesCaution={() => this.setTimesCaution()}
          />
          <Spacer height={10} />
          <View style={styles.spaceEvenly}>
            <View style={styles.alignCenter}>
              <Text>Batch</Text>
              <Text style={styles.title}>{batch}</Text>
            </View>
            <View style={styles.alignCenter}>
              <Text>Start </Text>
              <Text style={styles.title}>
                {startTime ? moment(startTime).format('HH:mm') : '-'}
              </Text>
            </View>
          </View>
          <Spacer height={40} />

          <View style={styles.spaceEvenly}>
            {!this.isPlaying ? (
              <View style={styles.alignCenter}>
                <TouchableOpacity
                  // onPress={this.onPressStart}
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
                  onPress={() => this.modalAddComment.show()}
                  style={styles.btnStart}>
                  <Entypo name="edit" size={30} color={Colors.primary} />
                </TouchableOpacity>
                <Spacer height={10} />
                <Text style={styles.btnText}>Comment</Text>
              </View>
            )}
            {this.isPlaying && (
              <View style={styles.alignCenter}>
                <TouchableOpacity
                  disabled={!this.isPlaying}
                  onPress={() => this.modalAddMaterial.show()}
                  style={styles.btnStart}>
                  <Icon name="plus" size={30} color={Colors.primary} />
                </TouchableOpacity>
                <Spacer height={10} />
                <Text style={styles.btnText}>Add Material</Text>
              </View>
            )}
          </View>
          {notes.length > 0 && this.renderComment()}
          <ModalStartTimer
            setRef={(r) => (this.modalStartTimer = r)}
            onDone={() => this.onPressStart()}
            title={'Start Timer'}
            desc={'Are You sure will start the timer?'}
          />
          <ModalStartTimer
            setRef={(r) => (this.modalStopTimer = r)}
            onDone={() => this.onPressStop()}
            title={'Stop Timer'}
            desc={'Are You sure will stop the timer?'}
          />
          <ModalAddComment
            setRef={(r) => (this.modalAddComment = r)}
            onDone={(comment) => this.onAddComment(comment)}
          />
          <ModalCautionTimer
            setRef={(r) => (this.modalCautionTimer = r)}
            onStop={() => this.onPressStop()}
          />
          <ModalAddMaterial
            setRef={(r) => (this.modalAddMaterial = r)}
            // onDone={(comment) =>
            //   this.setState({notes: [...notes, {comment, date: new Date()}]})
            // }
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
  ],
  (batch, currentOperation, isWorking) => ({
    batch,
    currentOperation,
    isWorking,
  })
);

const mapStateToProps = (state) => selector(state);

const mapDispatchToProps = (dispatch) => ({
  saveTimer: (params) => dispatch(SessionActions.saveTimer(params)),

  addOperation: (params) => dispatch(OperationActions.addOperation(params)),
  setCurrentOperation: (params) =>
    dispatch(OperationActions.setCurrentOperation(params)),
  setWorking: (params) => dispatch(OperationActions.setWorking(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimerScreen);
