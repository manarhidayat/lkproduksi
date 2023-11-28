import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Fonts, Colors } from '../../../Themes/'

export default StyleSheet.create({
    card: ApplicationStyles.card,
    line: ApplicationStyles.line,
    titleFeed: {
        color: 'black',
        marginHorizontal: 10,
        marginTop: 10,
        fontSize: 16,
        fontFamily: Fonts.type.bold,
    }
})
