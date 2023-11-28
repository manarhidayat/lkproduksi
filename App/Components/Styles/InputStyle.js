import {StyleSheet} from 'react-native';
import {ApplicationStyles, Colors, Fonts} from '../../Themes';

export default StyleSheet.create({
  // container: {
  //   flex: 1
  // },
  label: ApplicationStyles.label,
  error: ApplicationStyles.labelError,
  input: {
    width: '100%',
    height: 25,
    padding: 0,
    paddingLeft: 5,
    fontFamily: Fonts.type.regular,
    fontSize: 16
  },
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.greyLight
  }
});
