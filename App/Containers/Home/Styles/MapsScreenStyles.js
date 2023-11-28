import {StyleSheet, Dimensions} from 'react-native';
import {ApplicationStyles, Metrics, Fonts, Colors} from '../../../Themes/';
import {ifIphoneX} from 'react-native-iphone-x-helper';

export default StyleSheet.create({
  card: ApplicationStyles.card,
  line: ApplicationStyles.line,
  containerSearch: {
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    height: 60,
    width: '90%'
  },
  containerItemRusuns: {
    width: Dimensions.get('window').width - 80,
    borderRadius: 5,
    marginRight: 15,
    height: 150,
  },
  btnDirection: {
    borderRadius: 10,
    width: 150,
    position: 'absolute',
    marginBottom: 0,
    right: 10,
    bottom: 10,
  },
  list: {
    flexGrow: 1,
    position: 'absolute',
    width: '100%',
    bottom: 15,
    left: 15,
    right: 15,
    // justifyContent: 'flex-end',
    // alignItems: 'flex-end'
  },
});
