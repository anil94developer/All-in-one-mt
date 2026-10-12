import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { Image } from 'react-native'
import { screenHeight, screenWidth } from '../../constants/Sizes.constant'
import { currentTheme } from '../../constants/ThemeProvider'
import Header from '../../Widget/Header'
import { StyleConstants } from '../../constants/Style.constant'
import { icons, images } from '../../assets/images'
import Toast from 'react-native-toast-message';
import { base } from '../../constants/Data.constant'
import { postDataContent } from '../../services/Ops'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LargeTextInput from '../../component/TextInput/LargeTextInput'
import Loading from '../../component/loading'

export default function AddBank(props) {
    const [accountHolderName, setAccountHolderName] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [accountConfirmNumber, setAccountConfirmNumber] = useState("")
    const [ifscCode, setIfscCode] = useState("")
    const [bank, setBank] = useState("")
    const [address, setAddress] = useState("")
    const [loading, setLoading] = useState(false)

    const _goBack = () => {
        props.navigation.navigate("Drawers", { screen: "Home" })
    }

    const submit_bank = async () => {
       
        if (accountHolderName == "" || accountNumber == "" || ifscCode == "" || bank == "" || address == "") {
            Toast.show({ type: 'error', text1: 'Error !', text2: 'Please fill all fileds' });
        } else if (accountNumber != accountConfirmNumber) {
            Toast.show({ type: 'error', text1: 'Error !', text2: 'Please check account number' });
        } else {
             setLoading(true)
            let phone_number = await AsyncStorage.getItem("phone")
            var body = new FormData();
            body.append("phone_number", phone_number);
            body.append("name", accountHolderName);
            body.append("number", accountNumber);
            body.append("ifscCode", ifscCode);
            body.append("bank", bank);
            body.append("address", address);

            let result = await postDataContent(base.bankUpdate, body);
            setLoading(false)

            if (result.success == "1") {
                Toast.show({ type: 'success', text1: 'Success!', text2: result.msg });
            } else {
                Toast.show({ type: 'error', text1: 'Error !', text2: result.msg });
            }

            console.log(result)
        }
    }
    return (
        <ScrollView style={{ backgroundColor: currentTheme().themeColor }}>

            <Header
                leftButtonType="back"
                title="Add Bank"
                leftButtonAction={_goBack}
                rightButttonType="refresh"
            />
            <View style={{ flex: 1, padding: 20, borderTopStartRadius: 30, borderTopEndRadius: 30, backgroundColor: currentTheme().bgColor, height: screenHeight }}>
                {/* <Text style={StyleConstants.label}>Account Holder Name</Text> */}
                <View style={styles.textInput}>
                    <Image source={icons.userIcon} style={styles.icon} />
                    <LargeTextInput

                        style={{ flex: 10 }}
                        placeholder="Enter Account Holder Name"
                        color={currentTheme().textColor}
                        // keyboardType="number-pad"
                        placeholderTextColor={currentTheme().placeholderColor}
                        onChangeText={(e) => setAccountHolderName(e)}
                        returnKeyType="send"
                        value={accountHolderName}
                    />

                </View>
                {/* <Text style={StyleConstants.label}>Account Number</Text> */}

                <View style={styles.textInput}>
                    <Image source={icons.IdeaSharing} style={styles.icon} />
                    <LargeTextInput
                        style={{ flex: 10 }}
                        placeholder="Enter Account Number"
                        color={currentTheme().textColor}
                        keyboardType="number-pad"
                        placeholderTextColor={currentTheme().placeholderColor}
                        onChangeText={(e) => setAccountNumber(e)}
                        returnKeyType="send"
                        value={accountNumber}
                    />

                </View>
                {/* <Text style={StyleConstants.label}>Confirm Account Number</Text> */}

                <View style={styles.textInput}>
                    <Image source={icons.building} style={styles.icon} />
                    <LargeTextInput
                        style={{ flex: 10 }}
                        placeholder="Enter Confirm Account Number"
                        color={currentTheme().textColor}
                        keyboardType="number-pad"
                        placeholderTextColor={currentTheme().placeholderColor}
                        onChangeText={(e) => setAccountConfirmNumber(e)}
                        returnKeyType="send"
                        value={accountConfirmNumber}
                    />

                </View>
                {/* <Text style={StyleConstants.label}>IFSC Code</Text> */}

                <View style={styles.textInput}>
                    <Image source={icons.building} style={styles.icon} />
                    <LargeTextInput
                        style={{ flex: 10 }}
                        placeholder="Enter IFSC Code"
                        color={currentTheme().textColor}
                        // keyboardType="number-pad"
                        placeholderTextColor={currentTheme().placeholderColor}
                        onChangeText={(e) => setIfscCode(e)}
                        returnKeyType="send"
                        value={ifscCode}
                    />

                </View>
                {/* <Text style={StyleConstants.label}>Bank Name</Text> */}

                <View style={styles.textInput}>
                    <Image source={icons.bank} style={styles.icon} />
                    <LargeTextInput
                        style={{ flex: 10 }}
                        placeholder="Enter Bank Name"
                        color={currentTheme().textColor}
                        // keyboardType="number-pad"
                        placeholderTextColor={currentTheme().placeholderColor}
                        onChangeText={(e) => setBank(e)}
                        returnKeyType="send"
                        value={bank}
                    />

                </View>
                {/* <Text style={StyleConstants.label}>Branch Address</Text> */}

                <View style={styles.textInput}>
                    <Image source={images.privacy} style={styles.icon} />
                    <LargeTextInput
                        style={{ flex: 10 }}
                        placeholder="Enter Address"
                        color={currentTheme().textColor}
                        // keyboardType="number-pad"
                        placeholderTextColor={currentTheme().placeholderColor}
                        onChangeText={(e) => setAddress(e)}
                        returnKeyType="send"
                        value={address}
                    />

                </View>
                {loading ? <Loading /> :
                    <TouchableOpacity

                        style={{
                            backgroundColor: currentTheme().themeColor,
                            height: 50,
                            paddingHorizontal: 20,
                            justifyContent: "center",
                            marginTop: 20,
                            borderRadius: 5,
                            marginBottom: 5,
                            width: screenWidth - 40,
                            alignSelf: 'center'
                        }}
                        onPress={() => submit_bank()}
                    >
                        <Text style={{ textAlign: "center", color: currentTheme().antiTextColor }}>Submit</Text>
                    </TouchableOpacity>
                }

            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    icon: {
        height: 20, width: 20, alignSelf: 'center', right: 10, tintColor: currentTheme().themeColor
    },
    textInput: {
        flexDirection: 'row',
        // borderWidth: 2,
        //   height: 45,
        width: screenWidth - 40,
        paddingHorizontal: 20,
        borderColor: currentTheme().inputBorderColor,
        // marginTop:20,
        // padding: 5
    }
})