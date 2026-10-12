import React, {useState} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ::::::::::::::::::::::::::::::::: import constant
import {fontFamily} from '../constants/font';
import {StyleConstants} from '../constants/Style.constant';
import {currentTheme} from '../constants/ThemeProvider';

// ::::::::::::::::::::::::::::::::: import component

// ::::::::::::::::::::::::::::::::: import services
import Icon from 'react-native-vector-icons/Ionicons';
import images from '../assets/images';
import {screenWidth} from '../constants/Sizes.constant';

function HomeHeader(props) {
  const {
    search,
    onclick,
    openDrawer,
    title,
    animating,
    setAnimating,
    navigation,
    source,
    onPress
  } = props;

  const LogoutFun = () => {
    Alert.alert('Logout', 'Are you sure you want logout', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          AsyncStorage.clear();
          navigation('Login', {backScreen: '', refresh: new Date().getTime()});
        },
      },
    ]);
  };

  return (
    <>
      <View
        style={{
          backgroundColor: currentTheme().White,
          borderBottomWidth: 1,
          borderBottomColor: currentTheme().inputBorderColor,
          // position: 'relative',
          // zIndex: 1,
          height: 48,
          marginLeft: -6,
          //   elevation: 5,
          // borderBottomWidth: 2,
        }}>
        <View style={styles.maneView}>
          {/* <TouchableOpacity onPress={openDrawer}
                        style={{ marginRight: 20 }} >
                       
                     <Image source={require('../asstes/Image/menu.png')} style={{ height: 25, width: 30, }} />   
                    </TouchableOpacity> */}
          <TouchableOpacity
          // onPress={onclick}
          >
            <Text
              style={{
                fontSize: 17,
                color: currentTheme().black,
                marginLeft: 10,
              }}>
              {title}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            // onPress={() => {
            //   LogoutFun();
            // }}
            onPress={onPress}
            >
            <Image
              source={source}
              style={{
                width: 25,
                height: 25,
                alignSelf: 'flex-end',
                // tintColor: currentTheme().White,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
   
    </>
  );
}

const styles = StyleSheet.create({
  maneView: {
    width: screenWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    paddingHorizontal: 10,
  },
  MenuView: {
    flexDirection: 'row',
    alignItems: 'center',
    // width: '30%',
    justifyContent: 'space-between',
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 9999,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default HomeHeader;

