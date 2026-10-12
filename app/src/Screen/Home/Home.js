import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { DrawerStatusContext } from '@react-navigation/drawer';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Image,
  FlatList,
  BackHandler,
  Alert,
  Linking,
  StatusBar,
  Modal,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { currentTheme } from '../../constants/ThemeProvider';
import { screenWidth } from '../../constants/Sizes.constant';
import { getApiCall } from '../../services/AppSetting';
import { base } from '../../config/appConfig';
import { get_profile } from '../../services/User';
import { useAppSetting } from '../../context/AppSettingContext';
import MarqueeText from '../../component/MarqueeText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../component/loading';
import { Dialog } from '../../context/DialogContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  MenuIcon,
  WalletIcon,
  BellIcon,
  RupeeIcon,
  PlayIcon,
  PauseIcon,
  ChartIcon,
  CalendarIcon,
  ChevronRight,
  HomeIcon,
  ClockIcon,
  ClockHistoryIcon,
  DrawerWalletIcon,
  PassbookIcon,
  SupportIcon,
  BoltIcon,
  ShieldIcon,
  HeadphoneIcon,
  StarIcon,
  TrophyIcon,
  CloseIcon,
  GiftIcon,
  DoorExitIcon,
  NavHistoryIcon,
  NavWalletIcon,
  NavHomeIcon,
  NavPassbookIcon,
  NavSupportIcon,
  CapsuleRupeeIcon,
  BlackShieldCheckIcon,
  HourglassRedIcon,
  CalendarRedIcon,
  AlarmClockRedIcon,
  ClockCrossedRedIcon,
} from '../../component/MatkaIcons';

