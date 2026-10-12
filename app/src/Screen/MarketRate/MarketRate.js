/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getApiCall } from '../../services/AppSetting';
import { base } from '../../config/appConfig';
import Loading from '../../component/loading';
import { BackArrow, RefreshIcon } from '../../component/MatkaIcons';
import { useLanguage } from '../../context/LanguageContext';

const getLocalizedName = (type, strings) => {
  if (!type) return 'Game Rate';
  const t = type.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (t.includes('singledigit') || t === 'single') return strings.single_digit || 'Single Digit';
  if (t.includes('jodidigit') || t.includes('jodi')) return strings.jodi_digit || 'Jodi Digit';
  if (t.includes('singlepana') || t.includes('singlepatti')) return strings.single_pana || 'Single Pana';
  if (t.includes('doublepana') || t.includes('doublepatti')) return strings.double_pana || 'Double Pana';
  if (t.includes('triplepana') || t.includes('tripplepana') || t.includes('triplepatti')) return strings.triple_pana || 'Triple Pana';
  if (t.includes('halfsangam')) return strings.half_sangam || 'Half Sangam';
  if (t.includes('fullsangam')) return strings.full_sangam || 'Full Sangam';
  return type;
};

export default function MarketRate(props) {
  const insets = useSafeAreaInsets();
  const { strings } = useLanguage();
  const defaultRates = [
    { id: '1', type: 'Single Digit', name: strings.single_digit || 'Single Digit', payout: '₹10', wins: '99', bidKey: 'single_digit_bid', winKey: 'single_digit_win' },
    { id: '2', type: 'Jodi Digit', name: strings.jodi_digit || 'Jodi Digit', payout: '₹10', wins: '950', bidKey: 'jodi_digit_bid', winKey: 'jodi_digit_win' },
    { id: '3', type: 'Single Pana', name: strings.single_pana || 'Single Pana', payout: '₹10', wins: '1400', bidKey: 'single_match_bid', winKey: 'single_match_win' },
    { id: '4', type: 'Double Pana', name: strings.double_pana || 'Double Pana', payout: '₹10', wins: '2800', bidKey: 'double_match_bid', winKey: 'double_match_win' },
    { id: '5', type: 'Triple Pana', name: strings.triple_pana || 'Triple Pana', payout: '₹10', wins: '7000', bidKey: 'triple_match_bid', winKey: 'triple_match_win' },
    { id: '6', type: 'Half Sangam', name: strings.half_sangam || 'Half Sangam', payout: '₹10', wins: '10000', bidKey: 'half_sangam_bid', winKey: 'half_sangam_win' },
    { id: '7', type: 'Full Sangam', name: strings.full_sangam || 'Full Sangam', payout: '₹10', wins: '100000', bidKey: 'full_sangam_bid', winKey: 'full_sangam_win' },
  ];
  const [rates, setRates] = useState(defaultRates);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRates = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const result = await getApiCall(base.getGameRate);
      let ratesArr = [];
      if (Array.isArray(result?.data)) {
        ratesArr = result.data;
      } else if (Array.isArray(result?.data?.rates)) {
        ratesArr = result.data.rates;
      } else if (Array.isArray(result?.result)) {
        ratesArr = result.result;
      } else if (Array.isArray(result)) {
        ratesArr = result;
      }

      if (Array.isArray(ratesArr) && ratesArr.length > 0) {
        if (ratesArr[0].type || ratesArr[0].min_value !== undefined) {
          const mapped = ratesArr.map((r, idx) => ({
            id: String(r.id || idx + 1),
            type: r.type || `Rate ${idx + 1}`,
            name: getLocalizedName(r.type, strings),
            payout: r.min_value ? `₹${r.min_value}` : '₹10',
            wins: String(r.max_value !== undefined && r.max_value !== null ? r.max_value : (r.rate || '0')),
            minValue: r.min_value,
            maxValue: r.max_value,
          }));
          setRates(mapped);
        } else if (ratesArr[0].single_digit_bid || ratesArr[0].single_digit_1) {
          const r = ratesArr[0];
          const mapped = defaultRates.map((item) => ({
            ...item,
            payout: r[item.bidKey] ? `₹${r[item.bidKey]}` : item.payout,
            wins: r[item.winKey] ? String(r[item.winKey]) : (r.rate ? String(r.rate) : item.wins),
          }));
          setRates(mapped);
        }
      }
    } catch (e) {
      console.warn('Error fetching game rates:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [strings]);

  useEffect(() => {
    fetchRates();
    const unsubscribe = props.navigation?.addListener?.('focus', () => {
      fetchRates();
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchRates, props.navigation]);

  const _goBack = () => props.navigation.goBack();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      {/* TOP HEADER */}
      <View style={styles.headerBar}>
        <TouchableOpacity activeOpacity={0.8} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} onPress={_goBack} style={styles.backCircleBtn}>
          <BackArrow size={20} color="#E2B048" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{strings.market_rate_title || 'Game Rate'}</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => fetchRates(true)}
          style={styles.refreshCircleBtn}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color="#E2B048" />
          ) : (
            <RefreshIcon size={18} color="#E2B048" />
          )}
        </TouchableOpacity>
      </View>

      {loading && !refreshing && rates.length === 0 && <Loading />}

      <View style={styles.content}>
        {/* SUBTITLE BANNER */}
        <View style={styles.subBanner}>
          <Text style={styles.subBannerTitle}>
            {strings.game_rates_sub || 'Standard Game Payout & Winning Ratio'}
          </Text>
        </View>

        {/* TABLE CARD */}
        <View style={styles.tableCard}>
          {/* Table Header Row */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.headerCell, { textAlign: 'left', flex: 1.4 }]}>
              {strings.play_type_header || 'PLAY TYPE'}
            </Text>
            <Text style={[styles.headerCell, { textAlign: 'center', flex: 1 }]}>
              {strings.payout_header || 'PAYOUT ₹10'}
            </Text>
            <Text style={[styles.headerCell, { textAlign: 'right', flex: 1.1 }]}>
              {strings.wins_header || '₹10 WINS'}
            </Text>
          </View>

          {/* Table Rows */}
          <FlatList
            data={rates}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => fetchRates(true)}
                colors={['#E2B048']}
                tintColor="#E2B048"
              />
            }
            renderItem={({ item, index }) => (
              <View
                style={[
                  styles.tableRow,
                  index % 2 === 1 && styles.tableRowAlt,
                  index === rates.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <Text style={[styles.rowCell, styles.playTypeName]}>{item.name}</Text>
                <Text style={[styles.rowCell, styles.payoutVal]}>{item.payout}</Text>
                <Text style={[styles.rowCell, styles.winsVal]}>{item.wins}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061224',
  },
  headerBar: {
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
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
  },
  subBanner: {
    backgroundColor: 'rgba(226, 176, 72, 0.12)',
    borderLeftWidth: 4,
    borderLeftColor: '#E2B048',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  subBannerTitle: {
    color: '#061224',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    flex: 1,
    marginBottom: 10,
  },
  tableHeaderRow: {
    backgroundColor: '#070F1E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  headerCell: {
    color: '#E2B048',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  tableRowAlt: {
    backgroundColor: '#F8FAFC',
  },
  rowCell: {
    fontSize: 15,
  },
  playTypeName: {
    flex: 1.4,
    textAlign: 'left',
    color: '#0F172A',
    fontWeight: '800',
  },
  payoutVal: {
    flex: 1,
    textAlign: 'center',
    color: '#475569',
    fontWeight: '800',
  },
  winsVal: {
    flex: 1.1,
    textAlign: 'right',
    color: '#16A34A',
    fontWeight: '900',
  },
});