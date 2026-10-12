
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { currentTheme } from '../../constants/ThemeProvider';
import CountryPicker from 'react-native-country-picker-modal';
import { screenWidth } from '../../constants/Sizes.constant';
import { fontFamily } from '../../constants/font';
import { lang } from '../../Language/languge';
import { StyleConstants } from '../../constants/Style.constant';
import { isValidEmail, isValidMobile } from '../../services/Validation';
import { icons } from '../../assets/images';

const CountryModal = ({
  country,
  countryCode,
  visible,
  setVisible,
  onSelect,
  label,
  placeholder,
  keyboardType,
  value,
  validationType,
  maxLength,
  onChangeText,
  editable
}) => {
  const [name, setName] = useState('');
  const [nameErr, setNameErr] = useState('');
  useEffect(() => {
    setName(value),
      setNameErr('')
  }, [value])
  return lang('lang') == 'ar' ? (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        // alignItems: 'center',
        marginHorizontal: 16,
      }}>
      <View style={{ marginRight: 10, flex: 6, }}>
        <Text style={styles.txtName}>{label}</Text>
        <View
          style={{
            // paddingStart: 10,
            width: screenWidth - 140,
            alignSelf: 'center',
            borderRadius: 5,
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: currentTheme().inputBorderColor,
            alignItems: 'center',
          }}>

          <TextInput
            placeholder={placeholder}
            color={currentTheme().textColor}
            keyboardType={keyboardType}
            placeholderTextColor={currentTheme().placeholderColor}
            onChangeText={e => {
              setNameErr('');
              onChangeText(e);
              setName(e);
            }}
            onBlur={e => {
              const re = /^[a-zA-Z\s]*$/;
              if (validationType == 'text') {
                if (name.length == '') {
                  setNameErr('Please fill input');
                } else if (re.test(name) == false) {
                  setNameErr('Please Enter Valid Name');
                }
              } else if (validationType == 'email') {
                if (name.length == '') {
                  setNameErr('Please Enter ' + placeholder);
                } else if (!isValidEmail(name)) {
                  setNameErr('Please Enter Valid ' + placeholder);
                }
              } else if (validationType == 'mobile') {
                if (name.length == '') {
                  setNameErr('Please Enter ' + placeholder);
                }
                //  else if (!isValidMobile(name)) {
                //   setNameErr('Please Enter Valid ' + placeholder);
                // }
              } else {
                setNameErr('');
              }
              // setCheckErr(nameErr)
            }}
            returnKeyType={'next'}
            defaultValue={value}
            autoCapitalize="none"
            maxLength={maxLength}
            style={{
              height: 50,
              flex: 1,
              color: currentTheme().black,
              borderColor: currentTheme().inputBorderColor,
              textAlign: lang('lang') === 'ar' ? 'right' : 'left',
              // paddingStart:-20,
              // marginRight:200
              marginLeft: lang('lang') == 'ar' ? -100 : 0,
              paddingHorizontal: 10,
              // marginLeft:lang('lang') == 'ar' ? -120 : 0
            }}
          />
        </View>

        <Text style={[StyleConstants.errText, { marginTop: 0, marginLeft: 0 }]}>
          {nameErr}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          console.log('setVisible-=-=-=', visible);

          setVisible(true);
        }}
        style={{
          backgroundColor: currentTheme().bgColor,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 30,
          borderRadius: 5,
          marginTop: 10,
          borderWidth: 1,
          borderColor: currentTheme().inputBorderColor,
          flex: 2.3,

          //   width:300
        }}>

        <CountryPicker
          {...{
            onSelect: onSelect,
          }}
          onClose={() => {
            setVisible(false);
          }}
          visible={visible}
          withFlagButton
          withEmoji={false}

          countryCode={countryCode}
          withFilter={true}
          containerButtonStyle={{
            marginLeft: 10,

            backgroundColor: "red",
          }}

        // containerButtonStyle={{backgroundColor:'#fff'}}
        />

        <Text style={{ color: currentTheme().textColor, marginLeft: -8 }}>
          +{country}
        </Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={{  }} >
      <Text style={styles.txtName}>{label}</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 16,
          width: screenWidth - 30,
          alignSelf: 'center',
          marginTop: 8,
          backgroundColor:  currentTheme().antiTextColor,
          height: 45,
          borderRadius: 5,

        }}>

        <TouchableOpacity
          onPress={() => { 
            setVisible(true);
          }}
          style={{
            backgroundColor: currentTheme().White,
            flexDirection: 'row',
            alignItems: 'center',
            alignContent: 'center',
            alignItems: 'center', 
            borderWidth: 1,
            borderColor: currentTheme().White, 
            borderTopLeftRadius:5,
            borderBottomLeftRadius:5, 
            // width: 100
            paddingHorizontal:10
          }}>
          <CountryPicker
            {...{
              onSelect: onSelect,
            }}
            onClose={() => {
              setVisible(false);
            }}
            visible={visible}
            withFlagButton
            withEmoji={false}
            countryCode={countryCode}
            

            withFilter={true}
            containerButtonStyle={{
              // marginLeft: 10,
              // top: -2,
              // backgroundColor: "red",
            }}

          // containerButtonStyle={{backgroundColor:'#fff'}}
          />

          <Text style={{ color: currentTheme().textColor, }}>
            +{country}
          </Text>
          <Image source={icons.dropArrow} style={{ height: 10, width: 10, tintColor: currentTheme().textColor, marginLeft: 7 }} />

        </TouchableOpacity>
        <View style={{ width: 1, height: '70%', backgroundColor: currentTheme().placeholderColor, marginVertical: 40 }} />

        <View style={{}}>

          <View
            style={{
              // paddingStart: 10,
              width:screenWidth - 150,
              alignSelf: 'center',
              // borderRadius: 5,
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: currentTheme().White,
              alignItems: 'center',
              height:45,
              borderTopEndRadius:5,
                borderTopRightRadius:5,
                borderBottomRightRadius:5
            }}>
            <TextInput
              placeholder={placeholder}
              color={currentTheme().textColor}
              keyboardType={keyboardType}
              editable={editable}
              placeholderTextColor={currentTheme().placeholderColor}
              onChangeText={e => {
                setNameErr('');
                onChangeText(e);
                setName(e);
              }}
              onBlur={e => {
                const re = /^[a-zA-Z\s]*$/;
                if (validationType == 'text') {
                  if (name.length == '') {
                    setNameErr('Please fill input');
                  } else if (re.test(name) == false) {
                    setNameErr('Please Enter Valid Name');
                  }
                } else if (validationType == 'email') {
                  if (name.length == '') {
                    setNameErr('Please Enter ' + placeholder);
                  } else if (!isValidEmail(name)) {
                    setNameErr('Please Enter Valid ' + placeholder);
                  }
                } else if (validationType == 'mobile') {
                  if (name.length == '') {
                    setNameErr('Please Enter ' + placeholder);
                  }
                  //  else if (!isValidMobile(name)) {
                  //   setNameErr('Please Enter Valid ' + placeholder);
                  // }
                } else {
                  setNameErr('');
                }
                // setCheckErr(nameErr)
              }}
              returnKeyType={'next'}
              defaultValue={value}
              autoCapitalize="none"
              maxLength={maxLength}
              style={{
                height: 45,
                flex: 1,
                color: currentTheme().black,
                borderColor: currentTheme().inputBorderColor,
                textAlign: lang('lang') === 'ar' ? 'right' : 'left',
                // paddingStart:-20,
                // marginRight:200
                // marginLeft: lang('lang') == 'ar' ? -100 : 0,
                paddingHorizontal: 10,
                backgroundColor:  currentTheme().White,
                borderTopEndRadius:5,
                borderTopRightRadius:5,
                borderBottomRightRadius:5
                // marginLeft:lang('lang') == 'ar' ? -120 : 0
              }}
            />
          </View>


        </View>
       
      </View>
      <Text style={[StyleConstants.errText, { marginLeft:0   }]}>
          {nameErr}
        </Text>
    </View>

  );
};

export default CountryModal;

const styles = StyleSheet.create({
  Textinputs: {
    paddingStart: 10,
    // width: screenWidth * (335 / 375),
    alignSelf: 'center',
    borderRadius: 5,
    flexDirection: 'row',
    borderWidth: 5,
  },
  txtName: {
    color: currentTheme().textColor,
    // marginBottom: 5,
    // marginHorizontal: 20,
    fontFamily: fontFamily.Regular,
    fontWeight: 'bold',
    // marginLeft: -100,
  },
});
