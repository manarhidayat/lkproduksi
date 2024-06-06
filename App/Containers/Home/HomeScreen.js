import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, Images, Fonts} from '../../Themes';
import Text from '../../Components/Text';
import NavigationServices from '../../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';
import {SessionSelectors} from '../../Redux/SessionRedux';
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

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  onPressScan(type) {
    if (type === 'L') {
      NavigationServices.push(NAVIGATION_NAME.HOME.setupLoading, {type});
    } else {
      NavigationServices.push(NAVIGATION_NAME.HOME.scan, {type});
    }
  }

  render() {
    const {user} = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <TouchableOpacity
          onPress={() =>
            NavigationServices.push(NAVIGATION_NAME.HOME.reports, {})
          }
          style={styles.menu}>
          {/* <Icon name="car-cruise-control" size={20} style={{marginRight: 10}} /> */}
          <Text>Report</Text>
        </TouchableOpacity>
        <View style={styles.header}>
          <Text>Pilih tipe: </Text>
        </View>

        <TouchableOpacity
          onPress={() => this.onPressScan('P')}
          style={styles.menu}>
          <Icon name="car-cruise-control" size={20} style={{marginRight: 10}} />
          <Text>Preparing</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.onPressScan('L')}
          style={styles.menu}>
          <Icon name="loading" size={25} style={{marginRight: 5}} />
          <Text>Loading</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.onPressScan('D')}
          style={styles.menu}>
          <Icon name="archive-lock-open" size={20} style={{marginRight: 10}} />
          <Text>Disassembly</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
const selector = createSelector([SessionSelectors.selectUser], (user) => ({
  user,
}));

const mapDispatchToProps = (dispatch) => ({});

const mapStateToProps = (state) => selector(state);

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
