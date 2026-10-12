/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { screenWidth } from '../../constants/Sizes.constant';
import { getApiCall } from '../../services/AppSetting';
import { base } from '../../config/appConfig';
import Loading from '../../component/loading';
import {
  BackArrow,
  ChartIcon,
  StarIcon,
  DiceIcon,
  ChevronRight,
  CloseIcon,
  AppGridIcon,
  PanelTrendIcon,
  TrophyOrangeIcon,
  CalendarIcon,
  ClockIcon,
  BlueTrendingLineIcon,
  GoldLockIcon,
  GoldTrophySmallIcon,
  CalendarGoldIcon,
} from '../../component/MatkaIcons';
import { useLanguage } from '../../context/LanguageContext';

const DEFAULT_MARKETS = [
  { id: '1', market_name: 'BHAU BAZAR' },
  { id: '2', market_name: 'MADHUR MORNING' },
  { id: '3', market_name: 'SRIDEVI' },
  { id: '4', market_name: 'KALYAN MORNING' },
  { id: '5', market_name: 'TIME BAZAR' },
  { id: '6', market_name: 'MILAN DAY' },
  { id: '7', market_name: 'KALYAN' },
  { id: '8', market_name: 'MILAN NIGHT' },
  { id: '9', market_name: 'RAJDHANI NIGHT' },
  { id: '10', market_name: 'MAIN BAZAR' },
];

const STARLINE_TIMES = [
  '9:05 AM',
  '10:05 AM',
  '11:05 AM',
  '12:05 PM',
  '1:05 PM',
  '2:05 PM',
  '3:05 PM',
  '4:05 PM',
  '5:05 PM',
  '6:05 PM',
];

const STARLINE_DATES = [
  { date: '22-09-2026', r: ['228', '368', '277', '180', '230', '140', '190', '220', '310', '160'] },
  { date: '21-09-2026', r: ['223', '222', '150', '290', '170', '250', '210', '240', '320', '170'] },
  { date: '20-09-2026', r: ['340', '889', '233', '130', '240', '160', '220', '250', '330', '180'] },
  { date: '19-09-2026', r: ['112', '600', '136', '140', '250', '170', '230', '260', '340', '190'] },
  { date: '18-09-2026', r: ['155', '280', '113', '150', '260', '180', '240', '270', '350', '200'] },
  { date: '17-09-2026', r: ['120', '156', '234', '160', '270', '190', '250', '280', '360', '210'] },
  { date: '16-09-2026', r: ['117', '113', '556', '170', '280', '200', '260', '290', '370', '220'] },
  { date: '15-09-2026', r: ['167', '170', '777', '180', '290', '210', '270', '300', '380', '230'] },
  { date: '10-09-2026', r: ['123', '278', '358', '190', '300', '220', '280', '310', '390', '240'] },
  { date: '23-07-2026', r: ['166', '235', '189', '200', '310', '230', '290', '320', '400', '250'] },
  { date: '22-07-2026', r: ['128', '234', '280', '210', '320', '240', '300', '330', '410', '260'] },
  { date: '21-07-2026', r: ['370', '478', '990', '220', '330', '250', '310', '340', '420', '270'] },
];

const GALI_COLUMNS = ['DISHAWER', 'SHRI GANESH', 'FARIDABAD', 'GHAZIABAD', 'GALI'];

const GALI_DATES = [
  { date: '-2026', r: ['35', '**', '42', '18', '77'] },
  { date: '-2026', r: ['49', '38', '50', '23', '84'] },
  { date: '-2026', r: ['90', '**', '61', '39', '91'] },
  { date: '-2026', r: ['31', '94', '72', '45', '12'] },
  { date: '-2026', r: ['89', '**', '83', '56', '25'] },
  { date: '-2026', r: ['35', '34', '94', '67', '36'] },
  { date: '-2026', r: ['02', '48', '05', '78', '47'] },
  { date: '-2026', r: ['46', '42', '16', '89', '58'] },
  { date: '-2026', r: ['40', '32', '27', '90', '69'] },
  { date: '-2026', r: ['93', '12', '38', '01', '70'] },
];

