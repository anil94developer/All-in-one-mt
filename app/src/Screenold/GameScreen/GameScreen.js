/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  Alert,
  Dimensions,
  RefreshControl,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../Widget/Header';
import { useLanguage } from '../../context/LanguageContext';
import { getApiCall } from '../../services/AppSetting';
import { base, domainUrl } from '../../config/appConfig';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

// Built-in icon mappings for fast visual rendering
const LOCAL_ICONS = {
  'sd.png': require('../../assets/image/sd.png'),
  'jodi.png': require('../../assets/image/jodi.png'),
  'sp.png': require('../../assets/image/sp.png'),
  'dp.png': require('../../assets/image/dp.png'),
  'tp.png': require('../../assets/image/tp.png'),
  'half.png': require('../../assets/image/half.png'),
  'full.png': require('../../assets/image/full.png'),
  'Single Digit': require('../../assets/image/sd.png'),
  'Jodi Digit': require('../../assets/image/jodi.png'),
  'Single Pana': require('../../assets/image/sp.png'),
  'Double Pana': require('../../assets/image/dp.png'),
  'Triple Pana': require('../../assets/image/tp.png'),
  'Half Sangam': require('../../assets/image/half.png'),
  'Full Sangam': require('../../assets/image/full.png'),
  'SP Motor': require('../../assets/image/sp.png'),
  'DP Motor': require('../../assets/image/dp.png'),
  'TP Motor': require('../../assets/image/tp.png'),
  'Cycle Pana': require('../../assets/image/sp.png'),
  'Family Pana': require('../../assets/image/dp.png'),
  'Red Bracket': require('../../assets/image/jodi.png'),
};

