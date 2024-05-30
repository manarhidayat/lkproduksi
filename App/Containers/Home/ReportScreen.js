import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, Images, Fonts} from '../../Themes';
import Text from '../../Components/Text';
import NavigationServices from '../../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';
import {SessionSelectors} from '../../Redux/SessionRedux';
import OperationActions, {OperationSelectors} from '../../Redux/OperationRedux';
import {version} from '../../../package.json';

const styles = StyleSheet.create({
  menu: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

class ReportScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    const {getReportsRequest} = this.props;
    getReportsRequest();
  }

  renderItem({item}) {
    return (
      <View style={styles.rowItem}>
        <View style={{flexDirection: 'row'}}></View>
      </View>
    );
  }

  render() {
    const {reports} = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <FlatList data={reports || []} renderItem={this.renderItem} />
      </SafeAreaView>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReportScreen);
