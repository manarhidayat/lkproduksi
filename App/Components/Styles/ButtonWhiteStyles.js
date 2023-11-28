import { StyleSheet } from 'react-native'
import { Fonts, Colors } from '../../Themes/'

export default StyleSheet.create({
  button: {
    marginVertical: 15,
    backgroundColor: 'white',
    borderWidth: 2, 
    borderColor: Colors.primary,
    borderRadius: 5,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    // margin: 10,
    textAlign: 'center',
    fontFamily: Fonts.type.bold,
    color: 'black',
    fontSize: Fonts.size.medium,
    fontFamily: Fonts.type.regular
  }
})
