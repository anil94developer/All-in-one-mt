import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../Widget/Header';
import { currentTheme } from '../../constants/ThemeProvider';
import { StyleConstants } from '../../constants/Style.constant';
import icon from '../../constants/image';
import { icons, images } from '../../assets/images';
import { screenWidth } from '../../constants/Sizes.constant';
import { app_setting, get_profile } from '../../services/User';
// import RNUpiPayment from 'react-native-upi-payment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../component/loading';
import { postDataContent } from '../../services/Ops';
import { base } from '../../constants/Data.constant';
import Toast from "react-native-toast-message";

export default function AddFund(props) {

    const [loading, setLoading] = useState(true);
    const [userPhone, setUserPhone] = useState("");
    const [amount, setAmount] = useState("0");
    const [wallet, setWallet] = useState("");
    const [webViewUrl, setWebViewUrl] = useState("");
    const [amountModalVisible, setAmountModalVisible] = useState(false);
    const [disableBtn, setDisableBtn] = useState(false);
    const [appSetting, setAppSetting] = useState({})

    const _goBack = () => {
        props.navigation.goBack()
    }


    useEffect(() => {
        get_data()
    }, [props])

    const get_data = async () => {
        let userData = await get_profile();
        setWallet(userData.wallet)
        let appSetting=await app_setting()
        setAppSetting(appSetting)
        setAmount(appSetting.min_deposite)
        setLoading(false)
        //   alert(typeof appSetting.min_deposite)
        //  let min_amount=appSetting.min_deposite

    }


    const payNow = () => {
        console.log(amount,appSetting.min_deposite)
        // setDisableBtn(true)
        if (amount == 0 || amount == "" || amount == null || Number(amount) < Number(appSetting.min_deposite)) {
            Toast.show({ type: 'error', text2: 'Please enter minimum '+appSetting.min_deposite+' Rs.' })
        } else {
            floo(amount)
        }
    }
    const floo = async (amount) => {

        let txnRefId = 'Satta' + Math.floor(Math.random() * 1000) + 1; // Transection Ref ID
        let userPhone = await AsyncStorage.getItem("phone")
        // try {
        //     RNUpiPayment.initializePayment({
        //         vpa: appSetting.upi_phone,
        //         payeeName: appSetting.upi_name,
        //         amount: amount,
        //         transactionNote: userPhone,
        //         transactionRef: txnRefId,
        //     }, successCallback, failureCallback);
        // } catch (e) {
        //     console.log("errror---", e)
        // }
    }
    const failureCallback = (data) => {
        console.log('yes i am failure')
        setDisableBtn(false)
        if (data['Status'] == "Success") {
            addAmountSuccessFun(data)
        }
    }
    const successCallback = (data) => {
        console.log('yes i am success')
        setDisableBtn(false)
        if (data['Status'] == "SUCCESS") {
            addAmountSuccessFun(data)

        }
    }

    const addAmountSuccessFun = async (data) => {
        console.log(data)
        let phone_number = await AsyncStorage.getItem('phone');

        var body = new FormData();
        body.append("phone_number", phone_number);
        body.append("amount", amount)//phone_number);
        body.append("trans_detail", "Add Wallet Amount")//phone_number);
        body.append("image", "")//phone_number);

        let result = await postDataContent(base.addMoney, body);
        console.log(result)
        get_data()

    }

    return (
        <View style={{ flex: 1, backgroundColor: currentTheme().bgColor }}>
            <Header
                leftButtonType="back"
                title="Add Fund"
                leftButtonAction={_goBack}
                rightButttonType="refresh"
            />
            {loading && <Loading />}
            {/* <View style={[StyleConstants.cardView, { padding: 50, marginTop: 20, alignItems: 'center' }]}> */}
                {/* <Text style={{ color: currentTheme().textColor, fontSize: 18,fontWeight:'bold' }}>Total Balance</Text>
    
            <Text style={{ color: currentTheme().textColor, fontSize: 25,fontWeight:'bold' }}>$3450</Text> */}
                {global.accountStatus == "1" || accountStatus == "1" ?
        <View style={{ backgroundColor: currentTheme().themeColor, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginVertical: 30, padding: 20,  borderRadius: 20 }}>
          <View >
            <Text style={[styles.text, { color: currentTheme().White, fontSize: 40, fontWeight: '600' }]}> ₹ {wallet}</Text>
            <Text style={{ color: currentTheme().White, fontSize: 20 }}>Total Balance</Text>
          </View>
          <Image source={images.square} style={{ height: 73, width: 73 }} />

        </View>
        :
        <></>
      }
            {/* </View> */}

            <View style={[StyleConstants.cardView, { padding: 50, marginTop: 20, alignItems: 'center',    }]}>
                <Text style={[styles.inputLabel,{color:currentTheme().themeColor}]}>Add Money To Wallet</Text>
                <View style={{ marginTop: 30 }}>


                    <View style={[StyleConstants.Textinput, { flexDirection: 'row',  borderWidth: 1, height: 55, width: screenWidth - 40, paddingHorizontal: 20 }]}>
                        <Text style={styles.countryCode}>₹</Text>
                        <TextInput
                            style={{ flex: 10 }}
                            placeholder="Enter Amount"
                            color={currentTheme().textColor}
                            keyboardType="number-pad"
                            placeholderTextColor={currentTheme().placeholderColor}
                            onChangeText={(e) => setAmount(e)}
                            returnKeyType="send"
                            defaultValue={amount}
                            key={appSetting}
                        />
                        {amount !== "" &&
                            <TouchableOpacity onPress={() => setAmount('')} style={[styles.image, { tintColor: 'red', alignSelf: 'center' }]}>
                                <Image source={icons.close} style={[styles.image, { tintColor: currentTheme().errors, alignSelf: 'center' }]} />
                            </TouchableOpacity>
                        }
                    </View>

                    <View horizontal style={{ flexDirection: 'row', width: screenWidth - 20, marginTop: 30, height: 40 }}>
                        <TouchableOpacity style={styles.circleView} onPress={() => { setAmount('300') }}>
                            <Text style={{ color: '#000' }}>₹ 300</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.circleView} onPress={() => { setAmount('500') }}>
                            <Text style={{ color: '#000' }}>₹ 500</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.circleView} onPress={() => { setAmount('1000') }}>
                            <Text style={{ color: '#000' }}>₹ 1000</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.circleView} onPress={() => { setAmount('5000') }}>
                            <Text style={{ color: '#000' }}>₹ 5000</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        disabled={disableBtn || amount <= 0}
                        style={{
                            backgroundColor: amount > 0 ? currentTheme().themeColor : currentTheme().gary,
                            height: 50,
                            paddingHorizontal: 20,
                            justifyContent: "center",
                            marginTop: 20,
                            borderRadius: 5,
                            marginBottom: 5,
                            width: screenWidth - 50,
                            alignSelf: 'center'
                        }}
                        onPress={() => payNow()}
                    >
                        <Text style={{ textAlign: "center", color: currentTheme().antiTextColor }}>Proceed {amount > 0 && `to add ₹ `}{amount} </Text>
                    </TouchableOpacity>



                </View>
            </View>
        </View>

    );

}