export default function GameScreen(props) {
  const { strings } = useLanguage();
  const selectItem = props.route?.params?.selectItem || {};

  // Fully dynamic game types list loaded from backend API
  const [gameList, setGameList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [, setTick] = useState(Date.now());

  // Subtle pulsing animation for live session indicator
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.45,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Convert 12-hour AM/PM or 24-hour time string into epoch seconds for today
  const timeConvert = (timeStr) => {
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
  };

  // Evaluate market open/close timing
  const getMarketTiming = useCallback(() => {
    const current = Math.floor(Date.now() / 1000);
    const openTime = timeConvert(selectItem?.open_time);
    const closeTime = timeConvert(selectItem?.close_time);

    let isBeforeOpen = true;
    if (selectItem?.open_status !== undefined && selectItem?.open_status !== null) {
      isBeforeOpen = Boolean(selectItem.open_status);
    } else if (openTime > 0) {
      isBeforeOpen = current < openTime;
    }

    let isClosed = false;
    if (
      selectItem?.market_status === 'closed' ||
      selectItem?.market_status === '0' ||
      selectItem?.is_running === false
    ) {
      isClosed = true;
    } else if (selectItem?.close_status !== undefined && selectItem?.close_status !== null) {
      isClosed = !selectItem.close_status && !isBeforeOpen;
    } else if (closeTime > 0) {
      isClosed = current > closeTime;
    }

    return { isBeforeOpen, isClosed, openTime, closeTime };
  }, [selectItem]);

  const { isBeforeOpen, isClosed } = getMarketTiming();

  const fetchGameTypes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getApiCall(base.getGameType);
      const list = res?.data?.game_type || res?.data || res?.game_type;
      if (Array.isArray(list)) {
        const activeGames = list
          .filter(item => String(item.status) === '1' || item.status === 1 || item.status === true)
          .map(item => {
            const img = item.image_url || item.image;
            let resolvedImage;
            if (typeof img === 'string') {
              if (img.startsWith('http')) {
                resolvedImage = { uri: img };
              } else if (img.startsWith('/uploads') || img.startsWith('uploads')) {
                resolvedImage = { uri: `${domainUrl}/${img.replace(/^\//, '')}` };
              } else if (LOCAL_ICONS[img] || LOCAL_ICONS[item.type] || LOCAL_ICONS[item.name]) {
                resolvedImage = LOCAL_ICONS[img] || LOCAL_ICONS[item.type] || LOCAL_ICONS[item.name];
              } else {
                resolvedImage = { uri: `${domainUrl}/uploads/gametypes/${img}` };
              }
            } else {
              resolvedImage = LOCAL_ICONS[item.type] || LOCAL_ICONS[item.name] || require('../../assets/image/sd.png');
            }

            return {
              id: String(item.id),
              name: item.name || item.type,
              type: item.type || item.name,
              rate: item.rate || '₹10 ➔ 95',
              image: resolvedImage,
              allowed_session: item.allowed_session || 'both',
            };
          });

        setGameList(activeGames);
      }
    } catch (err) {
      console.log('Error fetching game types:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGameTypes();
  }, [fetchGameTypes]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTick(Date.now());
    fetchGameTypes().finally(() => {
      setRefreshing(false);
    });
  }, [fetchGameTypes]);

  const isGameOpenOnly = (item) => {
    if (item.allowed_session === 'open') return true;
    if (item.allowed_session === 'both') return false;
    const name = String(item.name || item.type || '').toLowerCase();
    return name.includes('jodi') || name.includes('sangam') || name.includes('bracket');
  };

  const _goBack = () => {
    props.navigation.goBack();
  };

  const getLocalizedName = (name) => {
    if (name === 'Single Digit') return strings.single_digit || 'Single Digit';
    if (name === 'Jodi Digit') return strings.jodi_digit || 'Jodi Digit';
    if (name === 'Single Pana') return strings.single_pana || 'Single Pana';
    if (name === 'Double Pana') return strings.double_pana || 'Double Pana';
    if (name === 'Triple Pana') return strings.triple_pana || 'Triple Pana';
    if (name === 'Half Sangam') return strings.half_sangam || 'Half Sangam';
    if (name === 'Full Sangam') return strings.full_sangam || 'Full Sangam';

    // Motor options
    if (name === 'SP Motor') return strings.sp_motor || 'SP Motor';
    if (name === 'DP Motor') return strings.dp_motor || 'DP Motor';
    if (name === 'TP Motor') return strings.tp_motor || 'TP Motor';

    // Additional options
    if (name === 'SP') return strings.sp || 'SP';
    if (name === 'DP') return strings.dp || 'DP';
    if (name === 'TP') return strings.tp || 'TP';
    if (name === 'Single') return strings.single || 'Single';
    if (name === 'Jodi') return strings.jodi || 'Jodi';
    if (name === 'Cycle Pana') return strings.cycle_pana || 'Cycle Pana';
    if (name === 'Family Pana') return strings.family_pana || 'Family Pana';
    if (name === 'Red Bracket') return strings.red_bracket || 'Red Bracket';
    if (name === 'Motor Pana') return strings.motor_pana || 'Motor Pana';

    return name;
  };

  const marketTitle =
    selectItem?.market_name ||
    selectItem?.games_name ||
    selectItem?.game_name ||
    strings.play_game ||
    'Play Game';

  const marketResult =
    selectItem?.result ||
    selectItem?.last_result ||
    selectItem?.result_text ||
    '***-**-***';

  const handleGamePress = (item) => {
    if (isClosed) {
      Alert.alert(
        strings.market_closed || 'Market Closed',
        `${marketTitle} is currently closed. Opens at ${selectItem?.open_time || 'scheduled time'}.`
      );
      return;
    }

    const isOpenOnlyGame = isGameOpenOnly(item);
    if (!isBeforeOpen && isOpenOnlyGame) {
      Alert.alert(
        'Session Closed',
        `${item.name} is only available during the Open session. Please choose Single Digit or Pana games for the Close session.`
      );
      return;
    }

    const sessionType = isBeforeOpen ? 'Open' : 'Close';

    props.navigation.navigate('BidScreen', {
      details: {
        ...item,
        type: sessionType,
      },
      selectItem,
      status: isBeforeOpen,
    });
  };

  const renderItem = ({ item }) => {
    const isOpenOnlyGame = isGameOpenOnly(item);
    const isDisabledInCloseSession = !isBeforeOpen && !isClosed && isOpenOnlyGame;

    return (

      <TouchableOpacity
        onPress={() => handleGamePress(item)}
        style={[styles.card, isDisabledInCloseSession && styles.cardDimmed]}
        activeOpacity={0.82}
      >
        {/* Card Header Strip: Rate Badge */}
        <View style={styles.cardHeaderRow}>
          <View style={styles.rateChip}>
            <Text style={styles.rateChipText}>{item.rate}</Text>
          </View>
          {isDisabledInCloseSession ? (
            <View style={styles.sessionStatusChipLocked}>
              <Text style={styles.sessionStatusChipLockedText}>LOCKED</Text>
            </View>
          ) : isClosed ? (
            <View style={styles.sessionStatusChipClosed}>
              <Text style={styles.sessionStatusChipClosedText}>CLOSED</Text>
            </View>
          ) : (
            <View style={styles.sessionStatusChipLive}>
              <Text style={styles.sessionStatusChipLiveText}>
                {isBeforeOpen ? 'OPEN' : 'CLOSE'}
              </Text>
            </View>
          )}
        </View>

        {/* Center Artwork with Glowing Pedestal */}
        <View style={styles.badgePedestal}>
          <Image source={item.image} style={styles.image} resizeMode="contain" />
        </View>

        {/* Game Title */}
        <Text style={styles.gameName} numberOfLines={1}>
          {getLocalizedName(item.name)}
        </Text>

        {/* Action Button Strip */}
        {/* <View style={styles.actionBtnWrap}>
          {isClosed ? (
            <View style={styles.btnClosed}>
              <Text style={styles.btnClosedText}>CLOSED</Text>
            </View>
          ) : isDisabledInCloseSession ? (
            <View style={styles.btnLocked}>
              <Text style={styles.btnLockedText}>OPEN ONLY</Text>
            </View>
          ) : (
            <LinearGradient
              colors={
                isBeforeOpen
                  ? ['#E2B048', '#C58B24', '#9E6813']
                  : ['#F59E0B', '#D97706', '#B45309']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btnPlay}
            >
              <Text style={styles.btnPlayText}>
                {isBeforeOpen ? 'PLAY NOW ›' : 'CLOSE BID ›'}
              </Text>
            </LinearGradient>
          )}
        </View> */}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />
      <Header
        leftButtonType="back"
        title={marketTitle}
        leftButtonAction={_goBack}
        rightButttonType="refresh"
        refresh={onRefresh}
      />

      {/* Luxury Hero Market Banner */}
      <View style={styles.heroOuter}>
        <LinearGradient
          colors={['#0F213E', '#09162A', '#050D1A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          {/* Top Row: Title, Result, Session Status */}
          <View style={styles.heroTopRow}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.heroMarketTitle} numberOfLines={1}>
                {marketTitle}
              </Text>
              <View style={styles.resultBadge}>
                <Text style={styles.resultBadgeText}>{marketResult}</Text>
              </View>
            </View>

            {/* Live Session Status Pill with Pulsing Dot */}
            <View
              style={[
                styles.liveStatusBadge,
                {
                  backgroundColor: isClosed
                    ? 'rgba(239, 68, 68, 0.16)'
                    : isBeforeOpen
                      ? 'rgba(16, 185, 129, 0.16)'
                      : 'rgba(245, 158, 11, 0.16)',
                  borderColor: isClosed
                    ? '#EF4444'
                    : isBeforeOpen
                      ? '#10B981'
                      : '#F59E0B',
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.statusPulseDot,
                  {
                    opacity: pulseAnim,
                    backgroundColor: isClosed
                      ? '#EF4444'
                      : isBeforeOpen
                        ? '#10B981'
                        : '#F59E0B',
                  },
                ]}
              />
              <Text
                style={[
                  styles.liveStatusText,
                  {
                    color: isClosed
                      ? '#EF4444'
                      : isBeforeOpen
                        ? '#10B981'
                        : '#F59E0B',
                  },
                ]}
              >
                {isClosed
                  ? 'CLOSED'
                  : isBeforeOpen
                    ? 'OPEN SESSION'
                    : 'CLOSE SESSION'}
              </Text>
            </View>
          </View>

          {/* Bottom Row: Open & Close Timings */}
          <View style={styles.heroTimingStrip}>
            <View style={styles.timingCol}>
              <Text style={styles.timingLabel}>{strings.open_label || 'Open'}</Text>
              <Text style={styles.timingValue}>{selectItem?.open_time || '—'}</Text>
            </View>
            <View style={styles.timingDivider} />
            <View style={styles.timingCol}>
              <Text style={styles.timingLabel}>{strings.close_label || 'Close'}</Text>
              <Text style={styles.timingValue}>{selectItem?.close_time || '—'}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Quick Security & Trust Ticker */}
      <View style={styles.quickTicker}>
        <Text style={styles.tickerItemText}>⚡ Instant Bids</Text>
        <Text style={styles.tickerDot}>•</Text>
        <Text style={styles.tickerItemText}>💰 100% Secure</Text>
        <Text style={styles.tickerDot}>•</Text>
        <Text style={styles.tickerItemText}>🏆 Fast Payouts</Text>
      </View>

      {/* Game Types Grid */}
      <View style={styles.contentWrapper}>
        {loading && gameList.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#D4AF37" />
            <Text style={styles.loadingText}>Loading Games...</Text>
          </View>
        ) : gameList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎲</Text>
            <Text style={styles.emptyTitle}>No Games Available</Text>
            <Text style={styles.emptySubtitle}>Pull down to refresh or check back later</Text>
            <TouchableOpacity onPress={onRefresh} style={styles.emptyRetryBtn}>
              <Text style={styles.emptyRetryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={gameList}
            keyExtractor={(item, index) => (item?.id ? String(item.id) : String(index))}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={styles.rowWrapper}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#D4AF37"
                colors={['#D4AF37', '#061224']}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061224',
  },
  heroOuter: {
    marginHorizontal: 12,
    marginTop: 6,
    marginBottom: 4,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: 'rgba(226, 176, 72, 0.38)',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  heroGradient: {
    padding: 14,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  heroMarketTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#E2B048',
    letterSpacing: 0.5,
  },
  resultBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
    borderWidth: 0.8,
    borderColor: 'rgba(226, 176, 72, 0.25)',
  },
  resultBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  liveStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1.2,
  },
  statusPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  liveStatusText: {
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  heroTimingStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  timingCol: {
    flex: 1,
    alignItems: 'center',
  },
  timingLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  timingValue: {
    fontSize: 13.5,
    color: '#F8FAFC',
    fontWeight: '800',
    marginTop: 1,
  },
  timingDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  quickTicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    backgroundColor: '#07152B',
  },
  tickerItemText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E2B048',
    letterSpacing: 0.2,
  },
  tickerDot: {
    color: '#64748B',
    marginHorizontal: 8,
    fontSize: 10,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#F3F4F8',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
  },
  listContainer: {
    paddingBottom: 28,
  },
  rowWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    borderWidth: 1.2,
    borderColor: '#EFE7DA',
  },
  cardDimmed: {
    opacity: 0.72,
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  rateChip: {
    backgroundColor: '#FFF8EC',
    borderWidth: 1,
    borderColor: '#E8C582',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rateChipText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#8A5308',
    letterSpacing: 0.2,
  },
  sessionStatusChipLive: {
    backgroundColor: '#ECFDF5',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
  },
  sessionStatusChipLiveText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#059669',
  },
  sessionStatusChipLocked: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
  },
  sessionStatusChipLockedText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
  },
  sessionStatusChipClosed: {
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
  },
  sessionStatusChipClosedText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#DC2626',
  },
  badgePedestal: {
    width: CARD_WIDTH * 0.72,
    height: CARD_WIDTH * 0.72,
    borderRadius: CARD_WIDTH * 0.36,
    backgroundColor: 'rgba(226, 176, 72, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  image: {
    width: CARD_WIDTH * 0.68,
    height: CARD_WIDTH * 0.68,
  },
  gameName: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 4,
    marginBottom: 8,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  actionBtnWrap: {
    width: '100%',
  },
  btnPlay: {
    borderRadius: 12,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#C58B24',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  btnPlayText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  btnLocked: {
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLockedText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  btnClosed: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnClosedText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 70,
  },
  loadingText: {
    color: '#E2B048',
    marginTop: 14,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyRetryBtn: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyRetryText: {
    color: '#061224',
    fontWeight: '800',
    fontSize: 14,
  },
});