const SAMPLE_RESULT_ROWS = [
  { date: '19 Sep 2026', day: 'SAT', open: '128', jodi: '10', close: '578', isRed: false },
  { date: '18 Sep 2026', day: 'FRI', open: '177', jodi: '55', close: '339', isRed: true },
  { date: '17 Sep 2026', day: 'THU', open: '180', jodi: '92', close: '390', isRed: false },
  { date: '16 Sep 2026', day: 'WED', open: '230', jodi: '56', close: '240', isRed: false },
  { date: '15 Sep 2026', day: 'TUE', open: '190', jodi: '02', close: '345', isRed: false },
  { date: '10 Sep 2026', day: 'THU', open: '110', jodi: '23', close: '346', isRed: false },
  { date: '09 Sep 2026', day: 'WED', open: '147', jodi: '28', close: '350', isRed: false },
  { date: '08 Sep 2026', day: 'TUE', open: '389', jodi: '00', close: '460', isRed: true },
  { date: '07 Sep 2026', day: 'MON', open: '169', jodi: '67', close: '179', isRed: false },
  { date: '05 Sep 2026', day: 'SAT', open: '348', jodi: '59', close: '289', isRed: false },
  { date: '04 Sep 2026', day: 'FRI', open: '256', jodi: '33', close: '139', isRed: true },
  { date: '03 Sep 2026', day: 'THU', open: '479', jodi: '08', close: '189', isRed: false },
];

