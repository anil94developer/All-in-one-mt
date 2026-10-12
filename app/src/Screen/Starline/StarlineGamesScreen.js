/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { BackArrow, PlayIcon, RefreshIcon, CalendarClockIcon } from '../../component/MatkaIcons';
import { useLanguage } from '../../context/LanguageContext';

// Clock Icon for Chart
const ClockChartIcon = ({ size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 3L2 6M19 3L22 6M6 19L4 21M18 19L20 21" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
    <Circle cx="12" cy="13" r="8" stroke="#0F172A" strokeWidth="2" />
    <Path d="M12 9V13L14.5 15" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DEFAULT_STARLINE_MARKETS = [
  { id: 's1', time: '9:05 AM', result: '228-2', displayTime: '03:15 PM', isOpen: true },
  { id: 's2', time: '10:05 AM', result: '368-7', displayTime: '03:15 PM', isOpen: true },
  { id: 's3', time: '11:05 AM', result: '559-9', displayTime: '03:15 PM', isOpen: true },
  { id: 's4', time: '12:05 PM', result: '***-*', displayTime: '03:15 PM', isOpen: true },
  { id: 's5', time: '1:05 PM', result: '***-*', displayTime: '03:15 PM', isOpen: true },
  { id: 's6', time: '2:05 PM', result: '***-*', displayTime: '03:15 PM', isOpen: true },
  { id: 's7', time: '3:05 PM', result: '***-*', displayTime: '03:15 PM', isOpen: true },
  { id: 's8', time: '4:05 PM', result: '***-*', displayTime: '03:15 PM', isOpen: true },
  { id: 's9', time: '5:05 PM', result: '***-*', displayTime: '03:15 PM', isOpen: true },
  { id: 's10', time: '6:05 PM', result: '***-*', displayTime: '03:15 PM', isOpen: true },
  { id: 's11', time: '7:05 PM', result: '***-*', displayTime: '03:15 PM', isOpen: true },
  { id: 's12', time: '8:05 PM', result: '***-*', displayTime: '03:15 PM', isOpen: true },
  { id: 's13', time: '9:05 PM', result: '***-*', displayTime: '03:15 PM', isOpen: true },
  { id: 's14', time: '10:05 PM', result: '***-*', displayTime: '03:15 PM', isOpen: true },
];

export default function StarlineGamesScreen(props) {
  const insets = useSafeAreaInsets();
  const { strings } = useLanguage();
  const [markets] = useState(DEFAULT_STARLINE_MARKETS);

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

  // Opens Starline Game Chart when Calendar or Chart is clicked!
  const handleOpenStarlineChart = () => {
    props.navigation.navigate('ChartScreen', {
      initialType: 'starline',
      type: 'starline',
    });
  };

  const handleOpenMarket = (market) => {
    props.navigation.navigate('StarlineGameTypeScreen', { market });
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
        <Text style={styles.headerTitle}>{strings.starline_games_title || strings.tab_starline || 'STARLINE GAMES'}</Text>

        {/* Right Icons: Calendar Clock (Opens Starline Chart) & Refresh */}
        <View style={styles.headerRightIcons}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.headerIconBtn}
            onPress={handleOpenStarlineChart}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <CalendarClockIcon size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.headerIconBtn}
            onPress={() => {}}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <RefreshIcon size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* BODY CONTENT WRAPPER */}
      <View style={styles.bodyWrapper}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* GAME RATES TICKER BAR */}
        <View style={styles.tickerBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.ratesBadge}
            onPress={() => props.navigation.navigate('MarketRate')}
          >
            <Text style={styles.ratesBadgeText}>{strings.game_rates || 'Game Rate'}</Text>
          </TouchableOpacity>
          <View style={styles.tickerWrapper}>
            <Animated.View style={{ transform: [{ translateX: tickerTranslate }] }}>
              <Text style={styles.tickerText}>
                Single Pana : 10-1500  |  Double Pana : 10-3000  |  Triple Pana : 10-10000
              </Text>
            </Animated.View>
          </View>
        </View>

        {/* GAME HISTORY & WIN HISTORY BUTTONS */}
        <View style={styles.historyBtnRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.historyBtnTouch}
            onPress={() => props.navigation.navigate('BidHistory')}
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
            onPress={() => props.navigation.navigate('WiningHistory')}
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

        {/* MARKETS LIST */}
        {markets.map((market) => {
          const isResultDeclared = market.result !== '***-*';
          return (
            <View key={market.id} style={styles.marketCard}>
              {/* Market Time Title */}
              <Text style={styles.marketName}>{market.time}</Text>

              {/* 3 Columns Row */}
              <View style={styles.cardRow}>
                {/* Column 1: Clock Icon + CHART (Opens Starline Chart) */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.chartCol}
                  onPress={handleOpenStarlineChart}
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
                  <Text style={styles.timeText}>{market.displayTime}</Text>
                </View>

                {/* Column 3: Play Button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.playCol}
                  onPress={() => handleOpenMarket(market)}
                >
                  <View style={styles.playCircle}>
                    <View style={{ marginLeft: 3 }}>
                      <PlayIcon size={18} color="#000000" />
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
  headerRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
    color: '#D97706',
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
    fontSize: 19,
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
    minWidth: 80,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 4,
    elevation: 2,
  },
  resultBoxDeclared: {
    backgroundColor: '#374151',
  },
  resultBoxPending: {
    backgroundColor: '#4B5563',
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
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
});
