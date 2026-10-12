import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import { ColorsConstant, lightTheme } from "../../constants/Colors.constant";
import { StyleConstants } from "../../constants/Style.constant";


function LargeOutLineBtn(props) {
    const { label, onPress,source } = props
    return (
        <View>
            <TouchableOpacity style={[StyleConstants.btnoutline,{justifyContent:'center',alignItems:'center',}]} onPress={() => onPress()}>
                <View style={{flexDirection:'row',alignItems:'center',}}>
                    <Image source={source} style={{width:20,height:20}} />
                    <Text style={[StyleConstants.textsigup,{color:lightTheme.White,}]}>{label}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}
export default LargeOutLineBtn;