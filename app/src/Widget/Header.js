import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  View,
  BackHandler,
  Alert,
  Image,
  StatusBar,
} from 'react-native';
import { Appbar } from 'react-native-paper';

// ::::::::::::::::::::::::::::::::: import constants
import { fontFamily } from '../constants/font';
import { screenWidth } from '../constants/Sizes.constant';
import { ColorsConstant } from '../constants/Colors.constant';
import { currentTheme } from '../constants/ThemeProvider';
import icon from '../constants/image';
import { images } from '../assets/images';
import leftBackIcon from '../assets/icon/left.png';
import { BackArrow, RefreshIcon } from '../component/MatkaIcons';

export default function Header(props) {
  const { refresh, setRefresh, animating, setAnimating, headerCenter } = props;

  // ============================= BackHandler =============================
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      _goBack,
    );

    return () => backHandler.remove(); // ✅ Correct cleanup
  }, [refresh]);

  // ============================= Back Action =============================
  const _goBack = () => {
    if (typeof props.leftButtonAction === 'undefined') {
      Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    } else {
      props.leftButtonAction();
      return true;
    }
  };

  // ============================= Refresh Logic =============================
  const _handleRefresh = async () => {
    const { user } = props;
    // Example refresh logic — update user data here if needed
  };

  const refreshData = () => {
    if (typeof props.rightButtonAction === 'function') {
      props.rightButtonAction();
    } else if (typeof setRefresh === 'function') {
      setRefresh(new Date().getTime());
    } else if (typeof refresh === 'function') {
      refresh();
    } else if (typeof props.onRefresh === 'function') {
      props.onRefresh();
    }
  };

  // ============================= Render =============================
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />
      <View style={ls.headerContainer}>
        {props.leftButttonType !== 'noIcon' && props.leftButtonType !== 'noIcon' ? (
          <View style={ls.leftWrapper}>
            {props.leftButtonType === 'back' ? (
              <TouchableOpacity
                activeOpacity={0.8}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={ls.backCircleBtn}
                onPress={_goBack}
              >
                <BackArrow size={20} color="#E2B048" />
              </TouchableOpacity>
            ) : (
              props.leftButtonTemplate || <View style={{ width: 40 }} />
            )}
          </View>
        ) : (
          <View style={{ width: 40 }} />
        )}

        <View style={[ls.titleWrapper, props.headerCenter === false && ls.titleWrapperLeft]}>
          <Text style={ls.headerTitle} numberOfLines={1}>
            {props.title}
          </Text>
        </View>

        {props.rightButttonType === 'refresh' || props.rightButtonType === 'refresh' ? (
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={typeof props.rightButtonAction === 'function' ? props.rightButtonAction : refreshData}
            style={ls.refreshBtn}
          >
            <RefreshIcon size={19} color="#E2B048" />
          </TouchableOpacity>
        ) : props.rightButtonTemplate ? (
          props.rightButtonTemplate
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {animating && (
        <ActivityIndicator
          animating={animating}
          color="#E2B048"
          size="small"
          style={ls.activityIndicator}
        />
      )}
    </>
  );
}

const ls = StyleSheet.create({
  activityIndicator: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 9999,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  headerContainer: {
    backgroundColor: '#061224',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  leftWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  titleWrapperLeft: {
    alignItems: 'flex-start',
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 19,
    color: '#E2B048',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  backCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2B048',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(226, 176, 72, 0.08)',
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(226, 176, 72, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(226, 176, 72, 0.08)',
  },
});
