/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Linking,
  BackHandler,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDrawerStatus } from '@react-navigation/drawer';
import { Dialog } from '../../context/DialogContext';
import { app_setting, get_profile } from '../../services/User';
import { useLanguage } from '../../context/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  HomeIcon,
  UserIcon,
  StarIcon,
  TrophyIcon,
  ClockHistoryIcon,
  ChartIcon,
  DrawerWalletIcon,
  BankBuildingIcon,
  NoticeDocIcon,
  GlobeIcon,
  TranslateIcon,
  ShareIcon,
  HeadphoneIcon,
  CloseIcon,
  PowerIcon,
  InfoIcon,
} from '../../component/MatkaIcons';

function DrawerScreen(props) {
  const insets = useSafeAreaInsets();
  const { strings } = useLanguage();
  const drawerStatus = useDrawerStatus();
  const [userProfileData, setUserProfileData] = useState(null);
  const [appSetting, setAppSetting] = useState({});
  const [accountStatus, setAccountStatus] = useState('0');

  // When drawer is open, phone back button closes the drawer
  useEffect(() => {
    if (drawerStatus === 'open') {
      const onBackPress = () => {
        props.navigation.closeDrawer();
        return true;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }
  }, [drawerStatus, props.navigation]);

  const isApproved = () => {
    const status = userProfileData?.status ?? accountStatus;
    return status === '1';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, settings] = await Promise.all([
          get_profile(),
          app_setting(),
        ]);

        setUserProfileData(profile || null);
        setAppSetting(settings || {});

        const status = profile?.status === '1' ? '1' : '0';
        setAccountStatus(status);
        global.accountStatus = status;
        AsyncStorage.setItem('accountStatus', status);
      } catch (e) {
        setUserProfileData(null);
        setAccountStatus('0');
        global.accountStatus = '0';
      }
    };
    fetchData();
    const unsubscribe = props.navigation?.addListener?.('focus', fetchData);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [props.navigation]);

  const logoutHandler = () => {
    Dialog.confirm({
      title: strings.exit_confirm_title || 'छोड़ें',
      message: strings.exit_confirm_msg || 'क्या आप अभी बाहर निकलना चाहते हैं?',
      confirmText: strings.yes || 'हाँ',
      cancelText: strings.no || 'नहीं',
      onConfirm: async () => {
        try {
          await AsyncStorage.clear();
          props.navigation.replace('Login');
        } catch (error) {
          console.log('Logout error', error);
        }
      },
    });
  };

  const shareAppHandler = async () => {
    try {
      const shareUrl = appSetting?.app_link || 'https://play.google.com';
      const customMsg = appSetting?.content || appSetting?.share_message;
      const message = customMsg
        ? `${customMsg}\n${shareUrl}`
        : `Play and win with ${appSetting?.app_name || 'Bhau Matka'}! Download now: ${shareUrl}`;
      await Share.share({
        message,
        title: appSetting?.app_name || 'Bhau Matka',
      });
    } catch (error) {
      console.log('Share error', error);
    }
  };

  const navigateTo = (screen, params) => {
    props.navigation.closeDrawer();
    props.navigation.navigate(screen, params);
  };

  const contactUsHandler = () => {
    navigateTo('ContactUsScreen');
  };

  const menuSections = [
    {
      items: [
        {
          title: strings.drawer_home,
          icon: <HomeIcon size={22} color="#7A5524" />,
          action: () => {
            props.navigation.closeDrawer();
            props.navigation.navigate('Drawers', { screen: 'Home' });
          },
        },
        {
          title: strings.drawer_profile,
          icon: <UserIcon size={22} color="#7A5524" />,
          action: () => navigateTo('ProfileScreen'),
        },
      ],
    },
    {
      items: [
        {
          title: strings.drawer_game_rate,
          icon: <StarIcon size={22} color="#7A5524" />,
          action: () => navigateTo('MarketRate'),
        },
        {
          title: strings.drawer_win_history,
          icon: <TrophyIcon size={22} color="#7A5524" />,
          action: () => navigateTo('WiningHistory'),
        },
        {
          title: strings.drawer_bid_history,
          icon: <ClockHistoryIcon size={22} color="#7A5524" />,
          action: () => navigateTo('BidHistory'),
        },
        {
          title: strings.drawer_charts,
          icon: <ChartIcon size={22} color="#7A5524" />,
          action: () => navigateTo('ChartScreen', { games_name: 'Market Charts' }),
        },
        {
          title: strings.drawer_funds,
          icon: <DrawerWalletIcon size={22} color="#7A5524" />,
          action: () => navigateTo('Wallet'),
        },
        {
          title: strings.bank_manage_title || 'Bank & UPI Details',
          icon: <BankBuildingIcon size={22} color="#7A5524" />,
          action: () => navigateTo('BankDetails'),
        },
      ],
    },
    {
      items: [
        {
          title: strings.drawer_notice,
          icon: <NoticeDocIcon size={22} color="#7A5524" />,
          action: () => navigateTo('NoticeScreen'),
        },
        {
          title: strings.drawer_language,
          icon: <TranslateIcon size={22} color="#7A5524" />,
          action: () => navigateTo('SelectLanguage', { isFirstTime: false }),
        },
        {
          title: strings.drawer_share,
          icon: <ShareIcon size={22} color="#7A5524" />,
          action: shareAppHandler,
        },
        {
          title: strings.nav_support || '💬 Support Chat',
          icon: <HeadphoneIcon size={22} color="#7A5524" />,
          action: () => navigateTo('SupportChatScreen'),
        },
        {
          title: strings.drawer_contact,
          icon: <HeadphoneIcon size={22} color="#7A5524" />,
          action: contactUsHandler,
        },
        {
          title: strings.drawer_how_to_play,
          icon: <InfoIcon size={22} color="#7A5524" />,
          action: () => navigateTo('HowToPlayScreen'),
        },
      ],
    },
  ];

  return (
    <SafeAreaView edges={['top', 'left']} style={styles.container}>
      {/* TOP PROFILE HEADER */}
      <View style={styles.profileHeader}>
        <View style={styles.profileRow}>
          {/* Avatar Circle */}
          <View style={styles.avatarBorder}>
            <View style={styles.avatarInner}>
              <UserIcon size={32} color="#E2B048" />
            </View>
          </View>

          {/* Name & Phone */}
          <View style={styles.profileInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {userProfileData?.name || 'Dev'}
            </Text>
            <Text style={styles.userPhone}>
              {userProfileData?.number || userProfileData?.phone_number || '9966322889'}
            </Text>
          </View>

          {/* Close Button: Large Gold Cross */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.closeBtn}
            onPress={() => props.navigation.closeDrawer()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <CloseIcon size={24} color="#E2B048" />
          </TouchableOpacity>
        </View>

        {/* Thin Gold Divider */}
        <View style={styles.goldDivider} />
      </View>

      {/* DRAWER MENU ITEMS LIST */}
      <ScrollView
        style={styles.menuContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 35 + insets.bottom, paddingTop: 6 }}
      >
        {menuSections.map((section, sIdx) => (
          <View key={sIdx}>
            {section.items.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                style={styles.menuItemRow}
                onPress={item.action}
              >
                <View style={styles.menuIconBadge}>{item.icon}</View>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
            {/* Divider between sections */}
            <View style={styles.sectionDivider} />
          </View>
        ))}

        {/* LOGOUT ITEM */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.logoutRow}
          onPress={logoutHandler}
        >
          <View style={styles.logoutIconBadge}>
            <PowerIcon size={20} color="#DC2626" />
          </View>
          <Text style={styles.logoutTitle}>{strings.drawer_logout || 'लॉगआउट'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export default DrawerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061224',
  },
  profileHeader: {
    backgroundColor: '#061224',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,

    overflow: 'hidden',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBorder: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#26180B',
  },
  avatarInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    fontSize: 21,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  userPhone: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E2B048',
    marginTop: 3,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(226, 176, 72, 0.1)',
  },
  goldDivider: {
    height: 1,
    backgroundColor: '#E2B048',
    marginTop: 16,
    opacity: 0.4,
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 4,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  menuIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F4EFE6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemTitle: {
    fontSize: 16.5,
    fontFamily: 'serif',
    fontWeight: '800',
    color: '#261C14',
    letterSpacing: 0.2,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#EFE9DF',
    marginVertical: 4,
    marginHorizontal: 16,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  logoutIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FDEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoutTitle: {
    fontSize: 16.5,
    fontFamily: 'serif',
    fontWeight: '800',
    color: '#991B1B',
    letterSpacing: 0.2,
  },
});