import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, ScrollView, FlatList, Vibration, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../Widget/Header';
import { currentTheme } from '../../constants/ThemeProvider';
import { StyleConstants } from '../../constants/Style.constant';
import { icons } from '../../assets/images';
import { screenWidth } from '../../constants/Sizes.constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base } from '../../constants/Data.constant';
import { postDataContent } from '../../services/Ops';
import Toast from 'react-native-toast-message';
import DropDownCom from '../../component/DropDownCom';

export default function Withdraw(props) {

    const [userName, setUserName] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [amount, setAmount] = useState("50");
    const [wallet, setWallet] = useState("");
    const [webViewUrl, setWebViewUrl] = useState("");
    const [amountModalVisible, setAmountModalVisible] = useState(false);
    const [disableBtn, setDisableBtn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([])
    const [paymentmethodList, setPaymentmethodList]= useState([
        {"label":"PAYTM" ,value:"Paytm"},
        {"label":"PHONEPE" ,value:"Phonepe"},
        {"label":"GPAY" ,value:"Gpay"},

    ])
    const [paymentmethodId, setPaymentmethodId]= useState("")
    const [paymentmethodName, setPaymentmethodName]= useState("")
     
    const _goBack = () => {
        props.navigation.goBack()
    }


    useEffect(() => {

        get_data()
    }, [props])

    const get_data = async () => {

        let phone_number = await AsyncStorage.getItem("phone")

        var body = new FormData();
        body.append("phone_number", phone_number);
        let result = await postDataContent(base.getWithdrawRequest, body);
        console.log(result.result)
        setList(result.result)
    }



    const send_request_handler = async () => {
        if (amount === '') {
            Toast.show({ type: 'error', text1: 'Withdraw Error !', text2: 'Please fill amount' });
            // Vibration.vibrate(300);
        } else if (paymentmethodId === '') {
            Toast.show({ type: 'error', text1: 'Withdraw Error !', text2: 'Please select payment mode' });
            // Vibration.vibrate(300);
        } else  {

            setLoading(true);
            let phone_number = await AsyncStorage.getItem("phone")

            var body = new FormData();
            body.append("phone_number", phone_number);
            body.append("amount", amount);
            body.append("remark", paymentmethodId);
            body.append("payment_method", paymentmethodId);

            let result = await postDataContent(base.withdrawRequest, body)
            console.log(result)
            if (result.success == "1") {
                setLoading(false);
                Toast.show({ type: 'success', text1: result.msg, text2: result.msg });
                get_data()
            } else {
                setLoading(false);
                Toast.show({ type: 'error', text1: result.msg, text2: result.msg });
                // Vibration.vibrate(300);
            }
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: currentTheme().bgColor }}>
            <Header
                leftButtonType="back"
                title="Withdraw Fund"
                leftButtonAction={_goBack}
                rightButttonType="refresh"
            />

            <ImageBackground style={{ flex: 1 }}>

                <View style={[StyleConstants.cardView, { padding: 20, marginTop: 20, alignItems: 'center', backgroundColor: currentTheme().themeColor }]}>
                    <Text style={[styles.inputLabel, { color: '#fff' }]}>Withdraw Money To Wallet</Text>
                    <View style={{ marginTop: 30 }}>


                        <View style={[StyleConstants.Textinput, { flexDirection: 'row', borderWidth: 0, borderWidth: 1, height: 45, width: screenWidth - 40, paddingHorizontal: 20 }]}>
                            <Text style={styles.countryCode}>₹</Text>
                            <TextInput
                                style={{ flex: 10 }}
                                placeholder="Enter Amount"
                                color={currentTheme().textColor}
                                keyboardType="number-pad"
                                placeholderTextColor={currentTheme().placeholderColor}
                                onChangeText={(e) => setAmount(e)}
                                returnKeyType="send"
                                value={amount}
                            />
                            {amount !== "" &&
                                <TouchableOpacity onPress={() => setAmount('')} style={[styles.image, { tintColor: 'red', alignSelf: 'center' }]}>
                                    <Image source={icons.close} style={[styles.image, { tintColor: currentTheme().errors, alignSelf: 'center' }]} />
                                </TouchableOpacity>
                            }
                        </View>
                        <View  style={{marginTop:10}}>
                        <DropDownCom 
                                borderColor={"#E8C57A"}
                                    // width={150}
                                    name={""}
                                    placeholder={"Select Payment Method"}
                                    value={paymentmethodId}
                                    setName={setPaymentmethodName}
                                    setId={setPaymentmethodId}
                                    list={paymentmethodList}
                                    onPress={(e) => { setPaymentmethodId(e) }}
                                    bgType={"White"}
                                    id={paymentmethodId}
                                   
                                // key={digitId}
                                />
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
                                width: screenWidth - 80,
                                alignSelf: 'center'
                            }}
                            onPress={() => send_request_handler()}
                        >
                            <Text style={{ textAlign: "center", color: currentTheme().antiTextColor }}>Proceed {amount > 0 && `to withdraw ₹ `}{amount} </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <FlatList
                    data={list}
                    style={{ paddingVertical: 20, marginBottom: 30 }}
                    renderItem={({ item, index }) => (
                        <View style={[StyleConstants.cardView, { flexDirection: 'row', marginTop: 10, borderRadius: 10, width: screenWidth - 30 }]}>
                            <View style={{ flex: 2, padding: 10 }}>
                                <Text style={{ fontSize: 12, fontWeight: 'bold', color: item.status == 0 || item.status == "-1" ? currentTheme().errors : currentTheme().success }}>{item.status == 0 ? "Pending" : item.status == "-1" ? "Rejected" : "Received"} </Text>
                                <Text style={{ fontSize: 12, color: currentTheme().textColor }}>{item.date}</Text>

                            </View>
                            {/* <View style={{ flex: 1, padding: 10, justifyContent: 'center' }}>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: currentTheme().textColor, alignSelf: 'center' }}>{item.status}</Text>
                        </View> */}
                            <View style={{ flex: 2, backgroundColor: item.status == 0 || item.status == -1 ? currentTheme().errors : currentTheme().success, padding: 10, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 18, color: currentTheme().textColor, alignSelf: 'center' }}>Points</Text>
                                <Text style={{ fontSize: 18, color: currentTheme().textColor, alignSelf: 'center' }}> {item.points}</Text>

                            </View>
                        </View>
                    )
                    }
                    ListFooterComponent={(
                        <View style={{ height: 20 }}></View>
                    )}
                />
            </ImageBackground>
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
            borderRadius: 10,
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