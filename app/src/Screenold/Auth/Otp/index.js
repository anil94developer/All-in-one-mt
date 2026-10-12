import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  BackHandler,
  ImageBackground,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './Styles';
import { images } from '../../../assets/images';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import TimeCounter from '../../../component/TimeCounter';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { screenHeight, screenWidth } from '../../../constants/Sizes.constant';
import LargefillBtn from '../../../component/Button/LargefillBtn';
import { postApiCall } from '../../../services/AppSetting';
import { currentTheme, useTheme } from '../../../constants/ThemeProvider';
import { lang } from '../../../Language/languge';
import { useFocusEffect } from '@react-navigation/native';
import { APPLICATION_USER, base } from '../../../constants/Data.constant';
import HomeSlider from '../../../component/Slider';
import { StyleConstants } from '../../../constants/Style.constant';

const CELL_COUNT = 4;

export default function Otp(props) {
  const { mobile, countryCode, screen } = props.route.params;
  const [value, setValue] = useState('');
  // const { theme, updateTheme } = useTheme()
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [otpProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const [fcmToken, setFcmToken] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([{
    image: "https://img.freepik.com/premium-vector/car-services-concept-illustration_108855-2505.jpg"
  },
  {
    image: "https://img.freepik.com/free-vector/car-wash-advertising-banner_1409-962.jpg?t=st=1692875301~exp=1692875901~hmac=014dd681d3198d594a4bf609a5600e09149077e8ab698e1e899e2dc7714c3193"
  },
  {
    image: "https://img.freepik.com/free-vector/gradient-car-a4-poster-with-photo-horizontal_23-2148979765.jpg?t=st=1692875557~exp=1692876157~hmac=0fb0f02dabe013b9049035aaf7cab92e7c0f9fdb42ade88e3ff7088c949541c0"
  },
  {
    image: "https://img.freepik.com/free-photo/beautiful-scenery-summit-mount-everest-covered-with-snow-white-clouds_181624-21317.jpg"
  },
  ])


  // const handler = () => {
  //   change == 'change' ? props.navigation.navigate('ForgotPassword') : props.navigation.navigate('ForgotPassword')
  // }
  // useFocusEffect(
  //   React.useCallback(() => {
  //     const backAction = () => {
  //       handler()
  //       return true;
  //     };

  //     const backHandler = BackHandler.addEventListener(
  //       'hardwareBackPress',
  //       backAction,
  //     );

  //     return () => backHandler.remove();
  //   }, [props]))
  // useEffect(() => {
  //   setMobileNumber(mobileNo)
  //   messaging().getToken().then((e) => setFcmToken(e));
  // }, [props])

  const otp_verifiy_method = async () => {
    try {
      setLoading(true);
      if (value == '' || value.length != 4) {
        Toast.show({ type: 'error', text1: 'Please enter OTP' });
      } else {

        let body = {
          country_code: countryCode,
          mobile_number: mobile,
          otp: value,
          type: APPLICATION_USER,
        };
        console.log(body);
        let result = await postApiCall(base.verifyOtp, body);
        console.log(result.data, '============otppppppp');

        if (result.status) {


          if (screen == 'forget') {
            props.navigation.navigate('ResetPassword', { screen: screen, mobile: mobile,countryCode:countryCode });
          }
          else {
            props.navigation.navigate("Login")
          }
          Toast.show({ type: 'success', text1: result.message });
          setLoading(false);

        } else {
          Toast.show({ type: 'error', text1: result.message });
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

   const resend_method = async () => {
    if (mobile == "") {
      Toast.show({ type: "error", text1: "Mobile number is required" })
    }
    // else if (!isValidMobile(mobileNumber)) {
    //   Toast.show({ type: "error", text1: "Please enter valid mobile number" })
    // }
    else {
      let body={
        country_code: countryCode,
        mobile_number: mobile,
        type:APPLICATION_USER
      }
      let result = await postApiCall(base.resendOtp, body);
      console.log(result,'==============resend==========')
      if(result.status){
        Toast.show({ type: "success", text1: result.message })
        // props.navigation.navigate("Otp",{mobileNo:mobileNumber})
      }else{
        Toast.show({ type: "error", text1: result.message })
      }
    }
  }

  // console.log(key,change);
  return (
    <ScrollView
    // behavior={'height'}
    // extraScrollHeight={1000}
    // extraHeight={500}
    // style={{flex:1}}
    // resetScrollToCoords={{ x: 0, y: 0 }}
    // contentContainerStyle={styles.container}
    // scrollEnabled={true}
    >
      <View
        style={[
          styles.container,
          { alignItems: 'center', height: screenHeight, backgroundColor: currentTheme().bgColor1 },
        ]}>
        {/* <ImageBackground source={images.blueBackground} style={[{ width: screenWidth, height: screenHeight / 3 }]}>
          <View style={[{ width: screenWidth, height: screenHeight / 3.8, marginTop: 20 }]}>
            <HomeSlider list={list} />
          </View>

        </ImageBackground> */}
          <View style={{alignSelf:'center',marginVertical:20}}>
            <Image source={images.logo} style={{height:133,width:60}}/>
        </View>

        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Text style={[styles.otpText, { color: currentTheme().black }]}>
            {lang('otp_screen.otp')}

          </Text>
        </View>
        <Text style={{fontSize:14,marginTop:10}}>Enter the OTP send to (+{countryCode}) {mobile.replace(/.(?=.{4,}$)/g, '*')} </Text>

        <View>
          <CodeField
            textInputStyle={{ alignItems: 'center' ,backgroundColor: currentTheme().bgColor,}}
            ref={ref}
            {...otpProps}
            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
        </View>
        {/* <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 10 }}>
          <Text style={{ color: currentTheme().black }}>
            {lang('otp_screen.receive_otp')}

          </Text>
          <Text style={{ color: currentTheme().themeColor, marginLeft: 1 }}>{lang('otp_screen.resend_otp')}
          </Text>
        </View> */}
        {/* <View style={{marginTop: 20}}> */}
        <LargefillBtn
          animating={loading}
          label={lang('otp_screen.verify_otp')}

          onPress={() => {
            otp_verifiy_method()
            // props.navigation.navigate('Login')
          }}
          width='82%'
          backgroundColor={currentTheme().themeColor}
        />
        {/* </View> */}

        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <Text style={{ color: currentTheme().textColor, fontSize: 16 }}>
            {lang('login_screen.dont_have_an_account')}

          </Text>
          <Text
            onPress={() => props.navigation.navigate('SignUp')}
            style={{
              color: currentTheme().themeColor,
              textDecorationLine: 'underline',
              fontSize: 16,
              marginLeft: 1
            }}>
            {lang('login_screen.sign_up')}

          </Text>
        </View> */}

        <View style={{ marginTop: screenWidth * (20 / 375), alignItems: "center" }}>
          <TimeCounter resetOtpState={() => resend_method()} startCounting count={60} />

        </View>
      </View>
    </ScrollView>
  );
}
