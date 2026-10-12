import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { ColorsConstant } from "../../constants/Colors.constant";
import { screenWidth } from "../../constants/Sizes.constant";
import { StyleConstants } from "../../constants/Style.constant";
import { currentTheme } from "../../constants/ThemeProvider";

//style={[StyleConstants.Textinput,{justifyContent:'center'}]}
function SmailOutLineBtn(props) {
    const { label, onPress, backgroundColor } = props
    return (
        <View>
            <TouchableOpacity style={[StyleConstants.Textinput, {
                width: screenWidth / 2 - 70, justifyContent: 'center', borderRadius: 50, borderWidth: 1,
                borderColor: currentTheme().cardColor2, backgroundColor: backgroundColor
            }]} onPress={() => onPress()}>
                <Text style={[StyleConstants.textsigup, StyleConstants.text18, {
                    color: currentTheme().themeColor,
                    width: screenWidth / 3, textAlign: 'center', padding: 8, right: 3, fontWeight: '600'
                }]}>{label}</Text>
            </TouchableOpacity>
        </View>
    )
}
export default SmailOutLineBtn;