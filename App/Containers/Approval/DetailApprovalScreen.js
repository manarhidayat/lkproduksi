import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {createSelector} from 'reselect';
import {connect} from 'react-redux';
import {Colors} from '../../Themes';
import Text from '../../Components/Text';
import ApprovalActions from '../../Redux/ApprovalRedux';
import DashboardActions, {DashboardSelectors} from '../../Redux/DashboardRedux';
import Spacer from '../../Components/Spacer';
import TextUtil from '../../Lib/TextUtil';
import moment from 'moment';
import {getStatusOperation} from '../../Lib/Helper';
import FullButton from '../../Components/FullButton';
import {SessionSelectors} from '../../Redux/SessionRedux';

const styles = StyleSheet.create({
  content: {
    padding: 16,
    flex: 1,
  },
  flexDirection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerStatus: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  textBold: {
    fontWeight: 'bold',
    fontSize: 17,
  },

  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },
  line: {
    width: 1,
    backgroundColor: Colors.primary,
    flex: 1,
  },
  containerTextTimer: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: Colors.greyLight,
  },
  title: {
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 18,
  },
  contentComment: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.greyLight,
    padding: 10,
    marginTop: 10,
  },
  textDate: {
    color: 'grey',
  },
  bottom: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
  },
});

class DetailApprovalScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const {route, getTimelineBatchRequest} = this.props;
    const item = route?.params?.item;

    getTimelineBatchRequest({woi_remarks: item.woi_remarks});
  }

  onAccept() {
    const {detail, approveRequest} = this.props;
    const item = detail;
    const {wocp_oid} = item;

    approveRequest({progress_id: wocp_oid});
  }

  onDecline() {
    const {detail, declineRequest} = this.props;
    const item = detail;
    const {wocp_oid} = item;

    declineRequest({progress_id: wocp_oid});
  }

  renderItem(item, index) {
    const startTime = item.wocpd_start_time;
    const endTime = item.wocpd_stop_time;

    const timer = Math.round(
      (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000
    );

    const isLast = this.props.timeline.length - 1 === index;

    return (
      <View style={{flexDirection: 'row', paddingHorizontal: 30}}>
        <View style={{flex: 4}}>
          <Text style={{fontWeight: 'bold'}}>
            {moment(item.startTime).format('HH:mm')} -{' '}
            {moment(item.endTime).format('HH:mm')}
          </Text>
          <Text style={{color: 'grey'}}>
            {moment(item.startTime).format('ddd, DD MMM')}
          </Text>
          <Spacer height={10} />
          <View style={{flexDirection: 'row'}}>
            <View style={styles.containerTextTimer}>
              <Text style={{color: Colors.primary}}>
                {TextUtil.formatTimeCountDown(timer)}
              </Text>
            </View>
            <View />
          </View>
          <Spacer height={20} />
        </View>
        <View style={{flex: 2, alignItems: 'center'}}>
          <View style={styles.dot} />
          {!isLast && <View style={styles.line} />}
        </View>
        <View style={{flex: 4}}>
          <Text style={styles.title}>{item.wc_desc}</Text>
          <Text>
            {item.notes && item.notes.reason ? item.notes.reason.code_name : ''}
          </Text>
        </View>
      </View>
    );
  }

  renderItemNote(item) {
    return (
      <View style={styles.contentComment}>
        <Text style={styles.textDate}>{item.time}</Text>
        <Spacer height={4} />
        <Text>{item.catatan}</Text>
        <Spacer height={10} />
        <Text style={{fontWeight: 'bold'}}>{item.process}</Text>
      </View>
    );
  }

  render() {
    const {user, detail, timeline, notes} = this.props;
    const item = detail;

    const {start, end, status, statusColor, statusBackground, lastProses} =
      getStatusOperation(item);

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.flexDirection}>
              <Text style={styles.textBold}>Batch Detail</Text>
              {status !== '' ? (
                <View
                  style={[
                    styles.containerStatus,
                    {backgroundColor: statusBackground},
                  ]}>
                  <Text style={{fontWeight: 'bold', color: statusColor}}>
                    {status}
                  </Text>
                </View>
              ) : (
                <View />
              )}
            </View>
            <Spacer height={10} />
            <View style={styles.flexDirection}>
              <Text>Batch mulai</Text>
              <Text>{start}</Text>
            </View>
            <View style={styles.flexDirection}>
              <Text>Batch Selesai</Text>
              <Text>{end}</Text>
            </View>
            <View style={styles.flexDirection}>
              <Text>Progress</Text>
              <Text style={{fontWeight: 'bold'}}>{lastProses}</Text>
            </View>
            <Spacer height={20} />
            <Text style={styles.textBold}>Timeline</Text>
            <Spacer height={10} />
            {timeline &&
              timeline.map((item, index) => this.renderItem(item, index))}
            <Spacer height={20} />
            <Text style={styles.textBold}>{notes.length} Catatan</Text>
            {notes.length > 0 &&
              notes.map((item, index) => this.renderItemNote(item, index))}
          </View>
        </ScrollView>
        {user.role === 'K' &&
          item.wocp_status !== 'A' &&
          item.wocp_status !== 'D' && (
            <View style={styles.bottom}>
              <FullButton
                onPress={() => this.onDecline()}
                style={{
                  width: '45%',
                  backgroundColor: Colors.button,
                  borderWidth: 1,
                }}
                text="DECLINE"
                textStyle={{color: 'black'}}
              />
              <Spacer width={20} />
              <FullButton
                onPress={() => this.onAccept()}
                style={{width: '45%'}}
                text="ACCEPT"
              />
            </View>
          )}
      </SafeAreaView>
    );
  }
}

const selector = createSelector(
  [
    DashboardSelectors.getDetailDashboard,
    DashboardSelectors.getTimeline,
    DashboardSelectors.getNotes,
    SessionSelectors.selectUser,
  ],
  (detail, timeline, notes, user) => ({
    detail,
    timeline,
    notes,
    user,
  })
);

const mapStateToProps = (state) => selector(state);

const mapDispatchToProps = (dispatch) => ({
  getTimelineBatchRequest: (params) =>
    dispatch(DashboardActions.getTimelineBatchRequest(params)),
  approveRequest: (params) => dispatch(ApprovalActions.approveRequest(params)),
  declineRequest: (params) => dispatch(ApprovalActions.declineRequest(params)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailApprovalScreen);
