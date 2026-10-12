/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Modal,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { getApiCall } from '../../services/AppSetting';
import { base } from '../../config/appConfig';
import Loading from '../../component/loading';
import { useLanguage } from '../../context/LanguageContext';
import {
  BackArrow,
  CalendarGoldIcon,
  CalendarIcon,
  RefreshIcon,
  DiceIcon,
} from '../../component/MatkaIcons';

const GAME_TYPE_MAP = {
  1: 'Single Digit',
  2: 'Single Panna',
  3: 'Double Panna',
  4: 'Triple Panna',
  5: 'Half Sangam',
  6: 'Full Sangam',
  7: 'Jodi Digit',
};

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const getBidDigitsDisplay = (item) => {
  if (item.digits && item.digits !== 'NA' && item.digits !== 'N/A') return String(item.digits);
  if (item.digit && item.digit !== 'NA' && item.digit !== 'N/A') return String(item.digit);

  const type = (item.game_type || '').toLowerCase();
  const session = (item.session || '').toLowerCase();

  const opPana = item.open_pana && item.open_pana !== 'NA' && item.open_pana !== 'N/A' ? item.open_pana : '';
  const opDig = item.open_digit && item.open_digit !== 'NA' && item.open_digit !== 'N/A' ? item.open_digit : '';
  const clPana = item.close_pana && item.close_pana !== 'NA' && item.close_pana !== 'N/A' ? item.close_pana : '';
  const clDig = item.close_digit && item.close_digit !== 'NA' && item.close_digit !== 'N/A' ? item.close_digit : '';

  if (type.includes('jodi')) {
    if (opDig || clDig) return `${opDig || '0'}${clDig || '0'}`;
  }
  if (type.includes('sangam')) {
    if (type.includes('full')) return `${opPana || '***'} - ${clPana || '***'}`;
    return `${opPana || opDig || '***'} - ${clDig || clPana || '***'}`;
  }
  if (type.includes('pana') || type.includes('patti')) {
    if (session === 'close') return clPana || opPana || '---';
    return opPana || clPana || '---';
  }
  if (session === 'close') return clDig || opDig || '---';
  return opDig || clDig || opPana || clPana || '---';
};

