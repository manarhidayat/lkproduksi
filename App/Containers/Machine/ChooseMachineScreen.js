import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert
} from 'react-native';
import {createSelector} from 'reselect';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../Themes';
import Text from '../../Components/Text';
import SessionActions, {SessionSelectors} from '../../Redux/SessionRedux';
import MachineActions, {MachineSelectors} from '../../Redux/MachineRedux';
import NavigationServices from '../../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';

const styles = StyleSheet.create({
  row: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
});

class ChooseMachineScreen extends Component {
  shouldConfirm = false;

  constructor(props) {
    super(props);
    const {role} = props;
    if (role && role.name === 'Operator') {
      this.shouldConfirm = true;
    }

    this.state = {};
    this.renderItem = this.renderItem.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this);
    this.onChooseMachine = this.onChooseMachine.bind(this);
  }

  componentDidMount() {
    const {navigation, getListActiveMachineRequest} = this.props;

    this.navListener = navigation.addListener('beforeRemove', (e) => {
      if (!this.shouldConfirm) {
        return;
      }
      e.preventDefault();
      Alert.alert('Warning', 'Pick Machine first please', [
        {
          text: 'Ok',
          onPress: () => {},
          style: 'cancel'
        },
      ]);
    });

    getListActiveMachineRequest({});
  }

  componentWillUnmount() {
    if (this.navListener) {
      this.navListener();
    }
  }

  onChooseMachine(machine) {
    const {saveMachine, getListItemOfMachineRequest} = this.props;
    this.shouldConfirm = false;
    saveMachine(machine);
    getListItemOfMachineRequest(machine.id);
    NavigationServices.pop();
  }

  renderEmpty() {
    return (
      <View style={styles.empty}>
        <Text>There is no Machine</Text>
      </View>
    );
  }

  renderItem({item}) {
    return (
      <TouchableOpacity
        onPress={() => this.onChooseMachine(item)}
        style={styles.row}>
        <View>
          <Text>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {machines} = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          data={machines}
          renderItem={this.renderItem}
          ListEmptyComponent={this.renderEmpty}
        />
        <TouchableOpacity onPress={this.onPressAdd} style={styles.fab}>
          <Icon name="plus" size={20} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const selector = createSelector(
  [SessionSelectors.selectRole, MachineSelectors.getMachiines],
  (role, machines) => ({
    role,
    machines
  })
);

const mapStateToProps = (state) => selector(state);

const mapDispatchToProps = (dispatch) => ({
  saveMachine: (params) => dispatch(SessionActions.saveMachine(params)),
  getListActiveMachineRequest: (params) =>
    dispatch(MachineActions.getListActiveMachineRequest(params)),
  getListItemOfMachineRequest: (params) =>
    dispatch(MachineActions.getListItemOfMachineRequest(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseMachineScreen);
