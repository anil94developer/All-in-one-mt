import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { screenHeight, screenWidth } from '../constants/Sizes.constant'
import { currentTheme } from '../constants/ThemeProvider'

export default function StaticBackground() {
  return (
    <LinearGradient start={{x: 1, y:0 }} end={{x: 1, y: 1}}  colors={[currentTheme().antiTextColor,currentTheme().themeColor, ]} style={{position:'absolute',height:screenHeight,width:screenWidth}}>
     
    </LinearGradient>
  )
}

const styles = StyleSheet.create({})