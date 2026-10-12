import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import images from '../assets/images'
import { ColorsConstant } from '../constants/Colors.constant'
import { screenWidth } from '../constants/Sizes.constant'
import { useTheme } from '../constants/ThemeProvider'

const HeaderEvent = (props) => {
    const { theme, updateTheme } = useTheme()
    const { phoneIcon, Chat, Email, title } = props;
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.cardColor1, height: 44, width: screenWidth - 40, marginHorizontal: 20, borderRadius: 8, marginTop: 16 }}>
            <View style={{ marginHorizontal: 24 }}>
                <Text>{title}</Text>
            </View>
            <View style={{ marginHorizontal: 21, flexDirection: 'row', }}>
                <TouchableOpacity onPress={phoneIcon}>
                    <Image source={images.phone} style={{ height: 17.5, width: 17.5, marginHorizontal: 10 }} resizeMode='contain' />
                </TouchableOpacity>
                <TouchableOpacity onPress={Chat}>
                    <Image source={images.chat} style={{ height: 17.5, width: 17.5, marginHorizontal: 10 }} resizeMode='contain' />
                </TouchableOpacity>
                <TouchableOpacity onPress={Email}>
                    <Image source={images.envelope} style={{ height: 17.5, width: 17.5, marginHorizontal: 10 }} resizeMode='contain' />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default HeaderEvent

const styles = StyleSheet.create({})