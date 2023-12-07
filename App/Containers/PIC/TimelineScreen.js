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
import FullButton from '../../Components/FullButton';
import NavigationServices from '../../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';
import {TYPE_ONBOARDING} from '../../Lib/Constans';
import RNRestart from 'react-native-restart';

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
});

class TimelineScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  renderItem(item, index) {
    const startTime = item.startTime;
    const endTime = item.endTime;

    const timer = Math.round(
      (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000
    );

    const isLast = this.props.operations.length - 1 === index;

    return (
      <View style={{flexDirection: 'row', paddingHorizontal: 30}}>
        <View style={{flex: 4}}>
          <Text style={{fontWeight: 'bold'}}>
            {moment(item.startTime).format('HH:mm')} -{' '}
            {moment(item.endTime).format('HH:mm')}
          </Text>
          <Text style={{color: 'grey'}}>
            {TextUtil.replaceString(
              moment(item.startTime).format('ddd, DD MMM')
            )}
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
        <View style={{flex: 4, alignItems: 'flex-end'}}>
          <Text style={styles.title}>{item.wc_desc}</Text>
          <Spacer height={6} />
          {item.notes && item.notes.reason ? (
            // <Text>{item.notes.reason.code_name}</Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  item.notes.reason.code_name,
                  item.notes.reason.reasonOther
                )
              }>
              <Icon name="exclamationcircleo" size={20} color={'black'} />
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>
      </View>
    );
  }

  render() {
    const {operations, batch, startGas, endGas, jumlahProduksi} = this.props;

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
              <Text>Jam</Text>
              <Spacer width={60} />
              <Text>Mnt</Text>
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

            <View style={{width: '100%', marginLeft: 40}}>
              <Text>
                Mulai Gas: <Text style={{fontWeight: 'bold'}}>{startGas}</Text>
              </Text>
              <Text>
                Akhir Gas: <Text style={{fontWeight: 'bold'}}>{endGas}</Text>
              </Text>
              <Text>
                Jumlah Produksi:{' '}
                <Text style={{fontWeight: 'bold'}}>{jumlahProduksi}</Text>
              </Text>
            </View>

            <Spacer height={30} />
            {operations &&
              operations.map((item, index) => this.renderItem(item, index))}
            <FullButton
              onPress={() => {
                NavigationServices.navigate(NAVIGATION_NAME.PIC.selectBatch);
                this.props.setTypeBoarding(TYPE_ONBOARDING.selectBatch);
                this.props.removeOperationsExcBatch();
                // RNRestart.restart();
              }}
              text="SELESAI"
              style={{width: '100%'}}
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
    OperationSelectors.getStartGas,
    OperationSelectors.getEndGas,
    OperationSelectors.getJumlahProduksi,
  ],
  (operations, batch, startGas, endGas, jumlahProduksi) => ({
    operations,
    batch,
    startGas,
    endGas,
    jumlahProduksi,
  })
);

const mapStateToProps = (state) => selector(state);

const mapDispatchToProps = (dispatch) => ({
  setTypeBoarding: (params) => dispatch(SessionActions.setTypeBoarding(params)),
  removeOperationsExcBatch: (params) =>
    dispatch(OperationActions.removeOperationsExcBatch(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimelineScreen);
