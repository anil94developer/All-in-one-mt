import { useState, useEffect, useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    Image,
    Modal,
    Keyboard,
    KeyboardAvoidingView,
    TextInput,
    TouchableWithoutFeedback,
    Button,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

// ::::::::::::::::::::::::::::::::: import constants
import { fontFamily } from "../../constants/font";
import { StyleConstants } from "../../constants/Style.constant";
import { ColorsConstant } from "../../constants/Colors.constant";
import { currentTheme, useTheme } from "../../constants/ThemeProvider";
import { screenWidth } from "../../constants/Sizes.constant";

function DropDown(props) {
    // const {theme} = useTheme()
    const {
        type,
        name,
        placeholder,
        value,
        setName,
        setId,
        list,
        onPress,
        error,
        id,
        disable,
        mandatary,
        search,
        width,
        choice

    } = props;

    let identy = useRef(name);

    const [selectValue, setSelectValue] = useState("");

    return (
        <>
            {
                name &&
                <View style={{ flexDirection: 'row' }}>
                    <Text
                        style={{
                            color: currentTheme().textColor,
                            fontWeight: "bold",
                        }}
                    >
                        {name}
                    </Text>

                </View>
            }


            <View style={[{
                width: width ? width : screenWidth - 80, borderWidth: 1, justifyContent: 'center',
                borderColor: currentTheme().cardColor2, borderRadius: 8,
                paddingHorizontal: 12,
                backgroundColor: currentTheme().backgroundbg, alignSelf: "center"
            }]}>

                {
                    mandatary &&
                    <View style={{ position: 'absolute', backgroundColor: currentTheme().secondaryColor, height: 50, width: 5, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, }} />

                }


                <Dropdown

                    containerStyle={{
                        // backgroundColor: currentTheme().secondaryColor,
                        marginTop: -2,
                        borderWidth: 2,

                        // borderRadius:8,
                        borderColor: currentTheme().inputBorderColor,


                    }}
                    style={[
                        styles.dropdown,
                        {
                            borderColor: currentTheme().White,
                            // borderRadius:10

                        },
                    ]}

                    itemTextStyle={styles.textstyledropdown}
                    placeholderStyle={[styles.placeholderStyle, StyleConstants.text14, { color: currentTheme().themeColor, fontSize: 14 }]}
                    selectedTextStyle={[styles.selectedTextStyle, { color: currentTheme().themeColor, }]}
                    iconStyle={[styles.iconStyle, { tintColor: currentTheme().themeColor, }]}
                    data={list}
                    searchPlaceholder="Search"
                    inputSearchStyle={{ color: currentTheme().textColor }}
                    maxHeight={250}
                    labelField="label"
                    search={search}
                    disable={disable}
                    valueField="value"
                    placeholder={placeholder}
                    value={value == "" || value == null ? selectValue : value}
                    onChange={(item) => {
                        setSelectValue(item.value);
                        setName(item.label);
                        setId(item.value);
                        onPress(item.value);
                    }}
                />
                {/* {error != "" && ( */}
                {error && <Text style={StyleConstants.errText}>{error}</Text>}
            </View>
        </>
    );
}

const styles = StyleSheet.create({

    dropdownContainer: {
        // backgroundColor: "red",
        // paddingVertical: 5,
    },
    dropdown: {
        height: 50,
        // borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 8,

    },
    icon: {
        marginRight: 5,
    },

    placeholderStyle: {

        paddingHorizontal: 5,
    },
    textstyledropdown: {
        color: currentTheme().themeColor,
        marginVertical: -18,

    },
    selectedTextStyle: {

        textTransform: "capitalize",
        paddingHorizontal: 5,

    },
    iconStyle: {
        tintColor: currentTheme().themeColor,
        width: 30
    }

});

export default DropDown;
