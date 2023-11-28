import {StyleSheet, Dimensions} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {ApplicationStyles, Metrics, Fonts, Colors} from '../../../Themes/';

const {width} = Dimensions.get('screen')

export default StyleSheet.create({
  card: ApplicationStyles.card,
  line: ApplicationStyles.line,
  imageProfile: ApplicationStyles.imageProfile,
  card2: {
    // width: '47%',
    flex: 0.49,
    height: 90,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 0
  },
  card3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  containerHeader: {
    backgroundColor: Colors.primaryDark,
    height: isIphoneX() ? 220 : 180,
    padding: 10
  },
  containerCircle: {
    backgroundColor: Colors.primaryDark,
    marginTop: -25,
    width,
    height: 50,
    borderRadius: 25,
  },
  bgIcon: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    height: 50,
    width: 50
  },
  title: {
    color: 'white',
    fontSize: 17,
    fontFamily: Fonts.type.bold,
    flexWrap: 'wrap',
    flex: 1
  },
  sectionMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -50,
    marginHorizontal: 15
  },
  sectionFeed: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: 15,
  },
  dotPagination: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary
  },
  pagination: {
    backgroundColor: '#00000000',
    paddingTop: 0,
    paddingBottom: 0,
  },
  titleFeed: {
    color: 'black',
    fontFamily: Fonts.type.bold,
    marginHorizontal: 10,
    marginTop: 10
  },
  fabSos: {
    position: 'absolute',
    // ...ifIphoneX({
    //     top: Dimensions.get('window').height - 170,
    // },{
    //     top: Dimensions.get('window').height - 120,
    // }),
    bottom: -10,
    // right: 20,
    height: 60,
    width: 60,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: Colors.primary,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
    alignSelf: 'center'
  }
});
