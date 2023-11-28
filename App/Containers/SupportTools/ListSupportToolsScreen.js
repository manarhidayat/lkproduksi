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
import {Colors} from '../../Themes';

import Text from '../../Components/Text';
import SessionActions from '../../Redux/SessionRedux';
import Icon from 'react-native-vector-icons/AntDesign';
import NavigationServices from '../../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';
import { SupportToolsSelectors } from '../../Redux/SupportToolsRedux';

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

class ListSupportToolsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderItem = this.renderItem.bind(this);
    this.onPressAdd = this.onPressAdd.bind(this);
    this.onPressEdit = this.onPressEdit.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this);
  }

  onPressAdd() {
    const {route} = this.props;
    const activity = route?.params?.activity;
    NavigationServices.navigate(NAVIGATION_NAME.SUPPORT_TOOLS.add, {activity});
  }

  onPressEdit(item) {
    const {route} = this.props;
    const activity = route?.params?.activity;
    NavigationServices.navigate(NAVIGATION_NAME.SUPPORT_TOOLS.add, {
      supportTools: item,
      isEdit: true,
      activity
    });
  }

  renderEmpty() {
    return (
      <View style={styles.empty}>
        <Text>There is no Support Tools</Text>
      </View>
    );
  }

  renderItem({item}) {
    return (
      <TouchableOpacity
        onPress={() => this.onPressEdit(item)}
        style={styles.row}>
        <View>
          <Text>{item.inventory.item_name}</Text>
          <Text>{item.jumlah || 0} {item.inventory.alert_unit}</Text>
          {
              item.bor && item.bor !== 0 ? 
                <Text>Kemajuan Bor: {item.bor} Meter</Text> : <View/>
          }
        </View>
        <Icon name="edit" size={20} color="black" />
      </TouchableOpacity>
    );
  }

  render() {
    const {supportTools, route} = this.props;
    const activity = route?.params?.activity;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          data={supportTools}
          renderItem={this.renderItem}
          ListEmptyComponent={this.renderEmpty}
        />
       {!activity.isUpload && <TouchableOpacity onPress={this.onPressAdd} style={styles.fab}>
          <Icon name="plus" size={20} color="white" />
        </TouchableOpacity>}
      </SafeAreaView>
    );
  }
}

const selector = createSelector(
  [SupportToolsSelectors.getListSupportTools],
  (supportTools) => ({
    supportTools
  })
);

const mapStateToProps = (state, props) => {
  const activity = props?.route?.params?.activity;
  return selector(state, activity.id);
};

const mapDispatchToProps = (dispatch) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListSupportToolsScreen);
