import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { screenHeight, screenWidth } from "../../constants/Sizes.constant";

import { fontFamily } from "../../constants/font";
import { currentTheme } from "../../constants/ThemeProvider";
import { StyleConstants } from "../../constants/Style.constant";
// import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';

function SmailFillBtn(props) {
    const { label, onPress, disabled, backgroundColor, color } = props;
    return (
        <View>
            <TouchableOpacity
                style={[styles.btnstyle, { backgroundColor: backgroundColor, borderRadius: 10 }]}
                onPress={() => onPress()}
                disabled={disabled}
            >
                <Text style={[styles.textbtn, {
                    fontWeight: '600',
                    color: color ? color : currentTheme().White,
                }]}>{label}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    btnstyle: {
        // width: 150,

        width: screenWidth / 2 - 25,
        // height: 30,
        alignItems: "center",
        alignSelf: 'center',
        justifyContent: "center",
        borderColor: "#9c9aa1",
        borderRadius: 1,
        padding: 10
    },
    textbtn: {
        color: currentTheme().antiTextColor,
        fontWeight: "bold",
        fontSize: 17,
        textAlign: "center",
    },
});

export default SmailFillBtn;
