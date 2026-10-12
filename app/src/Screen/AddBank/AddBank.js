import { StyleSheet, Text, TextInput, TouchableOpacity, View, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { Image } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import LinearGradient from 'react-native-linear-gradient'
import { screenHeight, screenWidth } from '../../constants/Sizes.constant'
import { currentTheme } from '../../constants/ThemeProvider'
import Header from '../../Widget/Header'
import { StyleConstants } from '../../constants/Style.constant'
import { icons, images } from '../../assets/images'
import { Dialog } from '../../context/DialogContext';
import { base } from '../../constants/Data.constant'
import { postDataContent } from '../../services/Ops'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LargeTextInput from '../../component/TextInput/LargeTextInput'
import Loading from '../../component/loading'
import { useLanguage } from '../../context/LanguageContext';

export default function AddBank(props) {
    const insets = useSafeAreaInsets();
    const { strings } = useLanguage();
    const [accountHolderName, setAccountHolderName] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [accountConfirmNumber, setAccountConfirmNumber] = useState("")
    const [ifscCode, setIfscCode] = useState("")
    const [bank, setBank] = useState("")
    const [address, setAddress] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetch_bank_details = async () => {
            let phone_number = await AsyncStorage.getItem("phone")
            var body = new FormData();
            body.append("phone_number", phone_number);

            let result = await postDataContent(base.getProfile, body);
            console.log("profile=======>>>>>>>",result)
            if (result.success == "1") {
                setAccountHolderName(result.data.account_holder_name)
                setAccountNumber(result.data.account_number)
                setAccountConfirmNumber(result.data.account_number)
                setIfscCode(result.data.ifsc_code)
                setBank(result.data.bank_name)
                setAddress(result.data.branch_name)
            } else {
                Dialog.show({ type: 'error', text1: 'Error !', text2: result.msg });
            }
        }
        fetch_bank_details()
    }, [])
    const _goBack = () => {
        props.navigation.navigate("Drawers", { screen: "Home" })
    }

    const submit_bank = async () => {
       
        if (accountHolderName == "" || accountNumber == "" || ifscCode == "" || bank == "" || address == "") {
            Dialog.show({ type: 'error', text1: 'Error !', text2: 'Please fill all fileds' });
        } else if (accountNumber != accountConfirmNumber) {
            Dialog.show({ type: 'error', text1: 'Error !', text2: 'Please check account number' });
        } else {
             setLoading(true)
            let phone_number = await AsyncStorage.getItem("phone")
            var body = new FormData();
            body.append("phone", phone_number);
            body.append("account_holder_name", accountHolderName);
            body.append("account_number", accountNumber);
            body.append("ifsc_code", ifscCode);
            body.append("bank_name", bank);
            body.append("branch_name", address);

            let result = await postDataContent(base.bankUpdate, body);
            setLoading(false)

            if (result.success == "1") {
                Dialog.show({ type: 'success', text1: 'Success!', text2: result.msg });
            } else {
                Dialog.show({ type: 'error', text1: 'Error !', text2: result.msg });
            }

            console.log(result)
        }
    }
    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#061224' }}>
            <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

            <Header
                leftButtonType="back"
                title={strings.add_bank_title || "Add Bank"}
                leftButtonAction={_goBack}
            />

            <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 + insets.bottom }}
                    showsVerticalScrollIndicator={false}
                >
                {/* <Text style={StyleConstants.label}>Account Holder Name</Text> */}
                <View style={styles.textInput}>
                    <Image source={icons.userIcon} style={styles.icon} />
                    <LargeTextInput

                        style={{ flex: 10 }}
                        placeholder={strings.enter_account_holder || "Enter Account Holder Name"}
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
                        placeholder={strings.enter_account_number || "Enter Account Number"}
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
                        placeholder={strings.enter_confirm_account || "Enter Confirm Account Number"}
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
                        placeholder={strings.enter_ifsc || "Enter IFSC Code"}
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
                        placeholder={strings.enter_bank_name || "Enter Bank Name"}
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
                        placeholder={strings.enter_branch_address || "Enter Branch Name"}
                        color={currentTheme().textColor}
                        // keyboardType="number-pad"
                        placeholderTextColor={currentTheme().placeholderColor}
                        onChangeText={(e) => setAddress(e)}
                        returnKeyType="send"
                        value={address}
                    />

                </View>
                {loading ? (
                    <Loading />
                ) : (
                    <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.submitBtnContainer}
                        onPress={() => submit_bank()}
                    >
                        <LinearGradient
                            colors={['#E2B048', '#C6922A', '#A27018']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.submitBtnGradient}
                        >
                            <Text style={styles.submitBtnText}>
                                {strings.submit || "Submit"}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    icon: {
        height: 20, width: 20, alignSelf: 'center', right: 10, tintColor: '#E2B048'
    },
    textInput: {
        flexDirection: 'row',
        width: screenWidth - 40,
        paddingHorizontal: 16,
        borderColor: '#E2E8F0',
        marginBottom: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1.2,
    },
    submitBtnContainer: {
        width: screenWidth - 40,
        borderRadius: 14,
        overflow: 'hidden',
        marginTop: 20,
        alignSelf: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    submitBtnGradient: {
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitBtnText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#061224',
        letterSpacing: 0.5,
    },
});