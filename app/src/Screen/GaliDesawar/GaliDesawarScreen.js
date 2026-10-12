/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Animated,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { BackArrow, ChartIcon, PlayIcon } from '../../component/MatkaIcons';
import { useLanguage } from '../../context/LanguageContext';
import { getApiCall } from '../../services/AppSetting';
import { base } from '../../config/appConfig';
import { Dialog } from '../../context/DialogContext';

const { width } = Dimensions.get('window');

// Clock Icon for Chart
const ClockChartIcon = ({ size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Clock bells / feet */}
    <Path d="M5 3L2 6M19 3L22 6M6 19L4 21M18 19L20 21" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
    <Circle cx="12" cy="13" r="8" stroke="#0F172A" strokeWidth="2" />
    <Path d="M12 9V13L14.5 15" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function GaliDesawarScreen(props) {
  const insets = useSafeAreaInsets();
  const { strings } = useLanguage();
  const [markets, setMarkets] = useState([]);
  const [rates, setRates] = useState({ left_digit: 95, right_digit: 95, jodi_digit: 950 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Fetch real games and rates from database
  const fetchMarkets = async (isPullRefresh = false) => {
    if (!isPullRefresh && markets.length === 0) {
      setLoading(true);
    }
    setErrorMsg(null);
    try {
      // 1. Fetch real Gali Desawar games from DB
      const res = await getApiCall(base.galiGames);
      let gameList = [];
      if (Array.isArray(res?.data)) {
        gameList = res.data;
      } else if (Array.isArray(res?.markets)) {
        gameList = res.markets;
      } else if (Array.isArray(res?.games)) {
        gameList = res.games;
      } else if (Array.isArray(res?.result)) {
        gameList = res.result;
      } else if (Array.isArray(res)) {
        gameList = res;
      }

      if (gameList.length > 0) {
        const formatted = gameList.map((m) => {
          const name = m.name || m.game_name || m.market_name || 'Market';
          return {
            ...m,
            id: m.id?.toString() || name,
            name: name,
            game_name: name,
            game_name_hindi: m.game_name_hindi || name,
            open_time: m.open_time || '10:00 AM',
            close_time: m.close_time || '10:00 PM',
            time: m.time || m.open_time || '10:00 AM',
            result: m.result !== undefined && m.result !== null && m.result !== '' ? String(m.result) : '**',
            isOpen: m.isOpen !== undefined ? Boolean(m.isOpen) : (m.market_status === '1' || m.status === 1),
            market_status: m.isOpen ? '1' : '0',
            status: m.status !== undefined ? m.status : 1,
          };
        });
        setMarkets(formatted);
      } else if (res?.message && !Array.isArray(res)) {
        if (markets.length === 0) {
          setErrorMsg(res.message);
        }
      }

      // 2. Fetch real rates from DB
      try {
        const ratesRes = await getApiCall(base.galiRates);
        if (ratesRes && ratesRes.data) {
          setRates(ratesRes.data);
        }
      } catch (rateErr) {
        // rates fallback
      }
    } catch (e) {
      console.log('Error fetching Gali Desawar games:', e);
      if (markets.length === 0) {
        setErrorMsg(e?.message || 'Failed to connect to game server');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
    const unsubscribe = props.navigation?.addListener?.('focus', () => {
      fetchMarkets();
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [props.navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMarkets(true);
  };

  // Marquee ticker animation
  const tickerTranslate = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(tickerTranslate, {
          toValue: -280,
          duration: 9000,
          useNativeDriver: true,
        }),
        Animated.timing(tickerTranslate, {
          toValue: 280,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(tickerTranslate, {
          toValue: 0,
          duration: 9000,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [tickerTranslate]);

  const handleBack = () => {
    if (props.navigation.canGoBack()) {
      props.navigation.goBack();
    } else {
      props.navigation.replace('Drawers', { screen: 'Home' });
    }
  };

  const handleOpenMarket = (market) => {
    if (!market.isOpen) {
      Dialog.show({
        type: 'error',
        text1: 'Market Closed',
        text2: `Bidding for ${market.name || market.game_name} is closed right now.`,
      });
      return;
    }
    props.navigation.navigate('GaliGameTypeScreen', { market });
  };

  const handleOpenChart = (market) => {
    props.navigation.navigate('ChartScreen', {
      games_name: market?.name || market?.game_name || 'FARIDABAD',
      chart_type: 'gali',
      type: 'gali',
    });
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backCircleBtn}
          onPress={handleBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <BackArrow size={20} color="#E2B048" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{strings.gali_desawar_title || strings.tab_gali_desawar || 'GALI DESAWAR'}</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.headerChartBtn}
          onPress={handleOpenChart}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ChartIcon size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* BODY CONTENT WRAPPER */}
      <View style={styles.bodyWrapper}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#E2B048']} />}
      >
        {/* GAME RATES TICKER BAR */}
        <View style={styles.tickerBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.ratesBadge}
            onPress={() => props.navigation.navigate('MarketRate')}
          >
            <Text style={styles.ratesBadgeText}>{strings.game_rates || 'GAME RATES'}</Text>
          </TouchableOpacity>
          <View style={styles.tickerWrapper}>
            <Animated.View style={{ transform: [{ translateX: tickerTranslate }] }}>
              <Text style={styles.tickerText}>
                {`Left Digit: 10 - ${rates.left_digit || 95}  •  Right Digit: 10 - ${rates.right_digit || 95}  •  Jodi Digit: 10 - ${rates.jodi_digit || 950}`}
              </Text>
            </Animated.View>
          </View>
        </View>

        {/* GAME HISTORY & WIN HISTORY BUTTONS */}
        <View style={styles.historyBtnRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.historyBtnTouch}
            onPress={() => props.navigation.navigate('BidHistory', { type: 'gali' })}
          >
            <LinearGradient
              colors={['#0E1B2D', '#1B2C46', '#0E1B2D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.historyBtnGradient}
            >
              <Text style={styles.historyBtnText}>{strings.game_history || 'GAME HISTORY'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.historyBtnTouch}
            onPress={() => props.navigation.navigate('WiningHistory', { type: 'gali' })}
          >
            <LinearGradient
              colors={['#D8B87E', '#C6A15E', '#9C7430']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.historyBtnGradient}
            >
              <Text style={styles.historyBtnText}>{strings.win_history || 'WIN HISTORY'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* LOADING STATE */}
        {loading && markets.length === 0 && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#E2B048" />
            <Text style={styles.loaderText}>Loading live Gali Desawar games...</Text>
          </View>
        )}

        {/* EMPTY / ERROR STATE */}
        {!loading && markets.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>{errorMsg || 'No Gali Desawar markets available right now'}</Text>
            <TouchableOpacity activeOpacity={0.8} style={styles.retryBtn} onPress={() => fetchMarkets(true)}>
              <Text style={styles.retryBtnText}>Tap to Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* MARKETS LIST */}
        {markets.map((market) => {
          const isResultDeclared = market.result !== 'XX' && market.result !== '**';
          return (
            <View key={market.id} style={styles.marketCard}>
              {/* Market Name Title */}
              <Text style={styles.marketName}>{market.name || market.game_name}</Text>

              {/* 3 Columns Row */}
              <View style={styles.cardRow}>
                {/* Column 1: Clock Icon + CHART */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.chartCol}
                  onPress={() => handleOpenChart(market)}
                >
                  <ClockChartIcon size={34} />
                  <Text style={styles.chartLabel}>{strings.chart_title || strings.result_chart || 'CHART'}</Text>
                </TouchableOpacity>

                {/* Column 2: Result Box + Time */}
                <View style={styles.resultCol}>
                  <View
                    style={[
                      styles.resultBox,
                      isResultDeclared ? styles.resultBoxDeclared : styles.resultBoxPending,
                    ]}
                  >
                    <Text style={styles.resultText}>{market.result}</Text>
                  </View>
                  <Text style={styles.timeText}>{market.time}</Text>
                </View>

                {/* Column 3: Play Button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.playCol}
                  onPress={() => handleOpenMarket(market)}
                >
                  <View
                    style={[
                      styles.playCircle,
                      market.isOpen ? styles.playCircleOpen : styles.playCircleClosed,
                    ]}
                  >
                    <View style={{ marginLeft: 3 }}>
                      <PlayIcon size={18} color="#FFFFFF" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061224',
  },
  bodyWrapper: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    backgroundColor: '#061224',
    minHeight: 56,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  backCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2B048',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(226, 176, 72, 0.1)',
    marginRight: 14,
  },
  headerTitle: {
    flex: 1,
    fontSize: 19,
    fontWeight: '800',
    color: '#E2B048',
    letterSpacing: 0.5,
  },
  headerChartBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },
  tickerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  ratesBadge: {
    backgroundColor: '#0A192F',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    marginRight: 10,
    elevation: 2,
  },
  ratesBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  tickerWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  tickerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  historyBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  historyBtnTouch: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 3,
  },
  historyBtnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  historyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  marketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#E8ECF2',
  },
  marketName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  chartCol: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  chartLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000000',
    marginTop: 4,
  },
  resultCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultBox: {
    width: 68,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    elevation: 2,
  },
  resultBoxDeclared: {
    backgroundColor: '#374151',
  },
  resultBoxPending: {
    backgroundColor: '#EF4444',
  },
  resultText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 1,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
  },
  playCol: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  playCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  playCircleOpen: {
    backgroundColor: '#10B981',
  },
  playCircleClosed: {
    backgroundColor: '#E5E7EB',
  },
  loaderContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },
  emptyContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#061224',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2B048',
  },
  retryBtnText: {
    color: '#E2B048',
    fontSize: 14,
    fontWeight: '800',
  },
});
