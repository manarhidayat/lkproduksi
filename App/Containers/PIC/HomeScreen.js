import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import {createSelector} from 'reselect';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, Images} from '../../Themes';
import Text from '../../Components/Text';
import SessionActions, {SessionSelectors} from '../../Redux/SessionRedux';
import NavigationServices from '../../Navigation/NavigationServices';
import {NAVIGATION_NAME} from '../../Navigation/NavigationName';
import {OperationSelectors} from '../../Redux/OperationRedux';
import {OPERATIONS, OPERATIONS_TYPES} from '../../Lib/Constans';
import Spacer from '../../Components/Spacer';
import FullButton from '../../Components/FullButton';

const styles = StyleSheet.create({
  row: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    height: 60,
    width: 60,
  },
  containerIcon: {
    height: 80,
    width: 80,
    borderRadius: 10,
    backgroundColor: Colors.greyLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentItem: {
    marginTop: 10,
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
});

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      const {isWorking, currentOperation} = this.props;

      if (isWorking) {
        NavigationServices.navigate(NAVIGATION_NAME.PIC.timer, {
          item: currentOperation,
        });
      }
    }, 100);
  }

  renderItem({item, index}) {
    if (index === 11) {
      return <View style={{width: 80}} />;
    }

    return (
      <TouchableOpacity
        onPress={() =>
          NavigationServices.navigate(NAVIGATION_NAME.PIC.timer, {item})
        }
        style={styles.contentItem}>
        <View style={styles.containerIcon}>
          <Image source={item.icon} style={styles.icon} resizeMode="contain" />
        </View>
        <Spacer height={10} />
        <Text>{item.name}</Text>
        <Spacer height={10} />
      </TouchableOpacity>
    );
  }

  render() {
    const {operations} = this.props;
    const list = Object.values(OPERATIONS);

    console.tron.log('wew operations', operations);

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.content}>
          <FlatList
            data={[...list, 1]}
            renderItem={this.renderItem}
            numColumns={3}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 20,
            }}
            columnWrapperStyle={{justifyContent: 'space-between'}}
          />
          <FullButton
            onPress={() =>
              NavigationServices.navigate(NAVIGATION_NAME.PIC.timeline)
            }
            text="FINISH"
          />
        </View>
      </SafeAreaView>
    );
  }
}

const selector = createSelector(
  [OperationSelectors.getCurrentOperation, OperationSelectors.isWorking],
  (currentOperation, isWorking) => ({
    currentOperation,
    isWorking,
  })
);

const mapStateToProps = (state) => selector(state);

const mapDispatchToProps = (dispatch) => ({
  saveMachine: (params) => dispatch(SessionActions.saveMachine(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
