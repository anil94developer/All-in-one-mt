import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { icons } from "../../assets/images";
import { StyleConstants } from "../../constants/Style.constant";
import { currentTheme } from "../../constants/ThemeProvider";
import { useNavigation } from "@react-navigation/native";

export default function CommonHeading(props) {
    const navigation = useNavigation();
    const { title } = props
    return (
        <View style={[StyleConstants.RowView, { backgroundColor: currentTheme().bgColor, marginTop: 20, paddingHorizontal: 20 }]}>
            <TouchableOpacity style={{ height: 40, width: 40, borderWidth: 2, borderColor: currentTheme().themeMode == "dark" ? currentTheme().cardColor2 : currentTheme().primaryColor, alignItems: 'center', justifyContent: 'center', borderRadius: 100, }} onPress={() => navigation.goBack()}>
                <Image source={icons.previousArrow} resizeMode="contain" style={{ height: 30, width: 30, tintColor: currentTheme().themeColor }} />
            </TouchableOpacity>
            <Text style={[StyleConstants.textBold20, { color: currentTheme().themeColor, fontWeight: '600', }]}>
                {title}
            </Text>
            <View style={{ width: 20 }}></View>
        </View>
    )
}