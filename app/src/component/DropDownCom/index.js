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

function DropDownCom(props) {
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
        choice,
        borderColor,
        backgroundColor,
        textColor,
        placeholderTextColor,
        selectedTextColor,
        iconColor,
        isDark: explicitIsDark,
    } = props;

    let identy = useRef(name);

    const [selectValue, setSelectValue] = useState("");

    const isDark =
        explicitIsDark !== undefined
            ? explicitIsDark
            : backgroundColor === '#061224' ||
              backgroundColor === '#0B1E38' ||
              (typeof backgroundColor === 'string' &&
                  (backgroundColor.startsWith('#0') || backgroundColor.startsWith('#1')));

    const effectiveTitleColor = textColor || (isDark ? '#E2B048' : currentTheme().textColor);
    const effectivePlaceholderColor =
        placeholderTextColor || (isDark ? '#94A3B8' : currentTheme().placeholderColor || '#94A3B8');
    const effectiveSelectedTextColor =
        selectedTextColor || textColor || (isDark ? '#E2B048' : currentTheme().textColor);
    const effectiveIconColor =
        iconColor || (isDark ? '#E2B048' : currentTheme().themeColor || currentTheme().textColor);
    const effectiveContainerBg = isDark ? '#0B1E38' : currentTheme().backgroundbg;
    const effectiveContainerBorder = isDark ? '#1E3A5F' : currentTheme().inputBorderColor;
    const effectiveItemTextColor = isDark ? '#FFFFFF' : currentTheme().textColor;
    const effectiveSearchTextColor = isDark ? '#FFFFFF' : currentTheme().textColor;
    const effectiveSearchBg = isDark ? '#061224' : currentTheme().inputbg;
    const effectiveSearchBorder = isDark ? '#1E3A5F' : currentTheme().inputBorderColor;
    const effectiveActiveColor = isDark ? 'rgba(226, 176, 72, 0.18)' : '#F1F5F9';

    return (
        <>
            {name ? (
                <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                    <Text
                        style={{
                            color: effectiveTitleColor,
                            fontWeight: '700',
                            fontSize: 13,
                        }}
                    >
                        {name}
                    </Text>
                </View>
            ) : null}

            <View
                style={[
                    {
                        width: width ? width : screenWidth - 40,
                        borderWidth: 1.5,
                        justifyContent: 'center',
                        borderColor: borderColor ? borderColor : (isDark ? '#1E3A5F' : currentTheme().inputBorderColor),
                        borderRadius: 12,
                        paddingHorizontal: 8,
                        backgroundColor: backgroundColor ? backgroundColor : (isDark ? '#061224' : currentTheme().inputbg),
                        alignSelf: 'center',
                    },
                ]}
            >
                {mandatary && (
                    <View
                        style={{
                            position: 'absolute',
                            backgroundColor: currentTheme().secondaryColor,
                            height: 50,
                            width: 5,
                            borderTopLeftRadius: 8,
                            borderBottomLeftRadius: 8,
                        }}
                    />
                )}

                <Dropdown
                    showsVerticalScrollIndicator={false}
                    containerStyle={{
                        marginTop: -2,
                        borderWidth: 1.5,
                        borderColor: effectiveContainerBorder,
                        backgroundColor: effectiveContainerBg,
                        borderRadius: 12,
                        overflow: 'hidden',
                    }}
                    itemContainerStyle={{ borderRadius: 8 }}
                    activeColor={effectiveActiveColor}
                    style={[styles.dropdown]}
                    itemTextStyle={[styles.textstyledropdown, { color: effectiveItemTextColor }]}
                    placeholderStyle={[
                        styles.placeholderStyle,
                        { color: effectivePlaceholderColor, fontSize: 14, fontWeight: '600' },
                    ]}
                    selectedTextStyle={[
                        styles.selectedTextStyle,
                        { color: effectiveSelectedTextColor, fontSize: 15, fontWeight: '800' },
                    ]}
                    iconStyle={[styles.iconStyle, { tintColor: effectiveIconColor }]}
                    data={list}
                    searchPlaceholder="Search here..."
                    searchPlaceholderTextColor={isDark ? '#94A3B8' : '#94A3B8'}
                    inputSearchStyle={{
                        color: effectiveSearchTextColor,
                        backgroundColor: effectiveSearchBg,
                        borderColor: effectiveSearchBorder,
                        borderRadius: 8,
                        height: 44,
                        fontSize: 14,
                        paddingHorizontal: 12,
                    }}
                    maxHeight={260}
                    labelField="label"
                    search={search}
                    disable={disable}
                    valueField="value"
                    placeholder={placeholder}
                    value={value == '' || value == null ? selectValue : value}
                    onChange={(item) => {
                        setSelectValue(item.value);
                        setName && setName(item.label);
                        setId && setId(item.value);
                        onPress && onPress(item.value, item.label);
                    }}
                />
                {error && <Text style={StyleConstants.errText}>{error}</Text>}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 8,
    },
    placeholderStyle: {
        paddingHorizontal: 5,
    },
    textstyledropdown: {
        paddingVertical: 2,
        fontSize: 15,
        fontWeight: '600',
    },
    selectedTextStyle: {
        textTransform: 'capitalize',
        paddingHorizontal: 5,
    },
    iconStyle: {
        width: 24,
        height: 24,
    },
});

export default DropDownCom;
