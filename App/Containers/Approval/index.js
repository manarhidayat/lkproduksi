import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Colors, Images, Fonts} from '../../Themes';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/AntDesign';

import Text from '../../Components/Text';
import NavigationServices from '../../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';
import Spacer from '../../Components/Spacer';
import DashboardActions, {DashboardSelectors} from '../../Redux/DashboardRedux';
import SessionActions from '../../Redux/SessionRedux';
import InputDate from '../../Components/InputDate';
import FullButton from '../../Components/FullButton';
import {SessionSelectors} from '../../Redux/SessionRedux';
import {getStatusOperation} from '../../Lib/Helper';
import moment from 'moment';

const styles = StyleSheet.create({
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: Colors.greyLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  item: {
    padding: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.border,
    margin: 5,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    elevation: 1.5,
    marginTop: 10,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 50,
  },
  contentHeader: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    flex: 1,
    height: 100,
    width: 150,
    marginTop: 20,
    marginRight: 10,
  },
  flexRow: {flexDirection: 'row', alignItems: 'center'},
  containerStatus: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  textTime: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  textBatch: {
    fontWeight: 'bold',
    fontSize: 21,
  },
  form: {
    flexDirection: 'row',
  },
});

const schema = Yup.object().shape({
  start_date: Yup.string().required('Mohon lengkapi Tanggal Awal'),
  end_date: Yup.string().required('Mohon lengkapi Tanggal Akhir'),
});

class ApprovalScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderItem = this.renderItem.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this);
    this.onPressLogout = this.onPressLogout.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderHeaderItem = this.renderHeaderItem.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const {navigation, getResumeBatchRequest, listResume} = this.props;
    setTimeout(() => {
      navigation.setParams({onPressLogout: this.onPressLogout});

      if (listResume.length < 1) {
        const start_date = moment(new Date())
          .add(-1, 'day')
          .format('YYYY-MM-DD');
        const end_date = moment(new Date()).format('YYYY-MM-DD');
        getResumeBatchRequest({start_date, end_date});
      }
    }, 300);
  }

  handleSubmit(values) {
    const {start_date, end_date} = values;
    const {getResumeBatchRequest} = this.props;

    getResumeBatchRequest({start_date, end_date});
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
          },
        },
      ],
      {cancelable: false}
    );
  }

  renderHeaderItem({item, index}) {
    return (
      <View style={styles.contentHeader}>
        <Text style={{fontSize: 32}}>{item.value}</Text>
        <Spacer height={10} />
        <View style={styles.flexRow}>
          {item.icon}
          <Spacer width={10} />
          <Text style={{flex: 1}}>{item.title}</Text>
        </View>
      </View>
    );
  }

  renderHeader() {
    const {resume} = this.props;
    const array = [
      {
        title: 'Belum diproses',
        value: resume.queue,
        icon: <Icon3 name="exclamationcircleo" size={20} color={'grey'} />,
      },
      {
        title: 'Diproses',
        value: resume.in_progress,
        icon: <Icon2 name="timer-sand" size={20} color={'black'} />,
      },
      {
        title: 'Menunggu Disetujui',
        value: resume.waiting,
        icon: <Icon3 name="questioncircleo" size={20} color={'orange'} />,
      },
      {
        title: 'Disetujui',
        value: resume.approved,
        icon: <Icon3 name="checkcircleo" size={20} color={'green'} />,
      },
      {
        title: 'Ditolak',
        value: resume.decline,
        icon: <Icon3 name="closecircleo" size={20} color={'red'} />,
      },
    ];
    return (
      <View style={{marginBottom: 10}}>
        <FlatList data={array} renderItem={this.renderHeaderItem} horizontal />
      </View>
    );
  }

  renderEmpty() {
    return (
      <View style={styles.empty}>
        <Text>Tidak ada Batch</Text>
      </View>
    );
  }

  renderItem({item}) {
    const {start, end, status, statusColor, statusBackground, lastProses} =
      getStatusOperation(item);

    return (
      <TouchableOpacity
        onPress={() =>
          NavigationServices.navigate(NAVIGATION_NAME.APPROVAL.detail, {item})
        }
        style={styles.item}>
        <View style={[styles.flexRow, {justifyContent: 'space-between'}]}>
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
          <Text style={styles.textTime}>{lastProses}</Text>
        </View>
        <Spacer height={10} />
        <Text style={styles.textBatch}>{item.woi_remarks}</Text>
        <Spacer height={10} />
        <View style={[styles.flexRow, {justifyContent: 'space-between'}]}>
          <Text>
            {start} - {end}
          </Text>
          <View style={styles.flexRow}>
            <Icon3 name="filetext1" size={15} color={'grey'} />
            <Spacer width={6} />
            <Text>{item.total_catatan} Catatan</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderForm(props) {
    return (
      <View>
        <View style={styles.form}>
          <InputDate
            title="Tanggal Awal"
            placeholder="Tanggal Awal"
            name="start_date"
            pointerEvents="none"
            editable={true}
            selectTextOnFocus={false}
            value={props.values.start_date}
            error={props.errors.start_date}
            containerStyle={{flex: 0.5}}
            mode="date"
            onSelect={(item) => {
              props.setFieldValue('start_date', item);
            }}
            setFieldTouched={() => {}}
            maximumDate={
              props.values.end_date
                ? new Date(props.values.end_date)
                : undefined
            }
          />
          <Spacer width={10} />
          <InputDate
            title="Tanggal Akhir"
            placeholder="Tanggal Akhir"
            name="end_date"
            pointerEvents="none"
            editable={true}
            selectTextOnFocus={false}
            containerStyle={{flex: 0.5}}
            mode="date"
            value={props.values.end_date}
            error={props.errors.end_date}
            onSelect={(item) => {
              props.setFieldValue('end_date', item);
            }}
            setFieldTouched={() => {}}
            minimumDate={
              props.values.start_date
                ? new Date(props.values.start_date)
                : undefined
            }
          />
        </View>
        <FullButton
          onPress={(e) => {
            props.handleSubmit(e);
          }}
          text={'CARI BATCH'}
        />
      </View>
    );
  }

  render() {
    const {user, listResume} = this.props;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.content}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.avatar}>
              <Icon name="user" size={25} color={'grey'} />
            </View>
            <Spacer width={10} />
            <View>
              <Text>Halo, {user.usernama}</Text>
              <Text>{user.nama_branch}</Text>
            </View>
          </View>
          <Spacer height={20} />
          <Formik
            onSubmit={this.handleSubmit}
            validationSchema={schema}
            render={this.renderForm}
            initialValues={{
              start_date: moment(new Date())
                .add(-1, 'day')
                .format('YYYY-MM-DD'),
              end_date: moment(new Date()).format('YYYY-MM-DD'),
            }}
          />
          <FlatList
            contentContainerStyle={{flexGrow: 1, paddingBottom: 200}}
            data={listResume}
            renderItem={this.renderItem}
            ListEmptyComponent={this.renderEmpty}
            ListHeaderComponent={this.renderHeader}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const selector = createSelector(
  [
    SessionSelectors.selectUser,
    DashboardSelectors.getResume,
    DashboardSelectors.getListResume,
  ],
  (user, resume, listResume) => ({
    user,
    resume,
    listResume,
  })
);

const mapStateToProps = (state, props) => {
  return selector(state);
};

const mapDispatchToProps = (dispatch) => ({
  getResumeBatchRequest: (params) =>
    dispatch(DashboardActions.getResumeBatchRequest(params)),
  setLogin: (params) => dispatch(SessionActions.setLogin(params)),
  removeSession: (params) => dispatch(SessionActions.removeSession(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ApprovalScreen);