export default function ChartScreen(props) {
  const insets = useSafeAreaInsets();
  const { strings } = useLanguage();
  const initialType =
    props.route?.params?.type ||
    (props.route?.params?.games_name && props.route?.params?.games_name !== 'Market Charts'
      ? 'result_table'
      : 'categories');

  const [viewMode, setViewMode] = useState(initialType); // 'categories' | 'main' | 'starline' | 'gali' | 'result_table'
  const [selectedMarket, setSelectedMarket] = useState({
    market_name: props.route?.params?.games_name || 'Bhau Bazar',
    id: props.route?.params?.market_id || '1',
  });
  const [marketList, setMarketList] = useState(DEFAULT_MARKETS);
  const [loading, setLoading] = useState(false);

  // Detail Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState('jodi'); // 'jodi' | 'panel'
  const [chartData, setChartData] = useState([]);
  const [starlineData, setStarlineData] = useState([]);
  const [galiData, setGaliData] = useState([]);

  useEffect(() => {
    fetchMarkets();
    if (
      props.route?.params?.games_name &&
      props.route?.params?.games_name !== 'Market Charts'
    ) {
      const mkt = {
        market_name: props.route.params.games_name,
        id: props.route.params.market_id || '1',
      };
      setSelectedMarket(mkt);
      loadResultTable(mkt);
      setViewMode('result_table');
    } else if (props.route?.params?.type) {
      setViewMode(props.route.params.type);
      if (props.route.params.type === 'starline') fetchStarlineChart();
      if (props.route.params.type === 'gali') fetchGaliChart();
    }
  }, [props.route?.params]);

  const loadResultTable = async (market) => {
    setLoading(true);
    try {
      const mName = market?.market_name || market?.games_name || market?.name || '';
      const mId = market?.id || '';
      const url = `${base.getGameChart}?market_id=${mId}&game_name=${encodeURIComponent(mName)}&limit=100`;
      const result = await getApiCall(url);
      let list = [];
      if (Array.isArray(result?.data)) list = result.data;
      else if (Array.isArray(result?.result)) list = result.result;
      else if (Array.isArray(result?.charts)) list = result.charts;
      else if (Array.isArray(result?.data?.charts)) list = result.data.charts;

      setChartData(list);
    } catch (e) {
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarkets = async () => {
    try {
      const result = await getApiCall(base.getKalyanMarket);
      let list = [];
      if (Array.isArray(result?.data)) list = result.data;
      else if (Array.isArray(result?.result)) list = result.result;
      else if (Array.isArray(result?.data?.markets)) list = result.data.markets;
      else if (Array.isArray(result?.markets)) list = result.markets;

      if (list.length > 0) {
        const formatted = list.map(m => ({
          ...m,
          market_name: m.games_name || m.market_name || m.name,
          id: String(m.id)
        }));
        setMarketList(formatted);
      }
    } catch (e) {
      // keep default
    }
  };

  const fetchStarlineChart = async () => {
    try {
      const res = await getApiCall(`${base.getGameChart}?type=starline&limit=100`);
      let list = [];
      if (Array.isArray(res?.data)) list = res.data;
      else if (Array.isArray(res?.result)) list = res.result;
      else if (Array.isArray(res?.charts)) list = res.charts;
      if (list.length > 0) setStarlineData(list);
    } catch (e) {}
  };

  const fetchGaliChart = async () => {
    try {
      const res = await getApiCall(`${base.getGameChart}?type=gali&limit=100`);
      let list = [];
      if (Array.isArray(res?.data)) list = res.data;
      else if (Array.isArray(res?.result)) list = res.result;
      else if (Array.isArray(res?.charts)) list = res.charts;
      if (list.length > 0) setGaliData(list);
    } catch (e) {}
  };

  const handleBack = () => {
    if (viewMode === 'result_table') {
      if (
        props.route?.params?.games_name &&
        props.route?.params?.games_name !== 'Market Charts'
      ) {
        props.navigation.goBack();
      } else {
        setViewMode('main');
      }
    } else if (
      viewMode !== 'categories' &&
      (!props.route?.params?.games_name || props.route?.params?.games_name === 'Market Charts') &&
      !props.route?.params?.type
    ) {
      setViewMode('categories');
    } else {
      props.navigation.goBack();
    }
  };

  const openMarketChart = async (market, type) => {
    setSelectedMarket(market);
    loadResultTable(market);
    setViewMode('result_table');
  };

  // Header Title based on view mode
  const getHeaderTitle = () => {
    if (viewMode === 'result_table') return selectedMarket?.market_name || 'Bhau Bazar';
    if (viewMode === 'main') return strings.main_charts || 'Main Game Charts';
    if (viewMode === 'starline') return strings.starline_charts || 'Starline Game Chart';
    if (viewMode === 'gali') return strings.gali_charts || 'Gali Game Chart';
    return strings.charts_title || 'Market Charts';
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      {/* TOP HEADER */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleBack}
          style={styles.backCircleBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <BackArrow size={20} color="#E2B048" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* BODY CONTENT WRAPPER */}
      <View style={styles.bodyWrapper}>
      {loading && <Loading />}

      {/* VIEW 1: CATEGORY SELECTION */}
      {viewMode === 'categories' && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.content, { paddingBottom: 30 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.categoryCard}
            onPress={() => setViewMode('main')}
          >
            <LinearGradient
              colors={['#784400', '#4A2800', '#2B1600']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconCircle}
            >
              <ChartIcon size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.categoryTitle}>{strings.main_charts || 'Main Market Chart'}</Text>
            <ChevronRight size={18} color="#0F172A" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.categoryCard}
            onPress={() => setViewMode('starline')}
          >
            <LinearGradient
              colors={['#784400', '#4A2800', '#2B1600']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconCircle}
            >
              <StarIcon size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.categoryTitle}>{strings.starline_charts || 'Starline Chart'}</Text>
            <ChevronRight size={18} color="#0F172A" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.categoryCard}
            onPress={() => setViewMode('gali')}
          >
            <LinearGradient
              colors={['#784400', '#4A2800', '#2B1600']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconCircle}
            >
              <DiceIcon size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.categoryTitle}>{strings.gali_charts || 'Gali Desawar Chart'}</Text>
            <ChevronRight size={18} color="#0F172A" />
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* VIEW 2: MAIN GAME CHARTS */}
      {viewMode === 'main' && (
        <FlatList
          data={marketList}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingVertical: 16, paddingBottom: 30 + insets.bottom }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const firstLetter = (item.market_name || 'M').charAt(0).toUpperCase();
            return (
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.marketCard}
                onPress={() => {
                  setSelectedMarket(item);
                  loadResultTable(item);
                  setViewMode('result_table');
                }}
              >
                {/* Top Row: Purple/Magenta Gradient Badge + Gold Market Name */}
                <View style={styles.marketTopRow}>
                  <LinearGradient
                    colors={['#BD1F78', '#660A6E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.letterBadge}
                  >
                    <Text style={styles.letterBadgeText}>{firstLetter}</Text>
                  </LinearGradient>

                  <Text style={styles.marketCardName}>{item.market_name}</Text>
                </View>

                {/* Subtle Divider Line */}
                <View style={styles.cardDivider} />

                {/* Bottom Row: Jodi Chart & Panel Chart Buttons */}
                <View style={styles.marketBottomRow}>
                  {/* Jodi Chart */}
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.jodiBtn}
                    onPress={() => {
                      setSelectedMarket(item);
                      loadResultTable(item);
                      setViewMode('result_table');
                    }}
                  >
                    <AppGridIcon size={18} color="#1E75D8" />
                    <Text style={styles.jodiBtnText}>{strings.result_chart || 'RESULT CHART'}</Text>
                  </TouchableOpacity>

                  {/* Panel Chart */}
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.panelBtn}
                    onPress={() => {
                      setSelectedMarket(item);
                      loadResultTable(item);
                      setViewMode('result_table');
                    }}
                  >
                    <PanelTrendIcon size={18} color="#D46A18" />
                    <Text style={styles.panelBtnText}>PANEL CHART</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* VIEW: RESULT CHART TABLE (Screenshot 1 - Matka Bhau Bazar Result Chart) */}
      {viewMode === 'result_table' && (
        <ScrollView
          style={styles.resultScrollView}
          contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
          showsVerticalScrollIndicator={false}
        >
          {/* Subheader: Blue Line Chart Icon + Title + Pill Badge */}
          <View style={styles.chartSubheaderWrap}>
            <View style={styles.chartTitleRow}>
              <BlueTrendingLineIcon size={28} color="#1D4ED8" />
              <Text style={styles.chartResultTitle}>
                {'  '}Matka {selectedMarket?.market_name || 'Bhau Bazar'} Result Chart
              </Text>
            </View>

            <View style={styles.latestPillBadge}>
              <ClockIcon size={14} color="#2563EB" />
              <Text style={styles.latestPillText}>  Latest results shown first</Text>
            </View>
          </View>

          {/* TABLE CONTAINER (Screenshot 1) */}
          <View style={styles.tableCard}>
            {/* Table Header Row (Dark Navy #101C2B) */}
            <View style={styles.tableHeaderRow}>
              {/* 1. Date */}
              <View style={styles.thDateCol}>
                <CalendarGoldIcon size={14} color="#F59E0B" />
                <Text style={styles.thText}> DATE</Text>
              </View>

              {/* 2. Open */}
              <View style={styles.thCellCol}>
                <GoldLockIcon size={14} color="#F59E0B" />
                <Text style={styles.thText}> OPEN</Text>
              </View>

              {/* 3. Jodi */}
              <View style={styles.thCellCol}>
                <GoldTrophySmallIcon size={14} color="#F59E0B" />
                <Text style={styles.thText}> JODI</Text>
              </View>

              {/* 4. Close */}
              <View style={styles.thCellCol}>
                <GoldLockIcon size={14} color="#F59E0B" />
                <Text style={styles.thText}> CLOSE</Text>
              </View>
            </View>

            {/* Table Body Rows */}
            {chartData && chartData.length > 0 ? (
              chartData.map((item, idx) => {
                const dateVal = item.date || item.result_date;
                const d = dateVal ? moment(dateVal) : moment();
                const oPana = item.open_panna || item.open_pana || (item.open_digit ? item.open_digit : '***');
                const cPana = item.close_panna || item.close_pana || (item.close_digit ? item.close_digit : '***');
                const oDigit = (item.open_digit !== undefined && item.open_digit !== null && item.open_digit !== '') ? String(item.open_digit) : '*';
                const cDigit = (item.close_digit !== undefined && item.close_digit !== null && item.close_digit !== '') ? String(item.close_digit) : '*';
                const jodiStr = item.jodi || (oDigit !== '*' || cDigit !== '*' ? `${oDigit}${cDigit}` : '**');
                const isRed = item.is_red || (jodiStr.length === 2 && jodiStr[0] !== '*' && jodiStr[0] === jodiStr[1]);

                return (
                  <View
                    key={item.id || idx}
                    style={[
                      styles.tableBodyRow,
                      idx % 2 === 1 && { backgroundColor: '#FBFDFE' },
                    ]}
                  >
                    {/* 1. Date Badge */}
                    <View style={styles.tbDateCol}>
                      <View style={styles.dateBadgeOutline}>
                        <View style={styles.dayRow}>
                          <CalendarIcon size={11} color="#2563EB" />
                          <Text style={styles.dayText}> {d.format('ddd').toUpperCase()}</Text>
                        </View>
                        <Text style={styles.dateNumText}>{d.format('DD MMM YYYY')}</Text>
                      </View>
                    </View>

                    {/* 2. Open */}
                    <View style={styles.tbCellCol}>
                      <Text style={styles.cellBoldDigits}>{oPana}</Text>
                    </View>

                    {/* 3. Jodi */}
                    <View style={styles.tbCellCol}>
                      <View
                        style={[
                          styles.jodiBadgeBox,
                          isRed && styles.jodiBadgeBoxRed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.jodiDigitsText,
                            isRed && styles.jodiDigitsTextRed,
                          ]}
                        >
                          {jodiStr}
                        </Text>
                      </View>
                    </View>

                    {/* 4. Close */}
                    <View style={styles.tbCellCol}>
                      <Text style={styles.cellBoldDigits}>{cPana}</Text>
                    </View>
                  </View>
                );
              })
            ) : (
              SAMPLE_RESULT_ROWS.map((row, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.tableBodyRow,
                    idx % 2 === 1 && { backgroundColor: '#FBFDFE' },
                  ]}
                >
                  {/* 1. Date Badge */}
                  <View style={styles.tbDateCol}>
                    <View style={styles.dateBadgeOutline}>
                      <View style={styles.dayRow}>
                        <CalendarIcon size={11} color="#2563EB" />
                        <Text style={styles.dayText}> {row.day}</Text>
                      </View>
                      <Text style={styles.dateNumText}>{row.date}</Text>
                    </View>
                  </View>

                  {/* 2. Open */}
                  <View style={styles.tbCellCol}>
                    <Text style={styles.cellBoldDigits}>{row.open}</Text>
                  </View>

                  {/* 3. Jodi */}
                  <View style={styles.tbCellCol}>
                    <View
                      style={[
                        styles.jodiBadgeBox,
                        row.isRed && styles.jodiBadgeBoxRed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.jodiDigitsText,
                          row.isRed && styles.jodiDigitsTextRed,
                        ]}
                      >
                        {row.jodi}
                      </Text>
                    </View>
                  </View>

                  {/* 4. Close */}
                  <View style={styles.tbCellCol}>
                    <Text style={styles.cellBoldDigits}>{row.close}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}

      {/* VIEW 3: STARLINE GAME CHART (Image 1) */}
      {viewMode === 'starline' && (
        <View style={{ flex: 1 }}>
          {/* Main Title Banner matching Image 1 */}
          <View style={styles.starlineTitleBanner}>
            <StarIcon size={24} color="#F97316" />
            <Text style={styles.starlineMainTitle}> STARLINE CHART</Text>
          </View>

          {/* Subtitle Pill */}
          <View style={styles.centerPill}>
            <ClockIcon size={15} color="#2563EB" />
            <Text style={styles.centerPillText}> Latest results shown first</Text>
          </View>

          {/* Table Container with Horizontal & Vertical Scroll */}
          <View style={styles.tableCardContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
              <View>
                {/* Header Row */}
                <View style={styles.gridHeaderRow}>
                  <View style={[styles.gridHeaderCellWrap, { width: 110 }]}>
                    <CalendarIcon size={14} color="#F59E0B" />
                    <Text style={styles.gridHeaderCell}> DATE</Text>
                  </View>
                  {STARLINE_TIMES.map((time, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.gridHeaderCellWrap,
                        { width: 94 },
                        idx === STARLINE_TIMES.length - 1 && { borderRightWidth: 0 },
                      ]}
                    >
                      <ClockIcon size={13} color="#F59E0B" />
                      <Text style={styles.gridHeaderTimeText}>{time}</Text>
                    </View>
                  ))}
                </View>

                {/* Data Rows */}
                <ScrollView showsVerticalScrollIndicator={false}>
                  {STARLINE_DATES.map((row, rIdx) => (
                    <View
                      key={rIdx}
                      style={[
                        styles.gridBodyRow,
                        rIdx % 2 === 1 && { backgroundColor: '#F8FAFC' },
                      ]}
                    >
                      <View style={[styles.dateCellWrap, { width: 110 }]}>
                        <View style={styles.datePill}>
                          <CalendarIcon size={12} color="#2563EB" />
                          <Text style={styles.datePillText}> {row.date}</Text>
                        </View>
                      </View>
                      {row.r.map((val, cIdx) => (
                        <View
                          key={cIdx}
                          style={[
                            styles.resultCellWrap,
                            { width: 94 },
                            cIdx === row.r.length - 1 && { borderRightWidth: 0 },
                          ]}
                        >
                          <View style={styles.resultPill}>
                            <Text style={styles.resultPillText}>{val}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  ))}
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      {/* VIEW 4: GALI GAME CHART (Image 3) */}
      {viewMode === 'gali' && (
        <View style={{ flex: 1 }}>
          {/* Hero Banner Header */}
          <View style={styles.galiBannerWrap}>
            <View style={styles.galiTitleRow}>
              <TrophyOrangeIcon size={26} />
              <Text style={styles.galiMatkaText}> MATKA </Text>
              <Text style={styles.galiOrangeText}>GALI DISAWAR</Text>
            </View>
            <Text style={styles.galiChartText}>CHART</Text>

            {/* Subtitle Pill */}
            <View style={[styles.centerPill, { marginTop: 10 }]}>
              <CalendarIcon size={15} color="#3B82F6" />
              <Text style={[styles.centerPillText, { color: '#334155' }]}>
                {' '}Daily Updated Results Record
              </Text>
            </View>
          </View>

          {/* Table Container with Horizontal & Vertical Scroll */}
          <View style={styles.tableCardContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
              <View>
                {/* Header Row */}
                <View style={styles.gridHeaderRow}>
                  <View style={[styles.gridHeaderCellWrap, { width: 86 }]}>
                    <Text style={styles.gridHeaderCell}>DATE</Text>
                  </View>
                  {GALI_COLUMNS.map((col, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.gridHeaderCellWrap,
                        { width: 115 },
                        idx === GALI_COLUMNS.length - 1 && { borderRightWidth: 0 },
                      ]}
                    >
                      <ClockIcon size={13} color="#F59E0B" />
                      <Text style={styles.gridHeaderTimeText}>{col}</Text>
                    </View>
                  ))}
                </View>

                {/* Data Rows */}
                <ScrollView showsVerticalScrollIndicator={false}>
                  {GALI_DATES.map((row, rIdx) => (
                    <View
                      key={rIdx}
                      style={[
                        styles.gridBodyRow,
                        rIdx % 2 === 1 && { backgroundColor: '#F8FAFC' },
                      ]}
                    >
                      <View style={[styles.dateCellWrap, { width: 86 }]}>
                        <View style={styles.datePill}>
                          <Text style={styles.datePillText}>-2026</Text>
                        </View>
                      </View>
                      {row.r.map((val, cIdx) => {
                        const isAsterisk = val.includes('*');
                        return (
                          <View
                            key={cIdx}
                            style={[
                              styles.resultCellWrap,
                              { width: 115 },
                              cIdx === row.r.length - 1 && { borderRightWidth: 0 },
                            ]}
                          >
                            {isAsterisk ? (
                              <Text style={styles.emptyAsteriskText}>* *</Text>
                            ) : (
                              <View style={styles.resultPill}>
                                <Text style={styles.resultPillText}>{val}</Text>
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
      </View>

      {/* MODAL: JODI / PANEL CHART */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseBtn}
                activeOpacity={0.7}
              >
                <CloseIcon size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>

            {chartData.length === 0 ? (
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <Text style={{ color: '#64748B', fontSize: 16 }}>No chart records available</Text>
              </View>
            ) : modalType === 'jodi' ? (
              /* JODI CHART GRID */
              <FlatList
                data={chartData}
                keyExtractor={(item, index) => String(item.id || index)}
                numColumns={4}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const jodi = `${item.open_digit ?? '-'}${item.close_digit ?? '-'}`;
                  return (
                    <View style={styles.jodiModalCell}>
                      <Text style={styles.chartCellDate}>
                        {moment(item.result_date || new Date()).format('DD-MM')}
                      </Text>
                      <View style={styles.jodiModalBadge}>
                        <Text style={styles.jodiModalText}>{jodi}</Text>
                      </View>
                    </View>
                  );
                }}
              />
            ) : (
              /* PANEL CHART GRID */
              <FlatList
                data={chartData}
                keyExtractor={(item, index) => String(item.id || index)}
                numColumns={4}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const openPanna = (item.open_panna || '---').toString().split('');
                  const closePanna = (item.close_panna || '---').toString().split('');
                  return (
                    <View style={styles.chartCell}>
                      <Text style={styles.chartCellDate}>
                        {moment(item.result_date || new Date()).format('DD-MM')}
                      </Text>
                      <View style={styles.cellInnerRow}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                          <Text style={styles.pannaDigit}>{openPanna[0] || '-'}</Text>
                          <Text style={styles.pannaDigit}>{openPanna[1] || '-'}</Text>
                          <Text style={styles.pannaDigit}>{openPanna[2] || '-'}</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={styles.jodiDigits}>
                            {item.open_digit ?? '-'}{item.close_digit ?? '-'}
                          </Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                          <Text style={styles.pannaDigit}>{closePanna[0] || '-'}</Text>
                          <Text style={styles.pannaDigit}>{closePanna[1] || '-'}</Text>
                          <Text style={styles.pannaDigit}>{closePanna[2] || '-'}</Text>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            )}
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#F6F7F9',
  },
  headerBar: {
    backgroundColor: '#061224',
    minHeight: 56,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#E2B048',
    letterSpacing: 0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.8,
    borderColor: '#0B1728',
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  categoryTitle: {
    flex: 1,
    marginLeft: 18,
    fontSize: 18.5,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.2,
  },

  // Main Game Charts styles (Image 1)
  marketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1.2,
    borderColor: '#EEF0F5',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  marketTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  letterBadge: {
    width: 52,
    height: 52,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#BD1F78',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  letterBadgeText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
  },
  marketCardName: {
    flex: 1,
    marginLeft: 16,
    fontSize: 18.5,
    fontWeight: '800',
    color: '#B88532',
    letterSpacing: 0.4,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F3F7',
    marginTop: 14,
    marginBottom: 14,
  },
  marketBottomRow: {
    flexDirection: 'row',
  },
  jodiBtn: {
    backgroundColor: '#DDEEFE',
    borderRadius: 14,
    flex: 1,
    marginRight: 8,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jodiBtnText: {
    color: '#1E75D8',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  panelBtn: {
    backgroundColor: '#FCE6CD',
    borderRadius: 14,
    flex: 1,
    marginLeft: 8,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelBtnText: {
    color: '#D46A18',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
    letterSpacing: 0.3,
  },

  // Starline & Gali styles (Images 1 & 2)
  starlineTitleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 4,
  },
  starlineMainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.8,
  },
  centerPill: {
    alignSelf: 'center',
    marginVertical: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 9,
    paddingHorizontal: 22,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerPillText: {
    color: '#1E3A8A',
    fontSize: 14.5,
    fontWeight: '700',
  },
  tableCardContainer: {
    flex: 1,
    marginHorizontal: 12,
    marginBottom: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  galiBannerWrap: {
    alignItems: 'center',
    paddingTop: 14,
  },
  galiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  galiMatkaText: {
    color: '#0B1728',
    fontSize: 22,
    fontWeight: '900',
  },
  galiOrangeText: {
    color: '#EA580C',
    fontSize: 22,
    fontWeight: '900',
  },
  galiChartText: {
    color: '#0B1728',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  gridHeaderRow: {
    backgroundColor: '#121E32',
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  gridHeaderCell: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  gridHeaderCellWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#25354D',
    paddingHorizontal: 6,
  },
  gridHeaderTimeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12.5,
    marginLeft: 5,
  },
  gridBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
    backgroundColor: '#FFFFFF',
  },
  dateCellWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#EEF2F6',
    paddingHorizontal: 4,
  },
  datePill: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.2,
    borderColor: '#BFDBFE',
    borderRadius: 7,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePillText: {
    color: '#2563EB',
    fontWeight: '800',
    fontSize: 12,
  },
  resultCellWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#EEF2F6',
    paddingHorizontal: 4,
  },
  resultPill: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultPillText: {
    color: '#059669',
    fontWeight: '800',
    fontSize: 14,
  },
  emptyAsteriskText: {
    color: '#94A3B8',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 2,
  },

  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  modalTitle: {
    fontSize: 17.5,
    fontWeight: '800',
    color: '#0B1728',
    flex: 1,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jodiModalCell: {
    margin: 5,
    width: (screenWidth - 72) / 4,
    padding: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  jodiModalBadge: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  jodiModalText: {
    color: '#DC2626',
    fontWeight: '900',
    fontSize: 15,
  },
  chartCell: {
    margin: 4,
    width: (screenWidth - 72) / 4,
    padding: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chartCellDate: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
  },
  cellInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pannaDigit: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '600',
    color: '#0F172A',
  },
  jodiDigits: {
    fontSize: 15,
    fontWeight: '900',
    color: '#DC2626',
  },

  // Screenshot 1 Result Chart Styles
  resultScrollView: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  chartSubheaderWrap: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 18,
    paddingHorizontal: 16,
  },
  chartTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  chartResultTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#0B1728',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  latestPillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  latestPillText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#334155',
  },
  tableCard: {
    marginHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#101C2B',
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  thDateCol: {
    flex: 1.25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thCellCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  tableBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  tbDateCol: {
    flex: 1.25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBadgeOutline: {
    borderWidth: 1.2,
    borderColor: '#DBEAFE',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    width: '92%',
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  dateNumText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  tbCellCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellBoldDigits: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E293B',
    letterSpacing: 1,
  },
  jodiBadgeBox: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jodiBadgeBoxRed: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  jodiDigitsText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  jodiDigitsTextRed: {
    color: '#DC2626',
  },
});