import {StyleSheet} from 'react-native';
import Fonts from './Fonts';
import Metrics from './Metrics';
import Colors from './Colors';

// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

export default StyleSheet.create({
  card: {
    marginBottom: 10,
    padding: 10,
    shadowColor: '#6A6A6A',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      height: 2,
      width: 2,
    },
    elevation: 3.5,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.border,
    marginTop: 5,
    marginBottom: 10,
  },
  imageProfile: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  titleProperty: {
    marginVertical: 5,
    fontSize: 18,
  },
  labelError: {
    fontSize: Fonts.size.small,
    color: 'red',
    fontFamily: Fonts.type.regular,
  },
  label: {
    color: 'grey',
    marginTop: 5,
    fontSize: Fonts.size.small,
    fontFamily: Fonts.type.regular,
  },
  containerModal: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
  },
  backgroundModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: -20,
    margin: -30,
  },
  headerTitle: {
    fontFamily: Fonts.type.bold,
    fontSize: Fonts.size.regular,
    color: Colors.black,
    marginBottom: Metrics.baseMargin,
  },
  progressBar: {
    fontSize: 16,
    textAlign: 'center',
    justifyContent: 'center',
    height: 30,
    alignItems: 'center',
  },
  actionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.primary,
  },
});
