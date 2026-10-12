import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { images } from '../../assets/images'
import { currentTheme } from '../../constants/ThemeProvider'

export default function AccountBlock() {
  return (
    <View style={{flex:1,backgroundColor:currentTheme().textColor,alignContent:'center',justifyContent:'center',alignItems:'center'}}>
      <Image source={images.block} style={{height:190,width:200}} resizeMode='stretch'/>
      <Text style={{color:currentTheme().antiTextColor,fontSize:20,marginTop:20}}>Sorry your account is block</Text>
    </View>
  )
}

const styles = StyleSheet.create({})