const s = StyleConstants,

    styles = StyleSheet.create({
        cards: {
            flexDirection: 'row',
            justifyContent: 'space-between'

        },
        walletIcon: {
            height: 50,
            width: 50,
            tintColor: '#000',

        },
        text: {
            fontSize: 24,
            color: '#000'
        },
        circleView: {
            height: 30,
            width: screenWidth / 5,
            borderWidth: 2,
            borderRadius: 5,
            borderColor: '#000',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            marginLeft: 10
        },
        countryCode: {
            color: currentTheme().themeColor,
            fontWeight: 'bold',
            alignSelf: 'center',
            justifyContent: 'center',
            flex: 1,
            fontSize: 20

        },
        image: {
            height: 20,
            width: 20,
        },
        card: {
            backgroundColor: '#eee',
            padding: 16,
            borderRadius: 10,
        },
        maneView: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
        },
        ResdtView: {
            height: 40,
            width: 60,
            borderWidth: 2,
            borderRadius: 10,
            borderColor: '#000',
        },
        inputLabel: {
            color: '#000',
            fontSize: 20,  // set label font size 
            fontWeight: 'bold'
        },
        textitem: {
            color: '#fff',
            flexDirection: "row",
            fontSize: 12,
            width: screenWidth - 40,
            textAlign: "left",
            paddingBottom: 5,
        },
        referView: {
            flexDirection: 'row',
            marginVertical: 10,
            //backgroundColor: ColorsConstant.cards,
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 16,
            paddingHorizontal: 10
        },
    });