const Home = (props) => {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 24 : 12);
  const { appSetting, refresh: refreshAppSetting } = useAppSetting();
  const { strings } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState([]);
  const [bannerData, setBannerData] = useState([]);
  const [userData, setUserData] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [accountStatus, setAccountStatus] = useState('0');
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [showPopupModal, setShowPopupModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [closedMarketModal, setClosedMarketModal] = useState(false);
  const [selectedClosedMarket, setSelectedClosedMarket] = useState(null);

  const shimmerAnim = useRef(new Animated.Value(-1)).current;
  const floatCardsAnim = useRef(new Animated.Value(0)).current;
  const scaleCardsAnim = useRef(new Animated.Value(1)).current;
  const floatHomeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Diagonal Shimmer Beam Sweep Loop
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.delay(600),
      ])
    );
    shimmerLoop.start();

    // 2. Smooth Floating & Scale Pulse Loop for 4 Action Cards
    const cardsLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(floatCardsAnim, {
            toValue: -9,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(scaleCardsAnim, {
            toValue: 1.035,
            duration: 650,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(floatCardsAnim, {
            toValue: 0,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(scaleCardsAnim, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    cardsLoop.start();

    // 3. Smooth Floating / Bobbing Loop for Center Elevated Home Button
    const homeLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatHomeAnim, {
          toValue: -7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(floatHomeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    homeLoop.start();

    return () => {
      shimmerLoop.stop();
      cardsLoop.stop();
      homeLoop.stop();
    };
  }, [shimmerAnim, floatCardsAnim, scaleCardsAnim, floatHomeAnim]);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-140, (screenWidth - 34) / 2 + 100],
  });

  useEffect(() => {
    const isOfferActive = String(appSetting?.offer_status) === '1';
    const isPopupActive = String(appSetting?.popup_status) === '1';

    if (isOfferActive) {
      setShowBonusModal(true);
    } else {
      setShowBonusModal(false);
    }

    if (isPopupActive && !isOfferActive) {
      setShowPopupModal(true);
    } else {
      setShowPopupModal(false);
    }
  }, [appSetting?.offer_status, appSetting?.popup_status]);

  const handleDismissBonusModal = async () => {
    setShowBonusModal(false);
    try {
      await AsyncStorage.setItem('welcome_bonus_shown', 'true');
    } catch (e) { }

    // Check Action
    const action = appSetting.offer_btn_action || 'deposit';
    if (action === 'deposit') {
      // props.navigation.navigate('AddFund');
    } else if (action === 'whatsapp' && appSetting.whatsapp_number) {
      Linking.openURL(`whatsapp://send?phone=${appSetting.whatsapp_number}&text=Hello`);
    } else if (action === 'telegram' && appSetting.telegram_link) {
      Linking.openURL(appSetting.telegram_link);
    }
  };

  const handleDismissPopupModal = async () => {
    setShowPopupModal(false);
    try {
      await AsyncStorage.setItem('popup_notice_shown', 'true');
    } catch (e) { }

    const action = appSetting.popup_btn_action || 'dismiss';
    if (action === 'deposit') {
      props.navigation.navigate('AddFund');
    } else if (action === 'whatsapp' && appSetting.whatsapp_number) {
      Linking.openURL(`whatsapp://send?phone=${appSetting.whatsapp_number}&text=Hello`);
    } else if (action === 'telegram' && appSetting.telegram_link) {
      Linking.openURL(appSetting.telegram_link);
    }
  };

  useEffect(() => {
    get_data();
  }, [props]);

  const fetchMarkets = async () => {
    try {
      const result = await getApiCall(base.getKalyanMarket);
      let marketList = [];
      if (Array.isArray(result?.data?.markets)) {
        marketList = result.data.markets;
      } else if (Array.isArray(result?.markets)) {
        marketList = result.markets;
      } else if (Array.isArray(result?.data)) {
        marketList = result.data;
      } else if (Array.isArray(result?.result)) {
        marketList = result.result;
      } else if (Array.isArray(result)) {
        marketList = result;
      }

      if (marketList.length > 0) {
        const formatted = marketList.map((m) => {
          const name = m.market_name || m.games_name || m.game || m.game_name || 'Market';
          const openPana = m.open_pana || '***';
          const closePana = m.close_pana || '***';
          const openDigit = m.open_digit !== undefined && m.open_digit !== null ? String(m.open_digit) : '*';
          const closeDigit = m.close_digit !== undefined && m.close_digit !== null ? String(m.close_digit) : '*';
          const resStr = m.result || m.last_result || m.result_text || `${openPana}-${openDigit}${closeDigit}-${closePana}`;
          return {
            ...m,
            id: m.id?.toString() || name,
            market_name: name,
            games_name: name,
            open_time: m.open_time || '10:00 am',
            close_time: m.close_time || '10:00 pm',
            market_status: m.market_status !== '0' && m.market_status !== 'closed' ? 'active' : 'closed',
            is_online: m.is_online !== undefined ? Boolean(m.is_online) : true,
            result: resStr,
            last_result: resStr,
          };
        });
        setHomeData(formatted);
      } else {
        setHomeData([]);
      }
    } catch (e) {
      console.log('Error fetching markets:', e);
    }
  };

  const fetchProfileData = async () => {
    try {
      const uData = await get_profile();
      setUserData(uData);
      if (uData?.status === '0') {
        AsyncStorage.setItem('accountStatus', '0');
        global.accountStatus = '0';
        setAccountStatus('0');
      } else {
        global.accountStatus = '1';
        AsyncStorage.setItem('accountStatus', '1');
        setAccountStatus('1');
      }
    } catch (e) {
      console.log('Error fetching profile:', e);
    }
  };

  const fetchSliders = async () => {
    try {
      const sliderResult = await getApiCall(base.slider);
      if (sliderResult?.status === true && sliderResult?.data?.sliders) {
        const activeSliders = sliderResult.data.sliders.filter((s) => s.status === 'active');
        setBannerData(activeSliders);
      } else if (Array.isArray(sliderResult?.result)) {
        setBannerData(sliderResult.result);
      } else if (Array.isArray(sliderResult?.data)) {
        setBannerData(sliderResult.data);
      } else if (Array.isArray(sliderResult)) {
        setBannerData(sliderResult);
      } else {
        setBannerData([]);
      }
    } catch (e) {
      console.log('Error fetching sliders:', e);
    }
  };

  const get_data = async () => {
    setLoading(true);
    try {
      if (refreshAppSetting) {
        refreshAppSetting();
      }
      await Promise.allSettled([
        fetchMarkets(),
        fetchProfileData(),
        fetchSliders(),
      ]);
    } catch (e) {
      console.log('Error in get_data:', e);
    } finally {
      setLoading(false);
    }
  };

  const drawerStatus = useContext(DrawerStatusContext);

  useFocusEffect(
    useCallback(() => {
      if (refreshAppSetting) {
        refreshAppSetting();
      }
      const backAction = () => {
        // 1. If the drawer is open, close the drawer
        if (drawerStatus === 'open') {
          props.navigation.closeDrawer();
          return true;
        }

        // 2. If stack has previous screens, go back
        if (props.navigation.canGoBack()) {
          props.navigation.goBack();
          return true;
        }

        // 3. Otherwise, show Exit App confirmation dialog
        Dialog.confirm({
          title: strings.exit_confirm_title || 'छोड़ें',
          message: strings.exit_confirm_msg || 'क्या आप अभी बाहर निकलना चाहते हैं?',
          confirmText: strings.yes || 'हाँ',
          cancelText: strings.no || 'नहीं',
          onConfirm: () => {
            BackHandler.exitApp();
          },
        });
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, [drawerStatus, strings, props.navigation])
  );

  function timeConvert(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    const s = timeStr.trim().toLowerCase();
    const parts = s.split(':');
    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);
    if (isNaN(hours)) hours = 0;
    if (isNaN(minutes)) minutes = 0;

    if (s.includes('pm') && hours !== 12) hours += 12;
    if (s.includes('am') && hours === 12) hours = 0;
    hours = hours % 24;
    minutes = Math.min(59, Math.max(0, minutes));

    const time = new Date();
    time.setHours(hours, minutes, 0, 0);
    return Math.floor(time.getTime() / 1000);
  }

  const renderItem = ({ item }) => {
    const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
    const openTimeInSeconds = timeConvert(item.open_time);
    const closeTimeInSeconds = timeConvert(item.close_time);

    const open_status =
      item.open_status !== undefined && item.open_status !== null
        ? Boolean(item.open_status)
        : currentTimeInSeconds >= openTimeInSeconds;
    const close_status =
      item.close_status !== undefined && item.close_status !== null
        ? Boolean(item.close_status)
        : currentTimeInSeconds <= closeTimeInSeconds;

    const marketStatus = (item.market_status === 'active' || item.market_status === '1') && item.is_online !== false;
    const canNavigate = marketStatus && (open_status || close_status || item.is_running !== false);

    const selectItem = {
      ...item,
      games_name: item.market_name || item.games_name,
      game_status: marketStatus ? '1' : '0',
      open_status,
      close_status,
    };

    const accountBlocked = global.accountStatus === '0' || accountStatus === '0';
    const resultText = item.result || item.last_result || item.result_text || '***-**-***';
    const openTimeStr = item.open_time || '—';
    const closeTimeStr = item.close_time || '—';

    return (
      <View style={styles.marketCardOuter}>
        <View style={styles.marketCard}>
          {/* Top Timing Strip */}
          <View style={styles.marketTimingStrip}>
            <Text style={styles.timingText}>
              {strings.open_label || 'Open'}: <Text style={styles.timingValue}>{openTimeStr}</Text>
            </Text>
            <View style={{ marginHorizontal: 6 }}>
              <CalendarIcon size={14} color="#6B4226" />
            </View>
            <Text style={styles.timingText}>
              {strings.close_label || 'Close'}: <Text style={styles.timingValue}>{closeTimeStr}</Text>
            </Text>
          </View>

          {/* Card Body Row */}
          <View style={styles.marketBodyRow}>
            {/* Left Column: Game Chart */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                props.navigation.navigate('ChartScreen', {
                  games_name: item.market_name,
                  market_id: item.id,
                })
              }
              style={styles.chartCol}
            >
              <View style={styles.chartCircle}>
                <ChartIcon size={24} color="#E2B048" />
              </View>
              <Text style={styles.chartLabel}>{strings.game_chart || 'गेम चार्ट'}</Text>
            </TouchableOpacity>

            {/* Middle Column: Name, Result, Status Pill */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.infoCol}
              onPress={() => {
                if (canNavigate && !accountBlocked) {
                  props.navigation.navigate('GameScreen', { selectItem });
                } else if (!canNavigate) {
                  setSelectedClosedMarket(item);
                  setClosedMarketModal(true);
                }
              }}
            >
              <Text style={styles.marketName} numberOfLines={1}>
                {item.market_name}
              </Text>
              <Text style={styles.marketResult}>{resultText}</Text>
              <View
                style={[
                  styles.marketStatusPill,
                  { backgroundColor: canNavigate ? '#E8F5E9' : '#FCE8E8' },
                ]}
              >
                <Text
                  style={[
                    styles.marketStatusText,
                    { color: canNavigate ? '#2E7D32' : '#D90429' },
                  ]}
                >
                  {canNavigate
                    ? (strings.market_running || 'Market Running')
                    : (strings.market_closed || 'Market Closed')}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Right Column: Play / Pause Round Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                if (canNavigate && !accountBlocked) {
                  props.navigation.navigate('GameScreen', { selectItem });
                } else if (!canNavigate) {
                  setSelectedClosedMarket(item);
                  setClosedMarketModal(true);
                }
              }}
              style={[
                styles.actionBtnCircle,
                { borderColor: canNavigate ? '#E2B048' : '#701A1E' },
              ]}
            >
              {canNavigate ? (
                <PlayIcon size={22} color="#E2B048" />
              ) : (
                <PauseIcon size={22} color="#D90429" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    if (refreshAppSetting) {
      refreshAppSetting();
    }
    try {
      await get_data();
    } finally {
      setRefreshing(false);
    }
  }, [refreshAppSetting]);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      {/* TOP HEADER */}
      <View style={styles.headerBar}>
        {/* Left: Hamburger Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => props.navigation.openDrawer()}
          style={styles.menuCircleBtn}
        >
          <MenuIcon size={20} color="#E2B048" />
        </TouchableOpacity>

        {/* Center: Title */}
        <Text style={styles.headerTitle} numberOfLines={1}>
          {appSetting.app_name || 'Bhau Matka'}
        </Text>

        {/* Right: Wallet Badge & Bell */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => props.navigation.navigate('AddFund')}
            style={styles.walletBadge}
          >
            <WalletIcon size={16} color="#E2B048" />
            <Text style={styles.walletText}> ₹{userData?.wallet ?? 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => props.navigation.navigate('NoticeScreen')}
            style={styles.bellBtn}
          >
            <BellIcon size={22} color="#E2B048" />
          </TouchableOpacity>
        </View>
      </View>

      {/* BODY CONTENT WRAPPER */}
      <View style={styles.bodyWrapper}>
        {/* TICKER SUBHEADER BAR */}
        <View style={styles.tickerBar}>
        <View style={styles.tickerItem}>
          <BoltIcon size={13} color="#C48417" />
          <Text style={styles.tickerText}>{strings.fast_deposit || 'FAST DEPOSIT'}</Text>
        </View>
        <View style={styles.tickerDivider} />
        <View style={styles.tickerItem}>
          <BlackShieldCheckIcon size={15} />
          <Text style={styles.tickerText}>{strings.fast_withdrawal || 'FAST WITHDRAWAL'}</Text>
        </View>
        <View style={styles.tickerDivider} />
        <View style={styles.tickerItem}>
          <HeadphoneIcon size={15} color="#B87A18" />
          <Text style={styles.tickerText}>{strings.support_247 || '24×7 SUPPORT'}</Text>
        </View>
      </View>

      {/* 2X2 ACTION CARDS GRID (FIXED AT TOP) */}
      <View style={styles.actionGrid}>
        {/* Row 1 */}
        <View style={styles.actionRow}>
          {/* 1. ADD MONEY */}
          <Animated.View
            style={[
              styles.actionCardTouch,
              { transform: [{ translateY: floatCardsAnim }, { scale: scaleCardsAnim }] },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              style={{ flex: 1 }}
              onPress={() => props.navigation.navigate('AddFund')}
            >
              <View style={[styles.actionCardBevel, { backgroundColor: '#5A3300' }]}>
                <LinearGradient
                  colors={['#B87B14', '#A06409', '#844E02']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.actionCardGradient}
                >
                  {/* Permanent Diagonal Glass Reflection */}
                  <View pointerEvents="none" style={styles.cardPermanentGlass}>
                    <LinearGradient
                      colors={[
                        'rgba(255, 255, 255, 0)',
                        'rgba(255, 255, 255, 0.08)',
                        'rgba(255, 255, 255, 0.28)',
                        'rgba(255, 255, 255, 0.08)',
                        'rgba(255, 255, 255, 0)',
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.cardPermanentGlassGradient}
                    />
                  </View>

                  {/* Animated Shimmer Beam */}
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.shimmerBeam,
                      {
                        transform: [
                          { translateX: shimmerTranslate },
                          { rotate: '25deg' },
                        ],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={[
                        'rgba(255, 255, 255, 0)',
                        'rgba(255, 255, 255, 0.15)',
                        'rgba(255, 255, 255, 0.45)',
                        'rgba(255, 255, 255, 0.15)',
                        'rgba(255, 255, 255, 0)',
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.shimmerGradient}
                    />
                  </Animated.View>

                  {/* Left Badge: White circle with brown Rupee symbol */}
                  <View style={styles.actionBadgeWhite}>
                    <Text style={[styles.actionRupeeText, { color: '#784200' }]}>₹</Text>
                  </View>

                  <View style={styles.actionCardContent}>
                    <Text
                      style={styles.actionCardTitle}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.85}
                    >
                      {strings.add_money || 'पैसे जोड़ें'}
                    </Text>
                    <Text
                      style={styles.actionCardSubtitle}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.75}
                    >
                      {strings.add_money_sub || 'Instant Add Money'}
                    </Text>
                  </View>

                  <ChevronRight size={14} color="#FFFFFF" />
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* 2. WITHDRAW */}
          <Animated.View
            style={[
              styles.actionCardTouch,
              { transform: [{ translateY: floatCardsAnim }, { scale: scaleCardsAnim }] },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              style={{ flex: 1 }}
              onPress={() => props.navigation.navigate('Withdraw')}
            >
              <View style={[styles.actionCardBevel, { backgroundColor: '#04070E' }]}>
                <LinearGradient
                  colors={['#1A283C', '#101B2A', '#08101A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.actionCardGradient}
                >
                  {/* Permanent Diagonal Glass Reflection */}
                  <View pointerEvents="none" style={styles.cardPermanentGlass}>
                    <LinearGradient
                      colors={[
                        'rgba(255, 255, 255, 0)',
                        'rgba(255, 255, 255, 0.08)',
                        'rgba(255, 255, 255, 0.28)',
                        'rgba(255, 255, 255, 0.08)',
                        'rgba(255, 255, 255, 0)',
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.cardPermanentGlassGradient}
                    />
                  </View>

                  {/* Animated Shimmer Beam */}
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.shimmerBeam,
                      {
                        transform: [
                          { translateX: shimmerTranslate },
                          { rotate: '25deg' },
                        ],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={[
                        'rgba(255, 255, 255, 0)',
                        'rgba(255, 255, 255, 0.15)',
                        'rgba(255, 255, 255, 0.45)',
                        'rgba(255, 255, 255, 0.15)',
                        'rgba(255, 255, 255, 0)',
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.shimmerGradient}
                    />
                  </Animated.View>

                  {/* Left Badge: White circle with dark navy Rupee symbol */}
                  <View style={styles.actionBadgeWhite}>
                    <Text style={[styles.actionRupeeText, { color: '#101C2B' }]}>₹</Text>
                  </View>

                  <View style={styles.actionCardContent}>
                    <Text
                      style={styles.actionCardTitle}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.85}
                    >
                      {strings.withdraw || 'निकासी'}
                    </Text>
                    <Text
                      style={[styles.actionCardSubtitle, { letterSpacing: -0.2 }]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.75}
                    >
                      {strings.withdraw_sub || 'Get Instant Withdrawal'}
                    </Text>
                  </View>

                  <ChevronRight size={14} color="#FFFFFF" />
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Row 2 */}
        <View style={styles.actionRow}>
          {/* 3. STARLINE */}
          <Animated.View
            style={[
              styles.actionCardTouch,
              { transform: [{ translateY: floatCardsAnim }, { scale: scaleCardsAnim }] },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              style={{ flex: 1 }}
              onPress={() => props.navigation.navigate('StarlineGamesScreen')}
            >
              <View style={[styles.actionCardBevel, { backgroundColor: '#004725' }]}>
                <LinearGradient
                  colors={['#02A85B', '#018E4C', '#00703C']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.actionCardGradient}
                >
                  {/* Permanent Diagonal Glass Reflection */}
                  <View pointerEvents="none" style={styles.cardPermanentGlass}>
                    <LinearGradient
                      colors={[
                        'rgba(255, 255, 255, 0)',
                        'rgba(255, 255, 255, 0.08)',
                        'rgba(255, 255, 255, 0.28)',
                        'rgba(255, 255, 255, 0.08)',
                        'rgba(255, 255, 255, 0)',
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.cardPermanentGlassGradient}
                    />
                  </View>

                  {/* Animated Shimmer Beam */}
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.shimmerBeam,
                      {
                        transform: [
                          { translateX: shimmerTranslate },
                          { rotate: '25deg' },
                        ],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={[
                        'rgba(255, 255, 255, 0)',
                        'rgba(255, 255, 255, 0.15)',
                        'rgba(255, 255, 255, 0.45)',
                        'rgba(255, 255, 255, 0.15)',
                        'rgba(255, 255, 255, 0)',
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.shimmerGradient}
                    />
                  </Animated.View>

                  {/* Left Badge: Green circle with thick white border & white play icon */}
                  <View style={[styles.actionBadgeRing, { backgroundColor: '#02A85B' }]}>
                    <View style={{ marginLeft: 2 }}>
                      <PlayIcon size={16} color="#FFFFFF" />
                    </View>
                  </View>

                  <View style={styles.actionCardContent}>
                    <Text
                      style={styles.actionCardTitle}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.85}
                    >
                      {strings.starline || 'स्टारलाइन'}
                    </Text>
                    <Text
                      style={styles.actionCardSubtitle}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.75}
                    >
                      {strings.starline_sub || 'Play Starline Market'}
                    </Text>
                  </View>

                  <ChevronRight size={14} color="#FFFFFF" />
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* 4. GALI DESAWAR */}
          <Animated.View
            style={[
              styles.actionCardTouch,
              { transform: [{ translateY: floatCardsAnim }, { scale: scaleCardsAnim }] },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              style={{ flex: 1 }}
              onPress={() => props.navigation.navigate('GaliDesawarScreen')}
            >
              <View style={[styles.actionCardBevel, { backgroundColor: '#0C1B6E' }]}>
                <LinearGradient
                  colors={['#2A5CE8', '#2047D4', '#1632B5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.actionCardGradient}
                >
                  {/* Permanent Diagonal Glass Reflection */}
                  <View pointerEvents="none" style={styles.cardPermanentGlass}>
                    <LinearGradient
                      colors={[
                        'rgba(255, 255, 255, 0)',
                        'rgba(255, 255, 255, 0.08)',
                        'rgba(255, 255, 255, 0.28)',
                        'rgba(255, 255, 255, 0.08)',
                        'rgba(255, 255, 255, 0)',
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.cardPermanentGlassGradient}
                    />
                  </View>

                  {/* Animated Shimmer Beam */}
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.shimmerBeam,
                      {
                        transform: [
                          { translateX: shimmerTranslate },
                          { rotate: '25deg' },
                        ],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={[
                        'rgba(255, 255, 255, 0)',
                        'rgba(255, 255, 255, 0.15)',
                        'rgba(255, 255, 255, 0.45)',
                        'rgba(255, 255, 255, 0.15)',
                        'rgba(255, 255, 255, 0)',
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.shimmerGradient}
                    />
                  </Animated.View>

                  {/* Left Badge: Royal Blue circle with thick white border & white play icon */}
                  <View style={[styles.actionBadgeRing, { backgroundColor: '#2A5CE8' }]}>
                    <View style={{ marginLeft: 2 }}>
                      <PlayIcon size={16} color="#FFFFFF" />
                    </View>
                  </View>

                  <View style={styles.actionCardContent}>
                    <Text
                      style={styles.actionCardTitle}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.85}
                    >
                      {strings.gali_desawar || 'गली देसावर'}
                    </Text>
                    <Text
                      style={styles.actionCardSubtitle}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.75}
                    >
                      {strings.gali_desawar_sub || 'Play Disawar Market'}
                    </Text>
                  </View>

                  <ChevronRight size={14} color="#FFFFFF" />
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* ADMIN CONTROLLED SPECIAL OFFER BANNER CARD */}
      {(appSetting.offer_status === '1' || appSetting.offer_status === 1) && (appSetting.offer_title || appSetting.offer_image) ? (
        <TouchableOpacity
          activeOpacity={0.85}
          style={{ marginHorizontal: 16, marginTop: 12, marginBottom: 4, borderRadius: 14, overflow: 'hidden', borderWidth: 1.2, borderColor: '#F59E0B' }}
          onPress={() => {
            const action = appSetting.offer_btn_action || 'deposit';
            if (action === 'deposit') {
              props.navigation.navigate('AddFund');
            } else if (action === 'whatsapp' && appSetting.whatsapp_number) {
              Linking.openURL(`whatsapp://send?phone=${appSetting.whatsapp_number}&text=Hello`);
            } else if (action === 'telegram' && appSetting.telegram_link) {
              Linking.openURL(appSetting.telegram_link);
            }
          }}
        >
          {appSetting.offer_image ? (
            <Image source={{ uri: appSetting.offer_image }} style={{ width: '100%', height: 115 }} resizeMode="cover" />
          ) : (
            <LinearGradient colors={['#9A3412', '#C2410C', '#D97706']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 14, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <GiftIcon size={24} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: '#FFFFFF', marginBottom: 2 }}>{appSetting.offer_title || strings.special_offer || '🔥 स्पेशल ऑफर!'}</Text>
                {appSetting.offer_description ? (
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#FEF3C7' }} numberOfLines={2}>{appSetting.offer_description}</Text>
                ) : null}
              </View>
              <View style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginLeft: 8 }}>
                <Text style={{ fontSize: 11, fontWeight: '900', color: '#9A3412' }}>{appSetting.offer_btn_text || strings.add_money || 'पैसे जोड़ें'}</Text>
              </View>
            </LinearGradient>
          )}
        </TouchableOpacity>
      ) : null}

      {/* ADMIN CONTROLLED PROMOTIONAL AD BANNER */}
      {appSetting.ad_status === '1' && (appSetting.ad_image || appSetting.ad_title) ? (
        <TouchableOpacity
          activeOpacity={0.85}
          style={{ marginHorizontal: 16, marginVertical: 8, borderRadius: 10, overflow: 'hidden', backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#334155' }}
          onPress={() => {
            if (appSetting.ad_link) {
              if (appSetting.ad_link === 'deposit') {
                props.navigation.navigate('AddFund');
              } else if (appSetting.ad_link.startsWith('http')) {
                Linking.openURL(appSetting.ad_link);
              }
            }
          }}
        >
          {appSetting.ad_image ? (
            <Image source={{ uri: appSetting.ad_image }} style={{ width: '100%', height: 110 }} resizeMode="cover" />
          ) : (
            <LinearGradient colors={['#1E293B', '#0F172A']} style={{ padding: 14, alignItems: 'center' }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#F59E0B', marginBottom: 4 }}>{appSetting.ad_title}</Text>
              {appSetting.ad_description ? (
                <Text style={{ fontSize: 12, color: '#94A3B8', textAlign: 'center' }}>{appSetting.ad_description}</Text>
              ) : null}
            </LinearGradient>
          )}
        </TouchableOpacity>
      ) : null}

      {/* SECTION TITLE: TODAY'S MARKETS WITH VIEW ALL BUTTON (FIXED AT TOP) */}
      <View style={styles.sectionHeaderRow}>
        <View>
          <Text style={styles.sectionTitle}>{strings.todays_markets || "TODAY'S MARKETS"}</Text>
          <View style={styles.sectionAccentLine} />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.viewAllBtn}
          onPress={() => props.navigation.navigate('MarketRate')}
        >
          <Text style={styles.viewAllText}>{strings.view_all || 'View All ›'}</Text>
        </TouchableOpacity>
      </View>



      <FlatList
        style={{ flex: 1 }}
        data={homeData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || item.market_name}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 + bottomInset, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyContainer}>
              <Loading />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{strings.no_market_available || 'No Markets Available'}</Text>
              <TouchableOpacity activeOpacity={0.8} style={styles.retryBtn} onPress={get_data}>
                <Text style={styles.retryBtnText}>{strings.refresh || 'Refresh'}</Text>
              </TouchableOpacity>
            </View>
          )
        }
      />
      </View>

      {/* BOTTOM NAVIGATION BAR */}
      <View
        style={[
          styles.bottomNavContainer,
          {
            paddingBottom: bottomInset,
            height: 64 + bottomInset,
          },
        ]}
      >
        {/* 1. My Bids */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.bottomNavItem}
          onPress={() => props.navigation.navigate('BidHistory')}
        >
          <NavHistoryIcon size={25} color="#FFFFFF" />
          <Text style={styles.bottomNavLabel}>{strings.nav_my_bids || 'मेरी बिड्स'}</Text>
        </TouchableOpacity>

        {/* 2. Wallet */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.bottomNavItem}
          onPress={() => props.navigation.navigate('Wallet')}
        >
          <NavWalletIcon size={25} color="#FFFFFF" />
          <Text style={styles.bottomNavLabel}>{strings.nav_wallet || 'वॉलेट'}</Text>
        </TouchableOpacity>

        {/* 3. Center Elevated Home */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.centerHomeBtnContainer}
          onPress={() => onRefresh()}
        >
          <Animated.View
            style={[
              styles.centerHomeCircle,
              { transform: [{ translateY: floatHomeAnim }] },
            ]}
          >
            <NavHomeIcon size={29} color="#F2B83B" />
          </Animated.View>
          <Text style={styles.centerHomeLabel}>{strings.nav_home || 'Home'}</Text>
        </TouchableOpacity>

        {/* 4. Passbook */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.bottomNavItem}
          onPress={() => props.navigation.navigate('Passbook')}
        >
          <NavPassbookIcon size={25} color="#FFFFFF" />
          <Text style={styles.bottomNavLabel}>{strings.nav_passbook || 'पासबुक'}</Text>
        </TouchableOpacity>

        {/* 5. Support */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.bottomNavItem}
          onPress={() => props.navigation.navigate('SupportChatScreen')}
        >
          <NavSupportIcon size={25} color="#FFFFFF" />
          <Text style={styles.bottomNavLabel}>{strings.nav_support || 'सपोर्ट'}</Text>
        </TouchableOpacity>
      </View>

      {/* WELCOME BONUS / OFFER POPUP MODAL */}
      <Modal
        visible={Boolean(showBonusModal && String(appSetting?.offer_status) === '1')}
        transparent={true}
        animationType="fade"
        onRequestClose={handleDismissBonusModal}
      >
        <View style={styles.bonusModalBackdrop}>
          <View style={styles.bonusModalCard}>
            {/* Top Right Floating Close Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.bonusCloseBtn}
              onPress={handleDismissBonusModal}
            >
              <CloseIcon size={18} color="#701A1E" />
            </TouchableOpacity>

            {/* Gradient Top Header */}
            <LinearGradient
              colors={['#D97706', '#C2410C', '#991B1B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bonusGradientHeader}
            >
              <Text style={styles.bonusSparklesText}>✦ {strings.special_offer || 'स्पेशल ऑफर'} ✦</Text>

              {/* Gift Icon / Offer Image Badge */}
              <View style={styles.bonusGiftCircle}>
                {appSetting?.offer_image ? (
                  <Image source={{ uri: appSetting.offer_image }} style={{ width: 44, height: 44, borderRadius: 22 }} />
                ) : (
                  <GiftIcon size={34} color="#FFFFFF" />
                )}
              </View>

              <Text style={styles.bonusMainTitle}>{appSetting?.offer_title || strings.special_offer || '✦ स्पेशल ऑफर ✦'}</Text>
              {appSetting?.offer_description ? (
                <Text style={styles.bonusSubtitle}>
                  {appSetting.offer_description}
                </Text>
              ) : null}
            </LinearGradient>

            {/* Bottom White Card Section */}
            <View style={styles.bonusBottomSection}>
              <View style={styles.bonusAmountInnerCard}>
                <Text style={styles.bonusAmountLabel}>{strings.wallet_balance || 'वॉलेट बैलेंस'}</Text>
                <Text style={styles.bonusAmountValue}>₹{userData?.wallet || 0}</Text>
                <Text style={styles.bonusAmountNote}>
                  {strings.bonus_note || 'बेस्ट ऑफर का लाभ उठाएं और गेम खेलें'}
                </Text>
              </View>

              {/* Action Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.bonusActionBtn}
                onPress={handleDismissBonusModal}
              >
                <View style={styles.bonusActionDivider} />
                <Text style={styles.bonusActionText}>{appSetting?.offer_btn_text || strings.add_money || 'पैसे जोड़ें'}</Text>
                <View style={styles.bonusActionDivider} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ANNOUNCEMENT / NOTICE POPUP MODAL */}
      <Modal
        visible={showPopupModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleDismissPopupModal}
      >
        <View style={styles.bonusModalBackdrop}>
          <View style={styles.bonusModalCard}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.bonusCloseBtn}
              onPress={handleDismissPopupModal}
            >
              <CloseIcon size={18} color="#701A1E" />
            </TouchableOpacity>

            <LinearGradient
              colors={['#1E3A8A', '#1D4ED8', '#0F172A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bonusGradientHeader}
            >
              <Text style={styles.bonusSparklesText}>📢 {strings.drawer_notice || 'सूचना'} 📢</Text>
              <Text style={styles.bonusMainTitle}>{appSetting.popup_title || strings.special_notice || 'विशेष सूचना'}</Text>
            </LinearGradient>

            <View style={styles.bonusBottomSection}>
              {appSetting.popup_image ? (
                <Image source={{ uri: appSetting.popup_image }} style={{ width: '100%', height: 140, borderRadius: 8, marginBottom: 12 }} resizeMode="cover" />
              ) : null}
              <Text style={{ fontSize: 14, color: '#334155', textAlign: 'center', marginVertical: 10, lineHeight: 20 }}>
                {appSetting.popup_message || strings.popup_default_msg || 'आपकी सेवा में सदैव तत्पर!'}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.bonusActionBtn, { backgroundColor: '#1D4ED8' }]}
                onPress={handleDismissPopupModal}
              >
                <Text style={styles.bonusActionText}>{appSetting.popup_btn_text || strings.next || 'आगे बढ़ें'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* BIDDING CLOSED MODAL (Screenshot 1) */}
      <Modal
        visible={closedMarketModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setClosedMarketModal(false)}
      >
        <View style={styles.closedModalBackdrop}>
          <View style={styles.closedModalCard}>
            {/* Top Rose/Pink Header */}
            <View style={styles.closedModalHeader}>
              <View style={styles.hourglassBadge}>
                <HourglassRedIcon size={24} color="#DC2626" />
              </View>

              <View style={styles.closedHeaderTitleCol}>
                <Text style={styles.closedMainTitle}>
                  {strings.closed_title || 'Bidding is closed for today'}
                </Text>
                <Text style={styles.closedMarketName}>
                  {selectedClosedMarket?.market_name || 'Bhau Bazar'}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.closedCloseBtn}
                onPress={() => setClosedMarketModal(false)}
              >
                <CloseIcon size={22} color="#DC2626" />
              </TouchableOpacity>
            </View>

            {/* Body Content */}
            <View style={styles.closedModalBody}>
              {/* OPEN SECTION */}
              <View style={styles.statusPillWrap}>
                <View style={styles.statusRedPill}>
                  <Text style={styles.statusRedPillText}>{strings.open_pill || 'OPEN'}</Text>
                </View>
              </View>

              {/* Row 1: Open Result Time */}
              <View style={styles.timeInfoRow}>
                <View style={styles.timeIconBadge}>
                  <CalendarRedIcon size={18} color="#DC2626" />
                </View>
                <View style={styles.timeTextCol}>
                  <Text style={styles.timeLabel}>{strings.open_result_time || 'Open Result Time'}</Text>
                  <Text style={styles.timeValue}>
                    {selectedClosedMarket?.open_time || '10:30 AM'}
                  </Text>
                </View>
              </View>

              {/* Row 2: Open Bid Last Time */}
              <View style={styles.timeInfoRow}>
                <View style={styles.timeIconBadge}>
                  <AlarmClockRedIcon size={18} color="#DC2626" />
                </View>
                <View style={styles.timeTextCol}>
                  <Text style={styles.timeLabel}>{strings.open_bid_last || 'Open Bid Last Time'}</Text>
                  <Text style={styles.timeValue}>
                    {selectedClosedMarket?.open_time || '10:30 AM'}
                  </Text>
                </View>
              </View>

              <View style={styles.closedDivider} />

              {/* CLOSE SECTION */}
              <View style={styles.statusPillWrap}>
                <View style={styles.statusRedPill}>
                  <Text style={styles.statusRedPillText}>{strings.close_pill || 'CLOSE'}</Text>
                </View>
              </View>

              {/* Row 3: Close Result Time */}
              <View style={styles.timeInfoRow}>
                <View style={styles.timeIconBadge}>
                  <CalendarRedIcon size={18} color="#DC2626" />
                </View>
                <View style={styles.timeTextCol}>
                  <Text style={styles.timeLabel}>{strings.close_result_time || 'Close Result Time'}</Text>
                  <Text style={styles.timeValue}>
                    {selectedClosedMarket?.close_time || '11:30 AM'}
                  </Text>
                </View>
              </View>

              {/* Row 4: Close Bid Last Time */}
              <View style={styles.timeInfoRow}>
                <View style={styles.timeIconBadge}>
                  <ClockCrossedRedIcon size={18} color="#DC2626" />
                </View>
                <View style={styles.timeTextCol}>
                  <Text style={styles.timeLabel}>{strings.close_bid_last || 'Close Bid Last Time'}</Text>
                  <Text style={styles.timeValue}>
                    {selectedClosedMarket?.close_time || '11:30 AM'}
                  </Text>
                </View>
              </View>

              {/* Red OK Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.closedOkBtnTouch}
                onPress={() => setClosedMarketModal(false)}
              >
                <LinearGradient
                  colors={['#EF4444', '#DC2626', '#B91C1C']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.closedOkGradient}
                >
                  <Text style={styles.closedOkBtnText}>{strings.ok_btn || 'OK'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061224',
  },
  bodyWrapper: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  headerBar: {
    backgroundColor: '#061224',
    minHeight: 56,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  menuCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2B048',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#E2B048',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2B048',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(226, 176, 72, 0.08)',
    marginRight: 10,
  },
  walletText: {
    color: '#E2B048',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 2,
  },
  bellBtn: {
    padding: 4,
  },
  tickerBar: {
    backgroundColor: '#FFF8EC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#EBDDC5',
  },
  tickerItem: {
    flexDirection: 'row',

  },
  tickerText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1F1A13',
    letterSpacing: 0.3,

  },
  tickerDivider: {
    width: 1.5,
    height: 14,
    backgroundColor: '#9E6833',
    marginHorizontal: 7,
    borderRadius: 1,
  },
  marqueeWrapper: {
    backgroundColor: '#061224',
    paddingVertical: 4,
  },
  actionGrid: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  actionCardTouch: {
    width: (screenWidth - 28) / 2,
    height: 59,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  actionCardBevel: {
    flex: 1,
    borderRadius: 18,
    paddingBottom: 4.5,
  },
  actionCardGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 7,
    paddingRight: 8,
    borderRadius: 17,
    borderTopWidth: 1.2,
    borderTopColor: 'rgba(255, 255, 255, 0.45)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.12)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.12)',
    borderBottomWidth: 0,
    overflow: 'hidden',
  },
  cardPermanentGlass: {
    position: 'absolute',
    top: -20,
    bottom: -20,
    right: 8,
    width: 38,
    transform: [{ rotate: '25deg' }],
    zIndex: 4,
  },
  cardPermanentGlassGradient: {
    flex: 1,
    width: '100%',
  },
  actionBadgeWhite: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  actionRupeeText: {
    fontSize: 24,
    fontWeight: '900',
    includeFontPadding: false,
    textAlign: 'center',
  },
  actionBadgeRing: {
    width: 40,
    height: 40,
    borderRadius: 22,
    borderWidth: 3.5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  actionCardContent: {
    flex: 1,
    marginLeft: 7,
    marginRight: 2,
    justifyContent: 'center',
  },
  actionCardTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.1,
  },
  actionCardSubtitle: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 9.6,
    fontWeight: '600',
    marginTop: 2,
  },
  shimmerBeam: {
    position: 'absolute',
    top: -30,
    bottom: -30,
    width: 60,
    zIndex: 6,
  },
  shimmerGradient: {
    flex: 1,
    width: '100%',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginTop: 10,
    marginBottom: 8,
  },
  viewAllBtn: {
    backgroundColor: '#08172E',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  viewAllText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  sectionHeader: {
    paddingHorizontal: 14,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#061224',
    letterSpacing: 0.5,
  },
  sectionAccentLine: {
    width: 45,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#1E88E5',
    marginTop: 4,
  },
  marketCardOuter: {
    marginHorizontal: 12,
    marginBottom: 12,
  },
  marketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: '#C58B24',
    borderWidth: 1,
    borderColor: '#EFEAE1',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  marketTimingStrip: {
    backgroundColor: '#FBF7F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEAE1',
  },
  timingText: {
    fontSize: 12,
    color: '#5C4A3A',
    fontWeight: '500',
  },
  timingValue: {
    color: '#1A1A1A',
    fontWeight: '700',
  },
  marketBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  chartCol: {
    alignItems: 'center',
    width: 70,
  },
  chartCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#061224',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#261C14',
    marginTop: 5,
  },
  infoCol: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  marketName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#061224',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  marketResult: {
    fontSize: 19,
    fontWeight: '800',
    color: '#D90429',
    marginVertical: 4,
    letterSpacing: 0.5,
  },
  marketStatusPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    marginTop: 2,
  },
  marketStatusText: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  actionBtnCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#061224',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#07152B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    elevation: 16,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  bottomNavLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
    letterSpacing: 0.1,
  },
  centerHomeBtnContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    top: -15,
  },
  centerHomeCircle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#07152B',
    borderWidth: 3.5,
    borderColor: '#15253E',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  centerHomeLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 3,
    letterSpacing: 0.2,
  },
  bonusModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  bonusModalCard: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  bonusCloseBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  bonusGradientHeader: {
    paddingTop: 24,
    paddingBottom: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  bonusSparklesText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  bonusGiftCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  bonusMainTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  bonusSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.92)',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  bonusBottomSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 20,
  },
  bonusAmountInnerCard: {
    backgroundColor: '#FFFDF9',
    borderWidth: 1.5,
    borderColor: '#E8C582',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  bonusAmountLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#701A1E',
  },
  bonusAmountValue: {
    fontSize: 38,
    fontWeight: '900',
    color: '#701A1E',
    marginVertical: 4,
    fontFamily: 'serif',
  },
  bonusAmountNote: {
    fontSize: 12.5,
    color: '#4B5563',
    textAlign: 'center',
    fontWeight: '500',
  },
  bonusActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  bonusActionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  bonusActionText: {
    marginHorizontal: 12,
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: 0.3,
  },

  // Bidding Closed Modal styles (Screenshot 1)
  closedModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closedModalCard: {
    width: screenWidth * 0.9,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  closedModalHeader: {
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hourglassBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#E11D48',
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  closedHeaderTitleCol: {
    flex: 1,
    marginLeft: 14,
  },
  closedMainTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#BE123C',
  },
  closedMarketName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 3,
  },
  closedCloseBtn: {
    padding: 6,
  },
  closedModalBody: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 22,
  },
  statusPillWrap: {
    alignItems: 'center',
    marginBottom: 12,
  },
  statusRedPill: {
    borderWidth: 1.5,
    borderColor: '#DC2626',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 3,
  },
  statusRedPillText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#DC2626',
    letterSpacing: 0.5,
  },
  timeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  timeTextCol: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  timeValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  closedDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  closedOkBtnTouch: {
    marginTop: 16,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#DC2626',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  closedOkGradient: {
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closedOkBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 14,
  },
  retryBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E2B048',
  },
  retryBtnText: {
    color: '#E2B048',
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});