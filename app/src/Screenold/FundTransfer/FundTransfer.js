import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, ScrollView, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
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
import { Toast } from 'react-native-toast-message/lib/src/Toast';
export default function FundTransfer(props) {

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
      setWallet(userData.wallet)
      setSender(userData.phone)
    }
    get_data()
  }, [props])
 
  const fund_transfer=async()=>{
    let body={
      receiver:mobileNumber,
      sender:sender,
      amount:amount
    }
    let result = await postApiCall(base.fund_transfer, body)
    console.log("-----", JSON.stringify(result.data))
    if (result.data.success == "1") {
        Toast.show({ type: 'success', text1: 'Congratulations !', text2: result.data?.msg });
        setLoading(false);
         

    } else {
        setLoading(false);
        Toast.show({ type: 'error', text1: 'Something wrong', text2: result.data?.msg });
        // Vibration.vibrate(300);
    }
  }
  return (
    <View style={{ flex: 1, backgroundColor: currentTheme().bgColor }}>
      <Header
        leftButtonType="back"
        title="Fund Transfer"
        leftButtonAction={_goBack}
        rightButttonType="refresh"
      />
    <View  style={{backgroundColor:currentTheme().themeColor, height: 180, width: 350, alignSelf: 'center',  borderRadius: 21, }} resizeMode='contain'  >
       
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 25, marginVertical: 25 }}>
          <View>
            <Text style={{ color: currentTheme().White, fontSize: 40, fontWeight: '600' }}> ₹ {wallet}</Text>
            <Text style={{ color: currentTheme().White, fontSize: 20 }}>Total Balance</Text>
          </View>
          <Image source={images.square} style={{ height: 73, width: 73 }} />
        </View>
     </View>
      <View style={[StyleConstants.cardView, { padding: 50, marginTop: 20, alignItems: 'center' }]}>
        <Text style={styles.inputLabel}>Transfer Amount</Text>
        <View style={{ marginTop: 30 }}>


          <View style={[StyleConstants.Textinput, { flexDirection: 'row', borderWidth: 0, borderWidth: 1, height: 55, width: screenWidth - 40, paddingHorizontal: 20 }]}>
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
           
            <View style={{ width: screenWidth - 40, alignSelf: 'center'  }}>

            <LargeTextInput
              label={'Mobile No'}
              placeholder={'Enter Phone Number'}
              value={mobileNumber || ''}
              maxLength={10}
              keyboardType="numeric"
              onChangeText={(e) => {
                setMobileNumber(e) ;
              }} 

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
              width: screenWidth - 50,
              alignSelf: 'center'
            }}
            onPress={() => fund_transfer()}
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