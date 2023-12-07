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
import DashboardActions from '../../Redux/DashboardRedux';
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
    paddingTop: 0,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 30,
    marginBottom: 10,
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

  componentDidMount() {
    this.props.getResumeBatchRequest();
  }

  render() {
    const {user} = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.header}>
          <View style={styles.row}>
            <Image
              source={{uri: user.profile_photo_url}}
              style={styles.avatar}
            />
            <Text>{version}</Text>
          </View>
          <Text>Halo,</Text>
          <Text>{user.name}</Text>
        </View>

        <TouchableOpacity
          onPress={() => NavigationServices.push(NAVIGATION_NAME.HOME.profile)}
          style={styles.menu}>
          <Icon name="account" size={20} style={{marginRight: 10}} />
          <Text>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {}
            // NavigationServices.push(NAVIGATION_NAME.INVENTORY.list)
          }
          style={styles.menu}>
          <Icon name="garage" size={25} style={{marginRight: 5}} />
          <Text>Active Item</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => NavigationServices.push(NAVIGATION_NAME.ACTIVITY.list)}
          style={styles.menu}>
          <Icon
            name="format-list-bulleted"
            size={20}
            style={{marginRight: 10}}
          />
          <Text>Activity</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
const selector = createSelector(
  [SessionSelectors.selectMachine, SessionSelectors.selectUser],
  (machine, user) => ({
    machine,
    user,
  })
);

const mapDispatchToProps = (dispatch) => ({
  getResumeBatchRequest: (params) =>
    dispatch(DashboardActions.getResumeBatchRequest(params)),
});

const mapStateToProps = (state) => selector(state);

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
