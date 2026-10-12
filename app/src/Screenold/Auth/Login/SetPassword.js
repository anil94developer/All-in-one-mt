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
import CheckBox from '@react-native-community/checkbox';
// import uuid from "react-native-uuid";
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { screenHeight, screenWidth } from '../../../constants/Sizes.constant'; 
import LargefillBtn from '../../../component/Button/LargefillBtn';
import PasswordTextInput from '../../../component/TextInput/PasswordTextInput'; 
import { images } from '../../../assets/images';  
import { currentTheme, useTheme } from '../../../constants/ThemeProvider';
import { lang } from '../../../Language/languge';
import Header from '../../../Widget/Header'; 
import { base } from '../../../constants/Data.constant';
import { postDataContent } from '../../../services/Ops';

function SetPassword(props) {
  const { screen  } = props.route.params;

  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const { theme, updateTheme } = useTheme();

  useEffect(() => {
    const backAction = () => {
      props.navigation.navigate('Drawers', { screen: "Profile" })
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [props]);





  const set_password = async () => {
    // 
    try {
      let phone_number= await AsyncStorage.getItem("phone")
     
      if (oldPassword == '') {
        // Vibration.vibrate(300);
        Toast.show({ type: 'error', text1: "Error!", text2: 'Old Password is required' });
      } else if (password == '') {
        // Vibration.vibrate(300);
        Toast.show({ type: 'error', text1: "Error!", text2: 'Password is required' });
      } else if (password.length<6) {
        // Vibration.vibrate(300);
        Toast.show({ type: 'error', text1: "Error!", text2: 'Password is required min length is 6.' });
      }

       else if (confirmPassword == '') {
        // Vibration.vibrate(300);
        Toast.show({ type: 'error', text1: "Error!", text2: 'Confirm Password is required' });
      } else if (password != confirmPassword) {
        // Vibration.vibrate(300);
        Toast.show({ type: 'error', text1: "Error!", text2: 'Password miss match' });
      } else {
        setLoading(true);
     
        var body = new FormData();
        body.append("phone_number", phone_number);
        body.append("old_password",oldPassword);
        body.append("new_password",password);
        console.log(body)
        let result = await postDataContent(base.changePassword, body);

        if (result.success == "1") {
          Toast.show({ type: 'success', text1: "Password Changed !", text2: result.msg });
          setLoading(false);
          
        } else {
          // Vibration.vibrate(300);
          Toast.show({ type: 'error', text1: result.msg });
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      // Vibration.vibrate(300);

    } finally {
      setLoading(false); 
    }
  };

   const _goBack = () => {
      props.navigation.navigate('Drawers', {screen: 'Profile'});
  };
  return (
    <View style={styles.container}>
      {/* {loading && <Loading />} */}

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <Header
          leftButtonType="back"
          title={'Password Change'}
          leftButtonAction={_goBack}
        />  
        <Image
          source={images.logo}
          style={{ height: 150, borderRadius:200,width: 150, resizeMode: 'cover' ,alignSelf:'center',margin:20}}
        />
        <View style={{ marginTop: 20, marginHorizontal: 20 }}>
          {/* <Image
            source={images.logoHeader}
            style={{height: 117, width: 112, resizeMode: 'contain'}}
          /> */}
          {screen == 'changepassword' ? (
            <Text
              style={{
                color: currentTheme().black,
                fontSize: 28,
                fontWeight: '700',
                marginTop: 30,
              }}>
              Change Password
            </Text>
          ) : (
            <Text
              style={{
                color: currentTheme().black,
                fontSize: 22,
                fontWeight: '500',
                marginTop: 30,
                // textAlign: 'center',
              }}>
              {lang('set_password.set_pass')}
            </Text>
          )}

        </View>
        <View style={{ height: 3, backgroundColor: currentTheme().primaryColor, width: 130, marginHorizontal: 20 }}></View>

        <View style={{ marginTop: 25 }}>
        <View>
            <PasswordTextInput
              label={'Old Password'}
              placeholder={'Enter Old Password'}
        
              value={oldPassword}
              keyboardType="default"
              onChangeText={e => {
                setOldPassword(e);
              }}
              error=""
            // onBlur={()=>{
            //   if(password != confirmPassword){
            //     alert("errr")
            //   }
            // }}
            />
          </View>
          <View>
            <PasswordTextInput
              label={'New Password'}
              placeholder={'Enter New Password'}
              
              value={password}
              keyboardType="default"
              onChangeText={e => {
                setPassword(e);
              }}
              error=""
            // onBlur={()=>{
            //   if(password != confirmPassword){
            //     alert("errr")
            //   }
            // }}
            />
          </View>
          <PasswordTextInput
             label={'Confirm Password'}
             placeholder={'Enter Confirm Password'}
             
            value={confirmPassword}
            keyboardType="default"
            onChangeText={e => {
              setConfirmPassword(e);
            }}
            error=""
          // onBlur={()=>{
          //   if(password != confirmPassword){
          //     alert("errr")
          //   }
          // }}
          />

          <View style={{ marginTop: screenWidth * (14 / 375), alignItems: 'center' }}>
            <LargefillBtn
              width={screenWidth - 20}
              animating={loading}
              label={'Submit'}
              onPress={() => {
                set_password();
                //props.navigation.navigate('Login');
              }}
              backgroundColor={currentTheme().themeColor}
            />
          </View>
          {/* {screen == 'changepassword' ? (
            <View></View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                alignSelf: 'center',
              }}>
              {/* <Text style={{color: currentTheme().black}}>
                {lang('login_screen.dont_have_an_account')}?
              </Text> */}
          {/* <Text
              onPress={()=>props.navigation.navigate('Login')}
                style={{
                  color: currentTheme().themeColor,
                  textDecorationLine: 'underline',
                  marginLeft: 1,
                }}>
                {lang('login_screen.login')}
              </Text> */}
          {/* </View> */}
          {/* )} */}
        </View>
      </ScrollView>
    </View>
  );
}
export default SetPassword;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    backgroundColor: currentTheme().bgColor,
  },
  outerContainer: {
    flex: 9,
    width: '100%',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputView: {
    paddingStart: 20,
    backgroundColor: currentTheme().White,
    width: screenWidth * (335 / 375),
    borderRadius: 20,
    flexDirection: 'row',
  },
  // logo: { backgroundColor: "red" },
  logo: { width: screenWidth, height: screenHeight * (150 / screenHeight) },
  loginText: {
    fontSize: 30,
    alignSelf: 'center',
    color: currentTheme().black,
    // marginBottom: screenWidth * (20 / 375),
    // fontFamily: fontFamily.robotoBold,
    fontWeight: 'bold',
  },
  mobileNumber: {
    color: currentTheme().White,
    fontSize: 22,
    marginTop: 5,
    // fontFamily: fontFamily.robotoRegular,
  },
  poweredByOuter: { flex: 1 },
  poweredByContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  poweredByLogo: { marginLeft: 10, width: 20, height: 20 },
  modelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  modalImage: {
    width: 200,
    height: 50,
    alignSelf: 'center',
  },
  modalText: {
    fontSize: 20,
    color: currentTheme().black,
    alignSelf: 'center',
    marginTop: 30,
  },
  modalInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
