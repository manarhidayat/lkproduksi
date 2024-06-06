import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {Colors, Images, Fonts} from '../../Themes';
import OperationActions, {OperationSelectors} from '../../Redux/OperationRedux';
import Spacer from '../../Components/Spacer';
import Text from '../../Components/Text';
import NavigationServices from '../../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';
import {getDataQr} from '../../Lib/Helper';

const styles = StyleSheet.create({});

class DetailReportScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {route} = this.props;
    const data = route.params.item;

    return (
      <View style={{flex: 1, padding: 16}}>
        <ScrollView>
          <View
            style={{
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: 'bold'}}>{data.pt_code}</Text>
            <Text style={{fontWeight: 'bold'}}>Tanggal: {data.rif_date}</Text>
            <Text style={{fontWeight: 'bold'}}>{data.rif_remarks}</Text>
          </View>
          <Spacer height={16} />
          <Text>Detail: </Text>
          {data.detail.map((detail) => {
            const item = getDataQr(detail.rifd_qr_code);
            return (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  borderBottomWidth: 1,
                  borderColor: 'grey',
                  paddingBottom: 10,
                }}>
                <View style={{width: 140}}>
                  <Text>PT Code</Text>
                  <Text>PT Description</Text>
                  <Text>Batch</Text>
                  <Text>Pack</Text>
                  <Text>Location</Text>
                  <Text>In Date</Text>
                  <Text>Expire Date</Text>
                  <Text>Qty</Text>
                  <Text>Notes</Text>
                </View>
                <View style={{}}>
                  <Text style={{fontWeight: 'bold'}}>: {item.pt_code}</Text>
                  <Text style={{fontWeight: 'bold'}}>: {item.pt_desc1}</Text>
                  <Text style={{fontWeight: 'bold'}}>: {item.batch}</Text>
                  <Text style={{fontWeight: 'bold'}}>
                    : {item.pcs} {item.pack}
                  </Text>
                  <Text style={{fontWeight: 'bold'}}>: {item.loc_desc}</Text>
                  <Text style={{fontWeight: 'bold'}}>: {item.in_date}</Text>
                  <Text style={{fontWeight: 'bold'}}>: {item.exp_date}</Text>
                  <Text style={{fontWeight: 'bold'}}>
                    : {item.qty} {item.um}
                  </Text>
                  <Text style={{fontWeight: 'bold'}}>: {item.catatan}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}
const selector = createSelector([OperationSelectors.getReports], (reports) => ({
  reports,
}));

const mapDispatchToProps = (dispatch) => ({
  getReportsRequest: (data) =>
    dispatch(OperationActions.getReportsRequest(data)),
});

const mapStateToProps = (state) => selector(state);

export default connect(mapStateToProps, mapDispatchToProps)(DetailReportScreen);
