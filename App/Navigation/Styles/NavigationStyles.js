import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  header: {
    backgroundColor: Colors.primary
  },
  title: {
    color: 'white'
  },
  headerStyle: {
    backgroundColor: 'white',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    color: Colors.primary,
    fontWeight: 'normal',
    textAlign: 'left'
  },
  containerFabSos: {
    position: 'absolute',
    // ...ifIphoneX({
    //     top: Dimensions.get('window').height - 170,
    // },{
    //     top: Dimensions.get('window').height - 120,
    // }),
    top: -50,
    // right: 20,
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: 'white',
  },
  fabSos: {
    borderRadius: 45,
    borderWidth: 8,
    flex: 1,
    backgroundColor: 'white',
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTab: {
    width: 25,
    height: 25
  }
})
