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
    KeyboardAvoidingView, TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    Button,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

// ::::::::::::::::::::::::::::::::: import constants
import { fontFamily } from "../../constants/font";
import { StyleConstants } from "../../constants/Style.constant";
import { ColorsConstant } from "../../constants/Colors.constant";

// ::::::::::::::::::::::::::::::::: import icons
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";


function MultiSelectDropDown(props) {
    const {
        name,
        placeholder,
        list,
        error,
        selectedItems,
        setSelectedItems,
        onPress,
        commaSeprate
    } = props;
    console.log("selectedItems", selectedItems)

    const onclicklike = (index) => {
        let teamData = [...list]
        teamData[index].isSelcd = !teamData[index].isSelcd

        let dataArr = []
        teamData.map((item, index) => {
            if (item.isSelcd) {
                dataArr.push(item.id)
            }
        })
        onPress(dataArr)
        console.log(dataArr)
        setSelectedItems(dataArr)
    }
    useEffect(() => {
        const getSelectData = () => {
            var slectItem = selectedItems;
            console.log("slectItem------", slectItem, list)
            if (slectItem.length > 0) {
                list.map((item, index) => {
                    let val = item.id;
                    if (slectItem.search(val) > 0) {
                        onclicklike(index)
                    }
                })
            }
        }
        getSelectData()
    }, [])

    const [isVisable, setIsVisable] = useState(false)

    const _render_item = (data) => {
        return data.map((item, index) => {

            return (
                <TouchableOpacity
                    key={index}
                    onPress={() => {
                        onclicklike(index)

                    }}
                    style={{
                        backgroundColor: item.isSelcd ? ColorsConstant.themeColor : ColorsConstant.gary,
                        // borderBottomWidth: 1,
                        // borderBottomColor: ColorsConstant.White,
                        marginVertical: 1
                    }}
                >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10 }}>
                        <Text style={{ color: item.isSelcd ? ColorsConstant.White : ColorsConstant.Black, padding: 10, }}>{item.name}</Text>
                        {item.isSelcd && (
                            <AntDesign
                                name="checkcircle"
                                size={15}
                                // color={
                                //     mmId == item.MM_Id
                                //     ? ColorsConstant.White
                                //     : ColorsConstant.themeColor
                                // }
                                // backgroundColor={ColorsConstant.White}
                                style={{
                                    paddingLeft: 10,
                                }}
                            />
                        )}
                    </View>
                </TouchableOpacity>
            );

        });
    };

    return (
        <>
            <View style={[styles.dropdownContainer, { marginVertical: 5 }]}>
                <TouchableOpacity onPress={() => {
                    setIsVisable(!isVisable)
                }}
                    // style={[styles.cardContainer, {
                    //     borderWidth: 2,
                    //     borderColor: ColorsConstant.Black,
                    //     height
                    // }]}
                    style={[styles.dropdown, {
                        borderColor: ColorsConstant.themeColor,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }]}
                >
                    <Text style={{ color: ColorsConstant.Black }}>{placeholder}</Text>
                    <Entypo
                        name="chevron-small-down"
                        size={15}
                        color={ColorsConstant.Black}

                    />
                </TouchableOpacity>
                {isVisable &&
                    <ScrollView style={{}}>{_render_item(list)}</ScrollView>
                }
                {error && <Text style={StyleConstants.errText}>{error}</Text>}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    dropdown: {
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 8,
        borderColor: ColorsConstant.themeColor,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        color: ColorsConstant.gary,
        paddingHorizontal: 5,
    },
    textstyledropdown: {
        color: ColorsConstant.Black,
        marginVertical: -18,
    },
    selectedTextStyle: {
        color: ColorsConstant.Black,
        textTransform: "capitalize",
        paddingHorizontal: 5,
    },
    cardContainer: {
        // flex: 1,
        marginHorizontal: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: ColorsConstant.themeColor,
        backgroundColor: ColorsConstant.secondaryColor,
        // backgroundColor: "#9ED2C6",
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: 'space-between',
        padding: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0,
        shadowRadius: 4.65,
        elevation: 8,
    },

});

export default MultiSelectDropDown;
