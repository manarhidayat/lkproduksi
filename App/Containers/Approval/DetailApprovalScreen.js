import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import {createSelector} from 'reselect';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
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
import ModalMaterialNote from '../../Components/ModalMaterialNote';

const styles = StyleSheet.create({
  content: {
    padding: 16,
    flex: 1,
    paddingBottom: 100,
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
  modalMaterialNote = undefined;

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const {route, getTimelineBatchRequest} = this.props;
    const item = route?.params?.item;
    getTimelineBatchRequest({woi_oid: item.woi_oid});
  }

  onAccept() {
    const {detail, approveRequest} = this.props;
    const item = detail;
    const {wocp_oid} = item;

    Alert.alert(
      'Approve',
      'Apakah Anda akan meng-Approve batch ini?',
      [
        {
          text: 'Batal',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Ya',
          onPress: () => approveRequest({progress_id: wocp_oid}),
        },
      ],
      {cancelable: false}
    );
  }

  onDecline() {
    const {detail, declineRequest} = this.props;
    const item = detail;
    const {wocp_oid} = item;

    Alert.alert(
      'Decline',
      'Apakah Anda akan meng-Decline batch ini?',
      [
        {
          text: 'Batal',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Ya',
          onPress: () => declineRequest({progress_id: wocp_oid}),
        },
      ],
      {cancelable: false}
    );
  }

  renderItem(item, index) {
    const {timeline} = this.props;
    const startTime = item.wocpd_start_time;
    const endTime = item.wocpd_stop_time;

    const timer = Math.round(
      (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000
    );

    const isLast = this.props.timeline.length - 1 === index;

    let idleTime = 0;
    if (index !== 0) {
      idleTime = Math.round(
        (new Date(startTime).getTime() -
          new Date(timeline[index - 1].wocpd_stop_time).getTime()) /
          1000
      );
    }

    return (
      <View style={{flexDirection: 'row', paddingHorizontal: 30}}>
        <View style={{flex: 4}}>
          {index !== 0 && (
            <Text style={{color: 'grey'}}>
              Idle time: {TextUtil.formatTimeCountDown(idleTime)}
            </Text>
          )}
          <Text style={{fontWeight: 'bold'}}>
            {moment(startTime).format('HH:mm')} -{' '}
            {endTime ? moment(endTime).format('HH:mm') : 'Sekarang'}
          </Text>
          <Text style={{color: 'grey'}}>
            {moment(startTime).format('ddd, DD MMM')}
          </Text>
          <Spacer height={10} />
          {endTime && (
            <View style={{flexDirection: 'row'}}>
              <View style={styles.containerTextTimer}>
                <Text style={{color: Colors.primary}}>
                  {TextUtil.formatTimeCountDown(timer)}
                </Text>
              </View>
              <View />
            </View>
          )}
          <Spacer height={20} />
        </View>
        <View style={{flex: 2, alignItems: 'center'}}>
          <View style={styles.dot} />
          {!isLast && <View style={styles.line} />}
        </View>
        <View style={{flex: 4, alignItems: 'flex-end'}}>
          <Text style={styles.title}>{item.wc_desc}</Text>
          {/* <Text>
            {item.notes && item.notes.reason ? item.notes.reason.code_name : ''}
          </Text> */}
          <Spacer height={6} />
          {item.notes || item.materials.length > 0 ? (
            // <Text>{item.notes.reason.code_name}</Text>
            <TouchableOpacity onPress={() => this.modalMaterialNote.show(item)}>
              {/* <Icon name="exclamationcircleo" size={20} color={'black'} /> */}
              <Text style={{color: 'blue'}}>Lihat Detail</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
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
              <Text>{TextUtil.replaceString(end)}</Text>
            </View>
            <View style={styles.flexDirection}>
              <Text>Progress</Text>
              <Text style={{fontWeight: 'bold'}}>{lastProses}</Text>
            </View>
            <View style={styles.flexDirection}>
              <Text>Gas Start</Text>
              <Text style={{fontWeight: 'bold'}}>
                {TextUtil.formatMoney(
                  detail.wocp_gas_start
                    ? parseInt(detail.wocp_gas_start, 10)
                    : '-'
                )}
              </Text>
            </View>
            <View style={styles.flexDirection}>
              <Text>Gast Stop</Text>
              <Text style={{fontWeight: 'bold'}}>
                {TextUtil.formatMoney(
                  detail.wocp_gas_stop
                    ? parseInt(detail.wocp_gas_stop, 10)
                    : '-'
                )}
              </Text>
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
        <ModalMaterialNote setRef={(r) => (this.modalMaterialNote = r)} />
        {user.role === 'K' && item.wocp_status === 'W' && (
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
