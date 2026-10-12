import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { ColorsConstant } from "../../constants/Colors.constant";
import { screenHeight, screenWidth } from "./../../constants/Sizes.constant";

import { fontFamily } from "../../constants/font";
// import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';

function SmailFillBtn(props) {
    const { label, onPress, disabled, bgcolor } = props;
    return (
        <View>
            <TouchableOpacity
                style={[styles.btnstyle, { backgroundColor: bgcolor }]}
                onPress={() => onPress()}
                disabled={disabled}
            >
                <Text style={styles.textbtn}>{label}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    btnstyle: {
        // width: 150,
        width: screenWidth / 3,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        borderColor: "#9c9aa1",
        borderRadius: 5,
    },
    textbtn: {
        color: ColorsConstant.White,
        fontWeight: "bold",
        fontSize: 15,
        textAlign: "center",
    },
});

export default SmailFillBtn;
