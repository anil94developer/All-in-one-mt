import React from "react";
import { TouchableOpacity, View, Text, ActivityIndicator } from "react-native";
import { ColorsConstant } from "../../constants/Colors.constant";
import { fontFamily } from "../../constants/font";
import { screenWidth } from "../../constants/Sizes.constant";
import { StyleConstants } from "../../constants/Style.constant";
import { currentTheme, useTheme } from '../../constants/ThemeProvider';
import { fontSizeConstant } from "../../constants/fontSize";


function LargefillBtn(props) {
    const { theme, updateTheme } = useTheme()

    const { label, onPress, textAlign, disabled, animating, setAnimating, backgroundColor, color, width } = props;
    return (
        <>
            {animating ?
                <ActivityIndicator size={'small'} color={currentTheme().themeColor} />
                :
                <TouchableOpacity
                    disabled={disabled}
                    onPress={onPress}
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                        height: screenWidth * (48 / 375),
                        backgroundColor: backgroundColor ? backgroundColor : (currentTheme().btnColor || '#061224'),
                        width: width ? width : screenWidth - 34,
                        marginTop: 10,
                        alignSelf: 'center'
                        // marginHorizontal:12
                    }}
                >

                    <Text
                        style={[
                            StyleConstants.text16,
                            {
                                // fontFamily: fontFamily.medium,
                                textAlign: "center",
                                color: color ? color : currentTheme().antiTextColor,
                                fontSize: fontSizeConstant.subHeadingFs,
                                fontWeight: 700
                            },
                        ]}
                    >
                        {label}
                    </Text>

                </TouchableOpacity>
            }
        </>
    );
}
export default LargefillBtn;
