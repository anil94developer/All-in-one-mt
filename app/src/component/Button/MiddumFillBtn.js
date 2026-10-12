import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { fontFamily } from "../../constants/font";
import { screenWidth } from "../../constants/Sizes.constant";
import { StyleConstants } from "../../constants/Style.constant";


function MiddumFillBtn(props) {
    const { label, onPress,backgroundColor ,color} = props
    return (
        <View>
            <TouchableOpacity style={[StyleConstants.bottunth,{width:screenWidth * (220 / 375),backgroundColor:backgroundColor}]} onPress={()=> onPress()}>
                <Text style={[StyleConstants.textsigup,{fontFamily:fontFamily.semiBold,color:color}]}>{label}</Text>
            </TouchableOpacity>
        </View>
    )
}
export default MiddumFillBtn;