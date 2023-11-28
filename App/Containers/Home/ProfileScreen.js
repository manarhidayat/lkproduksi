import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import {Colors, Images, Fonts} from '../../Themes';

import Text from '../../Components/Text';
import SessionActions from '../../Redux/SessionRedux';
import NavigationServices from '../../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';

const styles = StyleSheet.create({
  menu: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
});

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onPressLogout = this.onPressLogout.bind(this);
    this.onChooseMachine = this.onChooseMachine.bind(this);
  }

  onChooseMachine() {
    const {activitiesNotUploaded} = this.props;
    if (activitiesNotUploaded.length > 0) {
      Alert.alert('Warning', 'Make sure all activites has uploaded');
    } else {
      NavigationServices.navigate(NAVIGATION_NAME.HOME.chooseMachine);
    }
  }

  onPressLogout() {
    const {activitiesNotUploaded} = this.props;

    if (activitiesNotUploaded.length > 0) {
      Alert.alert('Warning', 'Make sure all activites has uploaded');
    } else {
      this.props.setLogin(false);
      this.props.removeSession();
    }
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.menu}>
          <Text>Profile</Text>
        </View>
        <TouchableOpacity onPress={this.onChooseMachine} style={styles.menu}>
          <Text>Choose Machine</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onPressLogout} style={styles.menu}>
          <Text style={{color: 'red'}}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setLogin: (params) => dispatch(SessionActions.setLogin(params)),
  removeSession: (params) => dispatch(SessionActions.removeSession(params)),
});

export default connect(null, mapDispatchToProps)(ProfileScreen);
