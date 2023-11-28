import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList
} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {Colors, Images, Fonts} from '../../Themes';

import Text from '../../Components/Text';
import Icon from 'react-native-vector-icons/AntDesign';
import NavigationServices from '../../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';
import { SessionSelectors } from '../../Redux/SessionRedux';
import { InventorySelectors } from '../../Redux/InventoryRedux';
import MachineActions from '../../Redux/MachineRedux';

const styles = StyleSheet.create({
  row: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    justifyContent: 'space-between',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    position: 'absolute',
    bottom: 20,
    right: 20
  }
});

class ListInventoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderItem = this.renderItem.bind(this);
    this.onPressAdd = this.onPressAdd.bind(this);
    this.onPressEdit = this.onPressEdit.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setParams({onPressRefresh: this.onRefresh});
  }

  onRefresh() {
    const {getListItemOfMachineRequest, machine} = this.props;
    getListItemOfMachineRequest(machine.id);
  }

  onPressAdd() {
    const {route} = this.props;
    NavigationServices.navigate(NAVIGATION_NAME.INVENTORY.add, {});
  }

  onPressEdit(item) {
    NavigationServices.navigate(NAVIGATION_NAME.INVENTORY.add, {
      inventory: item,
      isEdit: true
    });
  }

  renderEmpty() {
    return (
      <View style={styles.empty}>
        <Text>There is no Inventory</Text>
      </View>
    );
  }

  renderItem({item}) {
    return (
      <TouchableOpacity
        // onPress={() => this.onPressEdit(item)}
        style={styles.row}>
        <Text style={{fontWeight: 'bold'}}>{item.item_name}</Text>
        {  
          item.alert_unit !== 'Meter' && item.alert_unit !== 'Hour' &&
          <>
            <Text>Initial: {item.initial}</Text>
            <Text>Used: {item.used}</Text>
          </>
        }
      </TouchableOpacity>
    );
  }

  render() {
    const {inventories} = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          data={inventories}
          renderItem={this.renderItem}
          ListEmptyComponent={this.renderEmpty}
        />
        {/* <TouchableOpacity onPress={this.onPressAdd} style={styles.fab}>
          <Icon name="plus" size={20} color="white" />
        </TouchableOpacity> */}
      </SafeAreaView>
    );
  }
}

const selector = createSelector(
  [InventorySelectors.getListInventory, SessionSelectors.selectMachine],
  (inventories, machine) => ({
    inventories,
    machine
  })
);

const mapStateToProps = (state, props) => {
  return selector(state);
};

const mapDispatchToProps = (dispatch) => ({
  getListItemOfMachineRequest: (params) =>
    dispatch(MachineActions.getListItemOfMachineRequest(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListInventoryScreen);
