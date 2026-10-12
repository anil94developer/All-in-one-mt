/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState, useContext} from 'react';
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

import {screenHeight, screenWidth} from '../../../constants/Sizes.constant';
import PushNotification from 'react-native-push-notification';

// import { fontFamily } from "../../constants/font";

import LargefillBtn from '../../../component/Button/LargefillBtn';
import PasswordTextInput from '../../../component/TextInput/PasswordTextInput';
// import PinInput from "./../../component/TextInput/PinInput";
// import SmailInput from "../../component/TextInput/SmailInput";
// // import { Strings } from "../../component/TextStrings/Strings";

//::::::::::::::::::::::::::::::::::::::: import services
// import {login_user, logout_other_device} from '../../services/User';
import {images} from '../../../asstes/images';
import {isValidMobile} from '../../../services/Validation';
// import {fontFamily} from '../../../constants/font';
import {postApiCall} from '../../../services/AppSetting';
import {currentTheme, useTheme} from '../../../constants/ThemeProvider';
import {lang} from '../../../Language/languge';
import Header from '../../../Widget/Header';
import { base } from '../../../constants/Data.constant';

function ChangePassword(props) {
  const {screen, mobile, country_code} = props.route.params;

  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const {theme, updateTheme} = useTheme();

  useEffect(() => {
    // alert(country_code)
    const backAction = () => {
      // props.navigation.navigate('Tabs',{screen:'User'})

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [props]);

  const set_password = async () => {
   // props.navigation.navigate('PersonalDetails');
    try {
      setLoading(true);
      if (password == '') {
        // Vibration.vibrate(300);
        Toast.show({ type: 'error', text1: "Error!", text2: 'Password is required' });
      }else  if (password.length < 6) {
        // Vibration.vibrate(300);
        Toast.show({ type: 'error', text1: "Error!", text2: 'Password is required min length 6.' });
      }
      
       else if (confirmPassword == '') {
        // Vibration.vibrate(300);
        Toast.show({ type: 'error', text1: "Error!", text2: 'Confirm Password is required' });
      }else  if (confirmPassword.length < 6) {
        // Vibration.vibrate(300);
        Toast.show({ type: 'error', text1: "Error!", text2: 'Confirm Password is required min length 6.' });
      }
      
      else if (password != confirmPassword) {
        // Vibration.vibrate(300);
        Toast.show({ type: 'error', text1: "Error!", text2: 'Password miss match' });
      } else {
        let body = { 
          password: password,
          type:'Washer'
        }; 
        let result = await postApiCall(base.changePassword, body); 
        if (result.status == true) {
          Toast.show({ type: 'success', text1: "Password Changed !", text2: result.message });
          setLoading(false);
          _goBack()
        } else {
          // Vibration.vibrate(300);
          Toast.show({ type: 'error', text1: result.message });
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
    props.navigation.goBack();
  };
  return (
    <View style={styles.container}>  
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <Header
          leftButtonType="back"
          title={'Change Password'}
          leftButtonAction={_goBack}
        /> 

        <View style={{marginTop: 25}}>
          <View>
            <PasswordTextInput
              label={'Password'}
              placeholder={'Password'}
              maxLength={10}
              value={password}
              keyboardType="default"
              onChangeText={e => {
                setPassword(e);
              }}
              error=""
            />
          </View>
          <PasswordTextInput
            label={'Re-enter Password'}
            placeholder={'Re-enter Password'}
            maxLength={10}
            value={confirmPassword}
            keyboardType="default"
            onChangeText={e => {
              setConfirmPassword(e);
            }}
            error=""
          />

          <View
            style={{marginTop: screenWidth * (14 / 375), alignItems: 'center'}}>
            <LargefillBtn
              width={screenWidth - 20}
              animating={loading}
              label={'Save Password'}
              onPress={() => {
                set_password();
              }}
              backgroundColor={currentTheme().themeColor}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
export default ChangePassword;

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
  logo: {width: screenWidth, height: screenHeight * (150 / screenHeight)},
  loginText: {
    fontSize: 30,
    alignSelf: 'center',
    color: currentTheme().black, 
    fontWeight: 'bold',
  },
  mobileNumber: {
    color: currentTheme().White,
    fontSize: 22,
    marginTop: 5,
    // fontFamily: fontFamily.robotoRegular,
  },
  poweredByOuter: {flex: 1},
  poweredByContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  poweredByLogo: {marginLeft: 10, width: 20, height: 20},
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
