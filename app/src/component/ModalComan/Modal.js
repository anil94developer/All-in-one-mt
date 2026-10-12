import React from "react";
import { View, Text, Modal,StyleSheet, Image, TouchableOpacity } from "react-native";
import { ColorsConstant } from "../../constants/Colors.constant";
import IMAGE from "../../constants/image";
import { StyleConstants } from "../../constants/Style.constant";

function Modals(props) {
    const { label, onPress,color,height } = props
    return (
        <TouchableOpacity onPress={() => onPress()}
            key={props}
            style={[StyleConstants.btnoutline, styles.RowView]}>
            <Text
                style={styles.textSelect}>{label}</Text>
            <Image source={IMAGE.dropdown}   />
        </TouchableOpacity>
    )
}
const s=StyleConstants,styles=StyleSheet.create({
    RowView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textSelect: {
        color: ColorsConstant.White
    }
})
export default Modals;