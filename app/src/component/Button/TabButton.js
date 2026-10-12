import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { ColorsConstant } from "../../constants/Colors.constant";
import { screenWidth } from "../../constants/Sizes.constant";
import { StyleConstants } from "../../constants/Style.constant";

function TabButton(props) {
    const { label, onPress } = props;
    return (
        <View>
            <TouchableOpacity
                style={[
                    StyleConstants.Textinput,
                    { width: screenWidth / 2 - 70, justifyContent: "center" },
                ]}
                onPress={() => onPress()}
            >
                <Text
                    style={[
                        StyleConstants.textsigup,
                        { color: ColorsConstant.White },
                    ]}
                >
                    {label}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
export default TabButton;
