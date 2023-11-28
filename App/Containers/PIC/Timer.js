import React, {PureComponent} from 'react';
import {View, AppState} from 'react-native';
import {createSelector} from 'reselect';
import {connect} from 'react-redux';
import SessionActions, {SessionSelectors} from '../../Redux/SessionRedux';
import {OperationSelectors} from '../../Redux/OperationRedux';
import Text from '../../Components/Text';

import TextUtil from '../../Lib/TextUtil';
import Spacer from '../../Components/Spacer';
import moment from 'moment';

const CAUTION_TIME = 10;

class Timer extends PureComponent {
  clockCall = null;
  cautionAlreadyCall = false;

  constructor(props) {
    super(props);
    this.appState = AppState.currentState;
    this.state = {
      timer: 0,
    };

    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.restartTimer = this.restartTimer.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
  }

  componentDidMount() {
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange
    );

    const {setRef} = this.props;
    if (typeof setRef === 'function') {
      setRef(this);
    }
  }

  componentWillUnmount() {
    this.stopTimer();
    this.appStateSubscription.remove();
  }

  handleAppStateChange = (nextAppState) => {
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.restartTimer();
    }

    if (
      this.appState === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      this.stopTimer();
    }

    this.appState = nextAppState;
  };

  setCautionAlreadyCall() {
    this.cautionAlreadyCall = true;
  }

  stopTimer() {
    if (this.clockCall) {
      clearInterval(this.clockCall);
    }
  }

  restartTimer() {
    const {currentOperation} = this.props;
    const time = Math.round(
      (Date.now() - new Date(currentOperation.startTime).getTime()) / 1000
    );

    this.setState({timer: time}, () => {
      this.startTimer();
    });
  }

  startTimer() {
    const {isTimesCaution} = this.props;
    this.clockCall = setInterval(() => {
      if (this.state.timer > CAUTION_TIME && !this.cautionAlreadyCall) {
        isTimesCaution();
      }
      this.decrementClock();
    }, 1000);
  }

  decrementClock() {
    this.setState((prevState) => ({
      timer: prevState.timer + 1,
    }));
  }

  render() {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <View style={{flexDirection: 'row'}}>
          <Text>Hrs</Text>
          <Spacer width={60} />
          <Text>Min</Text>
        </View>
        <Text style={{fontSize: 56, fontWeight: 'bold'}}>
          {TextUtil.formatTimeCountDown(this.state.timer)}
        </Text>
      </View>
    );
  }
}

const selector = createSelector(
  [OperationSelectors.getCurrentOperation],
  (currentOperation) => ({
    currentOperation,
  })
);

const mapStateToProps = (state) => selector(state);

const mapDispatchToProps = (dispatch) => ({
  saveTimer: (params) => dispatch(SessionActions.saveTimer(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Timer);
