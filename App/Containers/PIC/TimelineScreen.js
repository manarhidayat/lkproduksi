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
import {OperationSelectors} from '../../Redux/OperationRedux';
import Spacer from '../../Components/Spacer';
import TextUtil from '../../Lib/TextUtil';
import moment from 'moment';

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
    flex: 4,
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
            {moment(item.startTime).format('HH:mm')}
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
        <Text style={styles.title}>{item.name}</Text>
      </View>
    );
  }

  render() {
    const {operations} = this.props;

    let timer = 0;
    if (operations.length > 0) {
      const startTime = operations[0].startTime;
      const endTime = operations[operations.length - 1].endTime;

      timer = Math.round(
        (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000
      );
    }

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView>
          <View style={styles.content}>
            <Text style={{fontSize: 21}}>1231313.CD</Text>
            <Text style={{fontWeight: '600', fontSize: 21}}>Batch Selesai</Text>
            <Spacer height={30} />

            <Text>Total Waktu</Text>
            <Text style={{fontSize: 56, fontWeight: 'bold'}}>
              {TextUtil.formatTimeCountDown(timer)}
            </Text>

            <Spacer height={30} />
            {operations &&
              operations.map((item, index) => this.renderItem(item, index))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const selector = createSelector(
  [OperationSelectors.getOperations],
  (operations) => ({
    operations,
  })
);

const mapStateToProps = (state) => selector(state);

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TimelineScreen);