export default function BidHistory(props) {
  const insets = useSafeAreaInsets();
  const { strings } = useLanguage();
  const isGali = props.route?.params?.type === 'gali';
  const [filterMode, setFilterMode] = useState('all'); // 'all' or 'date'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Custom 3-column Date Picker Modal state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerDay, setPickerDay] = useState(moment().date());
  const [pickerMonth, setPickerMonth] = useState(moment().month());
  const [pickerYear, setPickerYear] = useState(moment().year());

  const fetchBids = useCallback(async (date = selectedDate, mode = filterMode, skipLoading = false) => {
    if (!skipLoading) setLoading(true);
    try {
      let url = isGali ? base.galiBidHistory : base.getBidHistory;
      if (mode === 'date') {
        const dateStr = moment(date).format('YYYY-MM-DD');
        url += isGali
          ? `?date=${dateStr}`
          : `?from_date=${dateStr}&to_date=${dateStr}&date1=${dateStr}&date2=${dateStr}&date=${dateStr}`;
      } else {
        url += isGali ? '' : `?all=true`;
      }
      const result = await getApiCall(url);
      let bids = [];
      if (Array.isArray(result?.data)) {
        bids = result.data;
      } else if (Array.isArray(result?.result)) {
        bids = result.result;
      } else if (Array.isArray(result?.bids)) {
        bids = result.bids;
      } else if (Array.isArray(result?.data?.bids)) {
        bids = result.data.bids;
      } else if (Array.isArray(result?.data?.history)) {
        bids = result.data.history;
      } else if (Array.isArray(result)) {
        bids = result;
      }
      setHistory(bids);
    } catch (e) {
      console.warn('fetchBids error:', e);
      setHistory([]);
    } finally {
      if (!skipLoading) setLoading(false);
      setRefreshing(false);
    }
  }, [filterMode, selectedDate]);

  useEffect(() => {
    fetchBids(selectedDate, filterMode);
    const unsubscribe = props.navigation?.addListener?.('focus', () => {
      fetchBids(selectedDate, filterMode);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchBids, filterMode, selectedDate, props.navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBids(selectedDate, filterMode, true);
  };

  const handleModeChange = (newMode) => {
    setFilterMode(newMode);
    fetchBids(selectedDate, newMode);
  };

  const openDatePicker = () => {
    const m = moment(selectedDate);
    setPickerDay(m.date());
    setPickerMonth(m.month());
    setPickerYear(m.year());
    setShowDatePicker(true);
  };

  const confirmDatePicker = () => {
    const newDate = moment({
      year: pickerYear,
      month: pickerMonth,
      day: Math.min(pickerDay, moment({ year: pickerYear, month: pickerMonth }).daysInMonth()),
    }).toDate();
    setSelectedDate(newDate);
    setShowDatePicker(false);
    fetchBids(newDate, 'date');
  };

  const cancelDatePicker = () => {
    setShowDatePicker(false);
  };

  const handlePrevDay = () => {
    const newDate = moment(selectedDate).subtract(1, 'days').toDate();
    setSelectedDate(newDate);
    fetchBids(newDate, 'date');
  };

  const handleNextDay = () => {
    const newDate = moment(selectedDate).add(1, 'days').toDate();
    setSelectedDate(newDate);
    fetchBids(newDate, 'date');
  };

  const maxDays = moment({ year: pickerYear, month: pickerMonth }).daysInMonth();
  const prevDayVal = pickerDay > 1 ? pickerDay - 1 : maxDays;
  const nextDayVal = pickerDay < maxDays ? pickerDay + 1 : 1;

  const prevMonthVal = pickerMonth > 0 ? pickerMonth - 1 : 11;
  const nextMonthVal = pickerMonth < 11 ? pickerMonth + 1 : 0;

  const prevYearVal = pickerYear - 1;
  const nextYearVal = pickerYear + 1;

  const totalPoints = history.reduce((sum, item) => {
    const val = Number(item.points_action || item.amount || item.points) || 0;
    return sum + val;
  }, 0);

  const formattedDate = moment(selectedDate).format('DD-MM-YYYY');

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      {/* TOP HEADER */}
      <View style={styles.headerBar}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => props.navigation.goBack()}
            style={styles.backCircleBtn}
          >
            <BackArrow size={20} color="#E2B048" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{isGali ? 'Gali Desawar Bids' : (strings.bids_title || 'मेरी बिड्स')}</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.refreshCircleBtn}
            onPress={onRefresh}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="#E2B048" />
            ) : (
              <RefreshIcon size={18} color="#E2B048" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* BODY CONTENT WRAPPER */}
      <View style={styles.bodyWrapper}>
        {/* DUAL MODE TABS */}
        <View style={styles.modeTabsRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.modeTab, filterMode === 'all' && styles.modeTabActive]}
          onPress={() => handleModeChange('all')}
        >
          <Text style={[styles.modeTabText, filterMode === 'all' && styles.modeTabTextActive]}>
            📝 All Bids ({filterMode === 'all' ? history.length : 'All'})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.modeTab, filterMode === 'date' && styles.modeTabActive]}
          onPress={() => handleModeChange('date')}
        >
          <Text style={[styles.modeTabText, filterMode === 'date' && styles.modeTabTextActive]}>
            📅 Filter by Date
          </Text>
        </TouchableOpacity>
      </View>

      {/* SUMMARY BANNER */}
      {history.length > 0 && (
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <View style={styles.summaryDiceCircle}>
              <DiceIcon size={24} color="#E2B048" />
            </View>
            <View>
              <Text style={styles.summaryLabel}>Total Bets Placed</Text>
              <Text style={styles.summaryAmount}>₹{totalPoints.toLocaleString('en-IN')}</Text>
            </View>
          </View>
          <View style={styles.summaryBadge}>
            <Text style={styles.summaryBadgeText}>{history.length} Bids</Text>
          </View>
        </View>
      )}

      {/* DATE SELECTOR PILL (VISIBLE IN DATE MODE) */}
      {filterMode === 'date' && (
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.dateSelectorPill}
          onPress={openDatePicker}
        >
          <CalendarGoldIcon size={18} color="#E2B048" />
          <Text style={styles.dateSelectorText}>
            Selected Date: {formattedDate}
          </Text>
          <Text style={styles.dateChangeNotice}>Tap to change</Text>
        </TouchableOpacity>
      )}

      {loading && !refreshing && history.length === 0 && <Loading />}

      {/* BIDS LIST CONTENT */}
      <View style={styles.listContainer}>
        {history.length === 0 && !loading ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>{strings.no_bids_found || 'कोई बिड्स नहीं मिलीं'}</Text>
            <Text style={styles.emptySub}>
              {filterMode === 'date'
                ? `${formattedDate} के लिए कोई बिड रिकॉर्ड उपलब्ध नहीं है।`
                : 'आपके खाते में कोई बिड रिकॉर्ड उपलब्ध नहीं है।'}
            </Text>
            {filterMode === 'date' && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.viewAllBtn}
                onPress={() => handleModeChange('all')}
              >
                <Text style={styles.viewAllBtnText}>View All-Time Bids</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item, index) => String(item.id || item.bid_id || index)}
            contentContainerStyle={{ paddingVertical: 10, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#E2B048']}
                tintColor="#E2B048"
              />
            }
            renderItem={({ item, index }) => {
              const gameName = item.game_name || item.market_name || 'MARKET';
              const typeName = item.game_type || GAME_TYPE_MAP[item.gtype_id] || 'Single';
              const isOpen = (item.session || '').toLowerCase() === 'open';
              const digitsDisplay = getBidDigitsDisplay(item);
              const betAmt = item.points_action || item.amount || item.points || '0';
              const timeStr = item.time ? moment(item.time, 'HH:mm:ss').format('hh:mm A') : '';
              const dateStr = item.date ? moment(item.date).format('DD MMM YYYY') : '';

              return (
                <View style={styles.bidCard}>
                  <View style={styles.bidCardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.bidMarketName}>{gameName}</Text>
                      <Text style={styles.gameTypeText}>{typeName}</Text>
                    </View>

                    <View
                      style={[
                        styles.sessionBadge,
                        { backgroundColor: isOpen ? '#DCFCE7' : '#EFF6FF' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.sessionBadgeText,
                          { color: isOpen ? '#15803D' : '#1D4ED8' },
                        ]}
                      >
                        {item.session?.toUpperCase() || 'OPEN'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardDivider} />

                  <View style={styles.bidCardBody}>
                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>Digits / Pana</Text>
                      <View style={styles.digitPill}>
                        <Text style={styles.digitPillText}>{digitsDisplay}</Text>
                      </View>
                    </View>

                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>Time</Text>
                      <Text style={styles.timeValText}>{timeStr || '---'}</Text>
                    </View>

                    <View style={[styles.detailCol, { alignItems: 'flex-end' }]}>
                      <Text style={styles.detailLabel}>Bid Amount</Text>
                      <Text style={styles.amountValue}>₹{betAmt}</Text>
                    </View>
                  </View>

                  <View style={styles.bidCardFooter}>
                    <Text style={styles.bidDateFooter}>📅 {dateStr || formattedDate}</Text>
                    <Text style={styles.bidIdFooter}>Record #{item.id || index + 1}</Text>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>

      {/* BOTTOM NAVIGATION STRIP IN DATE MODE */}
      {filterMode === 'date' && (
        <View style={[styles.bottomNavStrip, { paddingBottom: Math.max(insets.bottom, 14) }]}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.navDayBtnWrapper}
            onPress={handlePrevDay}
          >
            <LinearGradient
              colors={['#061224', '#0A2540']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.navDayGradient}
            >
              <Text style={styles.navDayArrow}>← </Text>
              <Text style={styles.navDayText}>{strings.prev || 'Prev Day'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.navDayBtnWrapper}
            onPress={handleNextDay}
          >
            <LinearGradient
              colors={['#061224', '#0A2540']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.navDayGradient}
            >
              <Text style={styles.navDayText}>{strings.next || 'Next Day'}</Text>
              <Text style={styles.navDayArrow}> →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
      </View>

      {/* CUSTOM 3-COLUMN DATE PICKER DIALOG */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelDatePicker}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.datePickerCard}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerHeaderTitle}>Select Date</Text>
            </View>

            <View style={styles.pickerColumnsRow}>
              {/* Day */}
              <View style={styles.columnWrap}>
                <TouchableOpacity
                  onPress={() => setPickerDay(prevDayVal)}
                  style={styles.pickerCellInactive}
                >
                  <Text style={styles.pickerTextInactive}>{prevDayVal}</Text>
                </TouchableOpacity>

                <View style={styles.pickerCellActive}>
                  <Text style={styles.pickerTextActive}>{pickerDay}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => setPickerDay(nextDayVal)}
                  style={styles.pickerCellInactive}
                >
                  <Text style={styles.pickerTextInactive}>{nextDayVal}</Text>
                </TouchableOpacity>
              </View>

              {/* Month */}
              <View style={styles.columnWrap}>
                <TouchableOpacity
                  onPress={() => setPickerMonth(prevMonthVal)}
                  style={styles.pickerCellInactive}
                >
                  <Text style={styles.pickerTextInactive}>{MONTH_NAMES[prevMonthVal]}</Text>
                </TouchableOpacity>

                <View style={styles.pickerCellActive}>
                  <Text style={styles.pickerTextActive}>{MONTH_NAMES[pickerMonth]}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => setPickerMonth(nextMonthVal)}
                  style={styles.pickerCellInactive}
                >
                  <Text style={styles.pickerTextInactive}>{MONTH_NAMES[nextMonthVal]}</Text>
                </TouchableOpacity>
              </View>

              {/* Year */}
              <View style={styles.columnWrap}>
                <TouchableOpacity
                  onPress={() => setPickerYear(prevYearVal)}
                  style={styles.pickerCellInactive}
                >
                  <Text style={styles.pickerTextInactive}>{prevYearVal}</Text>
                </TouchableOpacity>

                <View style={styles.pickerCellActive}>
                  <Text style={styles.pickerTextActive}>{pickerYear}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => setPickerYear(nextYearVal)}
                  style={styles.pickerCellInactive}
                >
                  <Text style={styles.pickerTextInactive}>{nextYearVal}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.pickerActionRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.pickerActionBtn}
                onPress={cancelDatePicker}
              >
                <Text style={styles.pickerActionTextCancel}>{strings.cancel || 'Cancel'}</Text>
              </TouchableOpacity>

              <View style={styles.pickerBtnDivider} />

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.pickerActionBtn}
                onPress={confirmDatePicker}
              >
                <Text style={styles.pickerActionTextConfirm}>{strings.confirm || 'Apply'}</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    backgroundColor: '#061224',
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  refreshCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(226, 176, 72, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(226, 176, 72, 0.08)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#E2B048',
    letterSpacing: 0.3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#E2B048',
    letterSpacing: 0.3,
  },
  modeTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    padding: 4,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  modeTabActive: {
    backgroundColor: '#061224',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  modeTabTextActive: {
    color: '#E2B048',
  },
  summaryCard: {
    backgroundColor: '#061224',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'rgba(226, 176, 72, 0.4)',
    elevation: 3,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryDiceCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(226, 176, 72, 0.15)',
    borderWidth: 1.5,
    borderColor: '#E2B048',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryAmount: {
    color: '#E2B048',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2,
  },
  summaryBadge: {
    backgroundColor: 'rgba(226, 176, 72, 0.15)',
    borderWidth: 1,
    borderColor: '#E2B048',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  summaryBadgeText: {
    color: '#E2B048',
    fontSize: 13,
    fontWeight: '800',
  },
  dateSelectorPill: {
    backgroundColor: 'rgba(226, 176, 72, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(226, 176, 72, 0.4)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 10,
  },
  dateSelectorText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#061224',
    flex: 1,
    marginLeft: 8,
  },
  dateChangeNotice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  viewAllBtn: {
    marginTop: 18,
    backgroundColor: '#061224',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2B048',
  },
  viewAllBtnText: {
    color: '#E2B048',
    fontSize: 13,
    fontWeight: '800',
  },
  bidCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  bidCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bidMarketName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.2,
  },
  gameTypeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
  },
  sessionBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  sessionBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  bidCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  digitPill: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  digitPillText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#92400E',
  },
  timeValText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#E2B048',
  },
  bidCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  bidDateFooter: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  bidIdFooter: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '700',
  },
  bottomNavStrip: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 6,
    backgroundColor: '#F8FAFC',
  },
  navDayBtnWrapper: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  navDayGradient: {
    height: 46,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(226, 176, 72, 0.4)',
  },
  navDayText: {
    color: '#E2B048',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  navDayArrow: {
    color: '#E2B048',
    fontSize: 16,
    fontWeight: '800',
  },

  // Date Picker Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePickerCard: {
    width: '84%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  pickerHeader: {
    backgroundColor: '#061224',
    paddingVertical: 14,
    alignItems: 'center',
  },
  pickerHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#E2B048',
  },
  pickerColumnsRow: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  columnWrap: {
    flex: 1,
    alignItems: 'center',
  },
  pickerCellInactive: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  pickerTextInactive: {
    fontSize: 18,
    fontWeight: '600',
    color: '#94A3B8',
  },
  pickerCellActive: {
    height: 48,
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#E2B048',
  },
  pickerTextActive: {
    fontSize: 21,
    fontWeight: '900',
    color: '#061224',
  },
  pickerActionRow: {
    flexDirection: 'row',
    height: 52,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
  },
  pickerActionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerActionTextCancel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
  pickerActionTextConfirm: {
    fontSize: 15,
    fontWeight: '800',
    color: '#061224',
  },
  pickerBtnDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#EEF2F6',
  },
});
