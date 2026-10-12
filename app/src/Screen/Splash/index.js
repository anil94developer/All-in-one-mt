/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import { screenWidth } from '../../constants/Sizes.constant';
import { images } from '../../assets/images';
import { get_profile } from '../../services/User';
import { useAppSetting } from '../../context/AppSettingContext';
import { isUpdateRequired } from '../../Utlies/versionUtils';

export default function Splash(props) {
  const { appSetting, loading } = useAppSetting();
  const [currentVersion, setCurrentVersion] = useState('');
  const isLanguageChange = props.route?.params?.isLanguageChange ?? false;

  // 2 Blue Dots Oscillating Animation (Screenshot 2 - आपस में आए जाएं)
  const animSwap = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animSwap.setValue(0);
    const loop = Animated.loop(
      Animated.timing(animSwap, {
        toValue: 2,
        duration: 1400,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [animSwap]);

  // 1. Language change quick redirect flow
  useEffect(() => {
    if (isLanguageChange) {
      const timer = setTimeout(async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          const phone = await AsyncStorage.getItem('phone');
          if (!token || !phone) {
            props.navigation.replace('SignUp');
          } else {
            props.navigation.replace('Drawers', { screen: 'Home' });
          }
        } catch (e) {
          props.navigation.replace('Drawers', { screen: 'Home' });
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLanguageChange]);

  // 2. Normal app startup flow
  useEffect(() => {
    if (isLanguageChange) return;

    const checkLanguageAndInit = async () => {
      try {
        const langSelected = await AsyncStorage.getItem('language_selected');
        if (!langSelected) {
          props.navigation.replace('SelectLanguage', { isFirstTime: true });
          return;
        }
      } catch (e) {}

      try {
        const userData = await get_profile();
        const accountStatus = userData?.status === '1' ? '1' : '0';
        AsyncStorage.setItem('accountStatus', accountStatus);
        global.accountStatus = accountStatus;
      } catch (e) {
        global.accountStatus = '0';
      }
    };
    checkLanguageAndInit();
  }, [isLanguageChange]);

  useEffect(() => {
    if (isLanguageChange) return;

    try {
      const v = typeof DeviceInfo.getVersionSync === 'function'
        ? DeviceInfo.getVersionSync()
        : DeviceInfo.getVersion();
      if (v != null && typeof v.then === 'function') {
        v.then((ver) => setCurrentVersion(ver || '0.0.0')).catch(() => setCurrentVersion('0.0.0'));
      } else {
        setCurrentVersion(typeof v === 'string' ? v : (v && String(v)) || '0.0.0');
      }
    } catch (e) {
      setCurrentVersion('0.0.0');
    }
  }, [isLanguageChange]);

  useEffect(() => {
    if (isLanguageChange || loading || !currentVersion) return;

    const t = setTimeout(async () => {
      const langSelected = await AsyncStorage.getItem('language_selected');
      if (!langSelected) return;

      const underMaintenance = String(appSetting.under_maintenance || '').toLowerCase() === 'yes';
      if (underMaintenance) {
        props.navigation.replace('UnderMaintenance', { message: appSetting.message });
        return;
      }
      const versionIncreased = isUpdateRequired(appSetting.app_version, currentVersion);
      const forceUpdate = String(appSetting.need_update || '').toLowerCase() === 'yes';
      if (forceUpdate || versionIncreased) {
        props.navigation.replace('AppUpdate', { currentVersion });
        return;
      }
      check_login();
    }, 2000);
    return () => clearTimeout(t);
  }, [isLanguageChange, loading, currentVersion, appSetting.app_version, appSetting.under_maintenance, appSetting.message]);

  const check_login = async () => {
    const token = await AsyncStorage.getItem('token');
    const phone = await AsyncStorage.getItem('phone');
    if (!token || !phone) {
      props.navigation.navigate('SignUp');
    } else {
      props.navigation.replace('Drawers', { screen: 'Home' });
    }
  };

  const dot1X = animSwap.interpolate({
    inputRange: [0, 0.5, 1, 1.5, 2],
    outputRange: [-18, 0, 18, 0, -18],
  });

  const dot2X = animSwap.interpolate({
    inputRange: [0, 0.5, 1, 1.5, 2],
    outputRange: [18, 0, -18, 0, 18],
  });

  const dot1Scale = animSwap.interpolate({
    inputRange: [0, 0.5, 1, 1.5, 2],
    outputRange: [1.05, 1.25, 0.88, 0.82, 1.05],
  });

  const dot2Scale = animSwap.interpolate({
    inputRange: [0, 0.5, 1, 1.5, 2],
    outputRange: [0.88, 0.82, 1.05, 1.25, 0.88],
  });

  return (
    <SafeAreaView style={ls.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      {/* CENTER 3D BHAU MATKA LOGO (Screenshot 2) */}
      <View style={ls.centerContent}>
        <Image
          source={images.logo}
          style={ls.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* 2 BLUE DOTS ANIMATION (Screenshot 2 - आपस में आए जाएं) */}
      <View style={ls.loaderContainer}>
        <View style={ls.twoDotsTrack}>
          {/* Dot 1 */}
          <Animated.View
            style={[
              ls.blueDot,
              {
                transform: [{ translateX: dot1X }, { scale: dot1Scale }],
              },
            ]}
          />
          {/* Dot 2 */}
          <Animated.View
            style={[
              ls.blueDot,
              {
                transform: [{ translateX: dot2X }, { scale: dot2Scale }],
              },
            ]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const ls = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061224',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 45,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: screenWidth * 0.78,
    height: screenWidth * 0.78,
  },
  loaderContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  twoDotsTrack: {
    width: 80,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  blueDot: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E70EB',
    elevation: 6,
    shadowColor: '#1E70EB',
    shadowOpacity: 0.8,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
});
