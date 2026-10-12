import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { currentTheme } from '../constants/ThemeProvider'

const Divider = () => {
  return (
    <View style={styles.divider}>
     
    </View>
  )
}

export default Divider

const styles = StyleSheet.create({
    divider: {
        height: 0.5,
        // width:screenWidth-30,
        backgroundColor: currentTheme().gary,
      },
})