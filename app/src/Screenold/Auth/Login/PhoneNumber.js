/* eslint-disable keyword-spacing */
/* eslint-disable semi */
/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState, useContext } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  Platform,
  TextInput,
  TouchableOpacity,
  BackHandler,
  Alert,
  Vibration,
} from 'react-native'; 
// import uuid from "react-native-uuid";
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountryModal from '../../../component/CountryandMobile/CountryModal';
 
import { base, mainUrl } from '../../../constants/Data.constant'; 
import { screenHeight, screenWidth } from '../../../constants/Sizes.constant';  
import Loading from '../../../component/loading';
import LargefillBtn from '../../../component/Button/LargefillBtn'; 
//::::::::::::::::::::::::::::::::::::::: import services 
  
import { postApiCall } from '../../../services/AppSetting';
import { currentTheme, useTheme } from '../../../constants/ThemeProvider';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';   

import { images } from '../../../assets/images';
import { lang } from '../../../Language/languge';
const CELL_COUNT = 4;

function PhoneNumber(props) {
  const { screen } = props.route.params;

  const [mobile, setMobile] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
   
  const [country, setCountry] = useState('971');
  const [countryCode, setCountryCode] = useState('AE');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const backAction = () => {
      _goBack()
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [props]);


  const send_otp = async () => {
    if (mobile == '') {
      Toast.show({ type: 'error', text1: 'Error!', text2: 'Please enter phone number' });
      // Vibration.vibrate(300);
    } else {
      try {
        setLoading(true);
        let body = {
          country_code: country,
          mobile_number: mobile,
          type: 'Customer',
        };
        let url = ''
        if(screen == 'signup'){
           url = base.signUp
        }else if(screen == 'forgot'){
          url = base.forgetPassword
        }
        let result = await postApiCall(url, body);
        if (result.status) {
          setLoading(false);
          Toast.show({ type: 'success', text1: 'OTP Send Successful !', text2: result.message });

          props.navigation.navigate('Otp', {
            mobile: mobile,
            countryCode: country,
            screen: screen,
          });
        } else {
          setLoading(false);
          Toast.show({ type: 'error', text1: 'Login Error !', text2: result.message });
          // Vibration.vibrate(300);
        }
      } catch (e) {
        Toast.show({ type: 'error', text1: 'Network Issue !', text2: 'Please check your internet connection' });
        setLoading(false);
        // Vibration.vibrate(300);
      }
      finally {
        setLoading(false);
      }
    }
  };




  const _goBack = () => {
 
      props.navigation.navigate('Login');
  };
  const onSelect = country => {
    console.log('country-=-=-', country.callingCode[0]);
    setCountryCode(country.cca2);
    setCountry(country.callingCode[0]);
  };

  return (
    <ScrollView style={styles.container} >
      <View style={styles.container} showsVerticalScrollIndicator={false}>

        <Image
          source={images.logo}
          style={{ height: screenHeight / 5, width: screenWidth, resizeMode: 'cover' }}
        />

        <Text
          style={{
            color: currentTheme().black,
            fontSize: 28,
            fontWeight: '700',
            marginTop: 30,
            // textAlign: 'center',
            marginHorizontal: 10,
          }}>
          {screen == 'changepassword' ?
            lang('change_password.changePassword') :
            screen == 'signup' ?
              'Register Account' :
              lang('login_screen.forgot_password')
          }
        </Text>
        <View style={{ height: 3, backgroundColor: currentTheme().primaryColor, width: 130, marginHorizontal: 10 }} />

        <View style={{ marginHorizontal: 10 }}>
          <CountryModal
            value={mobile}
            validationType={'mobile'}
            visible={visible}
            setVisible={setVisible}
            onSelect={onSelect}
            label={lang('login_screen.mobile_number')}
            keyboardType={'numeric'}
            countryCode={countryCode}
            country={country}
            placeholder={lang('login_screen.mobile_number')}
            maxLength={12}
            onChangeText={e => setMobile(e)}
          />
        </View>
        <View style={{ marginTop: screenWidth * (24 / 375) }}>
          <LargefillBtn
            animating={loading}
            label={lang('forgot_password.send_otp')}
            onPress={() => {
              send_otp();
            }}
            backgroundColor={currentTheme().themeColor}
          />

        </View>
        

        {screen == 'forgot' ? (
          <View />
        ) : (
          <View
            style={{
              flexDirection: 'row',
              marginTop: 30,
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <Text style={{ color: currentTheme().black }}>
              {lang('login_screen.dont_have_an_account')}?
            </Text>
            <Text
              onPress={() => props.navigation.navigate('Login')}
              style={{
                color: currentTheme().themeColor,
                textDecorationLine: 'underline',
                marginLeft: 1,
              }}>
              {lang('login_screen.login')}
            </Text>
          </View>
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height:screenHeight,
    backgroundColor: currentTheme().bgColor,
  },


  codeFieldRoot: { marginTop: screenWidth * (50 / 375), alignItems: 'center' },
  cell: {
    paddingVertical: screenWidth * (10 / 375),
    width: screenWidth * (60 / screenWidth),
    height: screenHeight * (50 / screenHeight),
    margin: screenWidth * (5 / 375),
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: currentTheme().themeColor,
    borderRadius: 5,
    color: currentTheme().White,
    // fontFamily: fontFamily.robotoBold,
    borderWidth: 1,
    borderColor: currentTheme().inputBorderColor,
  },
  focusCell: {
    borderColor: '#000',
  },
  resendOtp: {
    color: '#98DBFF',
    fontSize: 18,
    // fontFamily: fontFamily.robotoRegular,
    textDecorationLine: 'underline',
  },
  timerText: {
    // fontFamily: fontFamily.robotoRegular,
    fontSize: 22,
    color: currentTheme().White,
    marginTop: screenWidth * (22 / 375),
  },
});


export default PhoneNumber;
