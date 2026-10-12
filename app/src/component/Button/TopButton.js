import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { ColorsConstant } from "../../constants/Colors.constant";
import { fontFamily } from "../../constants/font";
import { StyleConstants } from "../../constants/Style.constant";

function TopButton(props) {
    const { label, onPress, textAlign } = props;
    return (
        <View style={{ alignSelf: "center", margin: 20 }}>
            <TouchableOpacity
                style={StyleConstants.bottunth}
                onPress={() => onPress()}
            >
                <Text
                    style={[
                        StyleConstants.textsigup,
                        {
                            fontFamily: fontFamily.semiBold,
                            textAlign: "center",
                            color: ColorsConstant.White,
                        },
                    ]}
                >
                    {label}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
export default TopButton;
