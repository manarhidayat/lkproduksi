import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList
} from 'react-native';
import {connect} from 'react-redux';

import {Colors, Images, Fonts} from '../../Themes';

import Text from '../../Components/Text';
import Spacer from '../../Components/Spacer';
import SessionActions from '../../Redux/SessionRedux';
import Icon from 'react-native-vector-icons/AntDesign';
import NavigationServices from '../../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: 'white'
  },
  row: {
    paddingLeft: 16,
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
    right: 60
  },
  iconEdit: {
    width: 70,
    height: 50,
    alignItems: 'flex-end',
    // borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  flexRow: {
    flexDirection: 'row'
  }
});

class ListActivityScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderItem = this.renderItem.bind(this);
    this.onPressAdd = this.onPressAdd.bind(this);
    this.onPressEdit = this.onPressEdit.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this);
  }

  onPressAdd() {
    NavigationServices.navigate(NAVIGATION_NAME.ACTIVITY.add);
  }

  onPressEdit(item) {
    NavigationServices.navigate(NAVIGATION_NAME.ACTIVITY.add, {
      activity: item,
      isEdit: true
    });
  }

  renderEmpty() {
    return (
      <View style={styles.empty}>
        <Text>There is no Activity</Text>
      </View>
    );
  }

  renderItem({item}) {
    let color = 'grey';
    if(item.isComplete && item.isUpload){
      color = Colors.primary
    }

    return (
      <TouchableOpacity
        onPress={() =>
          NavigationServices.push(NAVIGATION_NAME.SUPPORT_TOOLS.list, {
            activity: item
          })
        }
        style={styles.row}>
        <View style={styles.flexRow}>
          {item.isComplete && (
            <>
              <Icon name="check" size={19} color={color} />
              {/* <Spacer width={10}/> */}
            </>
          )}
          {item.isUpload && (
            <View style={{marginLeft: -10}}>
              <Icon name="check" size={19} color={color} />
              {/* <Spacer width={10}/> */}
            </View>
          )}
          <Spacer width={10}/> 
          <Text>{item.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.iconEdit}
          onPress={() => this.onPressEdit(item)}>
          <Icon name="edit" size={20} color="black" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  render() {
    const {activities} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          data={activities}
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

const mapStateToProps = (state) => ({
  activities: state.activity.activities
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ListActivityScreen);
