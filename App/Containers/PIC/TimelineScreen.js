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
import OperationActions, {OperationSelectors} from '../../Redux/OperationRedux';
import Spacer from '../../Components/Spacer';
import TextUtil from '../../Lib/TextUtil';
import moment from 'moment';
import SessionActions, {SessionSelectors} from '../../Redux/SessionRedux';
import DashboardActions, {DashboardSelectors} from '../../Redux/DashboardRedux';
import FullButton from '../../Components/FullButton';
import NavigationServices from '../../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';
import {TYPE_ONBOARDING} from '../../Lib/Constans';
import ModalMaterialNote from '../../Components/ModalMaterialNote';
import ModalUpdateMaterial from '../../Components/ModalUpdateMaterial';

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
  content: {
    padding: 16,
    alignItems: 'center',
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
  flexDirection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
  },
});

class TimelineScreen extends Component {
  modalMaterialNote = undefined;
  modalUpdateMaterial = undefined;

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const {batch, getTimelineBatchRequest} = this.props;
    setTimeout(() => {
      getTimelineBatchRequest({woi_oid: batch.woi_oid});
    }, 100);
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
        {/* LEFT */}
        <View style={{flex: 4}}>
          {index !== 0 && (
            <Text style={{color: 'grey'}}>
              Idle time: {TextUtil.formatTimeCountDown(idleTime)}
            </Text>
          )}
          <Text style={{fontWeight: 'bold'}}>
            {moment(startTime).format('HH:mm')}
            {startTime !== endTime && (
              <>
                {endTime
                  ? ` - ${moment(endTime).format('HH:mm')}`
                  : ' - Sekarang'}
              </>
            )}
          </Text>
          <Text style={{color: 'grey'}}>
            {moment(startTime).format('ddd, DD MMM')}
          </Text>
          <Spacer height={10} />
          {endTime && timer !== 0 && (
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
        {/* CENTER */}
        <View style={{flex: 2, alignItems: 'center'}}>
          <View style={styles.dot} />
          {!isLast && <View style={styles.line} />}
        </View>
        {/* RIGHT */}
        <View style={{flex: 4, alignItems: 'flex-end'}}>
          <Text style={styles.title}>{item.wc_desc}</Text>
          <Spacer height={6} />
          {item.notes || item.materials.length > 0 ? (
            <TouchableOpacity onPress={() => this.modalMaterialNote.show(item)}>
              <Text style={{color: Colors.primary}}>Lihat Detail</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          <Spacer height={6} />
          <TouchableOpacity
            onPress={() => this.modalUpdateMaterial.show(item.materials)}>
            <Icon name="edit" size={20} color={Colors.primary} />
          </TouchableOpacity>
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
    const {operations, batch, detail, timeline, notes, detailBatch} =
      this.props;

    let timer = 0;
    if (operations.length > 0) {
      const startTime = operations[0].startTime;
      const endTime = operations[operations.length - 1].endTime;

      timer = Math.round(
        (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000
      );
      // timer = 15091;
    }

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView>
          <View style={styles.content}>
            <Text style={{fontSize: 21}}>{batch.woi_remarks}</Text>
            <Text style={{fontWeight: '600', fontSize: 21}}>Batch Selesai</Text>
            <Spacer height={30} />

            <Text>Total Waktu</Text>
            <Spacer height={10} />
            <View style={{flexDirection: 'row'}}>
              <Text>{timer > 3599 ? 'Jam' : 'Mnt'}</Text>
              <Spacer width={60} />
              <Text>{timer > 3599 ? 'Mnt' : 'Dtk'}</Text>
              {timer > 3599 && (
                <>
                  <Spacer width={60} />
                  <Text>Dtk</Text>
                </>
              )}
            </View>
            <Text style={{fontSize: 56, fontWeight: 'bold'}}>
              {TextUtil.formatTimeCountDown(timer)}
            </Text>

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

            <Text style={styles.textBold}>Timeline</Text>
            <Spacer height={10} />
            {timeline &&
              timeline.map((item, index) => this.renderItem(item, index))}
            <Spacer height={20} />
            {notes.length > 0 && (
              <Text style={styles.textBold}>{notes.length} Catatan</Text>
            )}
            {notes.length > 0 &&
              notes.map((item, index) => this.renderItemNote(item, index))}
            <FullButton
              onPress={() => {
                NavigationServices.push(NAVIGATION_NAME.PIC.selectBatch);
                this.props.setTypeBoarding(TYPE_ONBOARDING.selectBatch);
                this.props.removeOperationsExcBatch();
                this.props.getListBatchRequest(this.props.batchRequest);
              }}
              text="SELESAI"
              style={{width: '100%'}}
            />
            <ModalMaterialNote setRef={(r) => (this.modalMaterialNote = r)} />
            <ModalUpdateMaterial
              setRef={(r) => (this.modalUpdateMaterial = r)}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const selector = createSelector(
  [
    OperationSelectors.getOperations,
    SessionSelectors.selectBatch,
    OperationSelectors.getBatchRequest,
    DashboardSelectors.getDetailDashboard,
    DashboardSelectors.getTimeline,
    DashboardSelectors.getNotes,
    OperationSelectors.getDetailBatch,
  ],
  (operations, batch, batchRequest, detail, timeline, notes, detailBatch) => ({
    operations,
    batch,
    batchRequest,
    detail,
    timeline,
    notes,
    detailBatch,
  })
);

const mapStateToProps = (state) => selector(state);

const mapDispatchToProps = (dispatch) => ({
  setTypeBoarding: (params) => dispatch(SessionActions.setTypeBoarding(params)),
  removeOperationsExcBatch: (params) =>
    dispatch(OperationActions.removeOperationsExcBatch(params)),
  getListBatchRequest: (params) =>
    dispatch(OperationActions.getListBatchRequest(params)),
  getTimelineBatchRequest: (params) =>
    dispatch(DashboardActions.getTimelineBatchRequest(params)),
  updateBatchRequest: (params) =>
    dispatch(OperationActions.updateBatchRequest(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimelineScreen);
