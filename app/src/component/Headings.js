import React from 'react';
import {View,Text,StyleSheet} from 'react-native'
import { currentTheme } from '../constants/ThemeProvider';
import { StyleConstants } from '../constants/Style.constant';

export default function Headings(props){
    const {title} = props
    return(
        <View>
            <Text style={StyleConstants.text1}>
                {title}
            </Text>
            <View style={styles.lngLine} />
            <View style={styles.shrtLne} />
            
        </View>
    )
}

const styles = StyleSheet.create({
    lngLine: {
        alignSelf: 'flex-start',
        // position: 'absolute',
        borderBottomColor: currentTheme().themeColor,
        borderBottomWidth: 4.5,
        width: "60%",
        top: 5,
        borderRadius: 10
      },
      shrtLne: {
        alignSelf: 'flex-end',
        // position: 'absolute',
        borderBottomColor: currentTheme().themeBorder,
        borderBottomWidth: 4.5,
        width: "30%",
        // top: 5,
        borderRadius: 10, 
        // left: 60
      },
})