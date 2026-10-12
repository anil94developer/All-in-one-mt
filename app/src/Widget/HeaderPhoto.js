import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, } from 'react-native'
import { StyleConstants } from '../constants/Style.constant'
import images from '../assets/images'
import { ColorsConstant } from '../constants/Colors.constant'
import OptionsMenu from "react-native-option-menu";
import { useTheme } from '../constants/ThemeProvider'

const HeaderPhoto = ({ leftIcon, rightIcon, label, type, Edit, Delete, EditAction, DeleteAction }) => {
    const { theme, updateTheme } = useTheme()

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, height: 42 }}>
            <TouchableOpacity onPress={leftIcon} hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }} >
                <Image source={images.lefticon} style={{ height: 16, width: 19 }} />
            </TouchableOpacity>
            <Text style={{ fontSize: 16, color: theme.black, fontWeight: 700 }}>
                {label}
            </Text>
            {

                type == "Checklist" ? <View></View> :
                    <TouchableOpacity onPress={rightIcon} >
                        {/* <Image source={images.stroke} style={{ height: 16, width: 3, resizeMode: 'contain' }} /> */}
                        <View >
                            <OptionsMenu
                            hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
                                style={{ color: '#fff', tintColor: '#fff' }}
                                button={images.stroke}
                                buttonStyle={{ height: 19, width: 5, resizeMode: 'contain' }}
                                options={[Edit, Delete, "Cancel"]}
                                actions={[EditAction, DeleteAction]}
                            />
                        </View>
                    </TouchableOpacity>
            }

        </View>
    )
}

export default HeaderPhoto

const styles = StyleSheet.create({})