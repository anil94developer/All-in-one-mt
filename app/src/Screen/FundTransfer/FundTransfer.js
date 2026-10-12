import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, ScrollView, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, StatusBar } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../Widget/Header';
import { currentTheme } from '../../constants/ThemeProvider';
import { StyleConstants } from '../../constants/Style.constant';
import icon from '../../constants/image';
import { icons, images } from '../../assets/images';
import { screenWidth } from '../../constants/Sizes.constant';
import { get_profile } from '../../services/User'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lang } from '../../Language/languge';
import CountryModal from '../../component/CountryandMobile/CountryModal';
import LargeTextInput from '../../component/TextInput/LargeTextInput';
import { postData } from '../../services/Ops';
import { postApiCall } from '../../services/AppSetting';
import { base } from '../../constants/Data.constant';
import { Dialog } from '../../context/DialogContext';
import { useLanguage } from '../../context/LanguageContext';

export default function FundTransfer(props) {
  const insets = useSafeAreaInsets();
  const { strings } = useLanguage();
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [amount, setAmount] = useState("50");
  const [wallet, setWallet] = useState("");
  const [webViewUrl, setWebViewUrl] = useState("");
  const [amountModalVisible, setAmountModalVisible] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [country, setCountry] = useState('91');
  const [countryCode, setCountryCode] = useState('IN');
  const [sender, setSender] = useState(false);
  const [loading, setLoading] = useState(false);

  const _goBack = () => {
    props.navigation.goBack()
  }


  useEffect(() => {
    const get_data = async () => {
      let userData = await get_profile();
      setWallet(userData?.wallet ?? 0)
      setSender(userData.phone)
    }
    get_data()
  }, [props])

  const fund_transfer = async () => {
    Keyboard.dismiss();
    if (mobileNumber == "") {
      Dialog.show({ type: 'error', text1: 'Enter mobile number !' });
    } else if (amount == "") {
      Dialog.show({ type: 'error', text1: 'Enter amount !' });
    } else {
      let body = {
        receiver: mobileNumber,
        sender: sender,
        amount: amount
      }
       console.log("-----", JSON.stringify(body))
      let result = await postApiCall(base.fund_transfer, body)
     
      if (result.data.success == "1") {
        Dialog.show({ type: 'success', text1: 'Congratulations !', text2: result.data?.msg });
        setLoading(false);


      } else {
        setLoading(false);
        Dialog.show({ type: 'error', text1: 'Something wrong', text2: result.data?.msg });
        // Vibration.vibrate(300);
      }
    }
  }
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#061224' }}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />
      <Header
        leftButtonType="back"
        title={strings.fund_transfer_title || "Fund Transfer"}
        leftButtonAction={_goBack}
        rightButttonType="refresh"
      />
      <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 + insets.bottom }}
          >
            <View style={[StyleConstants.cardView, { padding: 30, marginTop: 10, alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 20 }]}>
              <Text style={styles.inputLabel}>{strings.transfer_amount || "Transfer Amount"}</Text>
              <View style={{ marginTop: 20 }}>
                <View style={[StyleConstants.Textinput, { flexDirection: 'row', borderWidth: 1, height: 55, width: screenWidth - 60, paddingHorizontal: 16, borderRadius: 14, borderColor: '#CBD5E1' }]}>
                  <Text style={styles.countryCode}>₹</Text>
                  <TextInput
                    style={{ flex: 10, fontSize: 16, color: '#0F172A' }}
                    placeholder={strings.enter_transfer_amount || "Enter Amount"}
                    color="#0F172A"
                    keyboardType="number-pad"
                    placeholderTextColor="#94A3B8"
                    onChangeText={(e) => setAmount(e)}
                    returnKeyType="send"
                    value={amount}
                  />
                  {amount !== "" && (
                    <TouchableOpacity onPress={() => setAmount('')} style={[styles.image, { alignSelf: 'center' }]}>
                      <Image source={icons.close} style={[styles.image, { tintColor: '#EF4444', alignSelf: 'center' }]} />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={{ width: screenWidth - 60, alignSelf: 'center', marginTop: 14 }}>
                  <LargeTextInput
                    label={strings.mobile_number || 'Mobile No'}
                    placeholder={strings.phone_placeholder || 'Enter Phone Number'}
                    value={mobileNumber || ''}
                    maxLength={10}
                    keyboardType="numeric"
                    onChangeText={(e) => {
                      setMobileNumber(e);
                    }}
                  />
                </View>

                <TouchableOpacity
                  disabled={disableBtn || Number(amount) <= 0}
                  activeOpacity={0.85}
                  style={{
                    width: screenWidth - 60,
                    borderRadius: 14,
                    overflow: 'hidden',
                    marginTop: 24,
                    alignSelf: 'center',
                    elevation: 4,
                  }}
                  onPress={() => fund_transfer()}
                >
                  <LinearGradient
                    colors={Number(amount) > 0 ? ['#E2B048', '#C6922A', '#A27018'] : ['#94A3B8', '#64748B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ height: 52, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: '900', color: Number(amount) > 0 ? '#061224' : '#FFFFFF', letterSpacing: 0.3 }}>
                      Proceed {Number(amount) > 0 && `to transfer ₹`}{amount}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
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