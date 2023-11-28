import {StyleSheet} from 'react-native';
import {Fonts, Colors} from '../../Themes/';

export default StyleSheet.create({
  button: {
    marginVertical: 15,
    backgroundColor: Colors.primary,
    borderRadius: 5,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 1
    },
    elevation: 1.5,
    flexDirection: 'row'
  },
  linear: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 5
  },
  buttonText: {
    // margin: 10,
    color: 'white',
    textAlign: 'center',
    fontFamily: Fonts.type.bold,
    fontSize: Fonts.size.medium
  }
});
