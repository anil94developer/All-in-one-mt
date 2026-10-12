/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import moment from 'moment';
import { getApiCall } from '../../services/AppSetting';
import { base } from '../../config/appConfig';
import Loading from '../../component/loading';
import {
  BackArrow,
  RefreshIcon,
  ReceiptGirlIllustration,
  WalletBonusIcon,
  CalendarIcon,
} from '../../component/MatkaIcons';
import { useLanguage } from '../../context/LanguageContext';

export default function Passbook(props) {
  const insets = useSafeAreaInsets();
  const { strings } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const initialTab = props.route?.params?.initialTab || 'all';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'date'
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async (skipLoading = false) => {
    if (!skipLoading) setLoading(true);
    try {
      const url = `${base.get_wallet_history}?all=true&limit=150`;
      const result = await getApiCall(url);
      let rows = [];
      if (Array.isArray(result?.data)) rows = result.data;
      else if (Array.isArray(result?.result)) rows = result.result;
      else if (Array.isArray(result?.history)) rows = result.history;

      const items = rows.map((w, idx) => {
        const rawAmt = parseFloat(w.amount || '0');
        const isNegative = String(w.amount || '').startsWith('-') || rawAmt < 0;
        const absAmt = Math.abs(rawAmt);
        const type = isNegative ? 'debit' : 'credit';
        const rawDate = w.date || w.created_at || new Date();
        const formattedDate = moment(rawDate).format('DD MMM YYYY');
        const formattedTime = w.time || moment(rawDate).format('hh:mm:ss A');
        const title = w.remark || (type === 'credit' ? 'Wallet Deposit' : 'Wallet Withdrawal');

        return {
          id: String(w.id || idx),
          title,
          type,
          amount: absAmt,
          updatedAmount: w.updated_amount,
          date: new Date(rawDate),
          dateStr: moment(rawDate).format('YYYY-MM-DD'),
          formattedDateTime: `${formattedDate} ${formattedTime}`,
          statusText: type === 'credit' ? 'Added to wallet' : 'Debited from wallet',
          statusColor: type === 'credit' ? '#00A859' : '#DC2626',
        };
      });

      setAllTransactions(items);
    } catch (e) {
      console.log('Error fetchAllData:', e);
    } finally {
      if (!skipLoading) setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllData(true);
    setRefreshing(false);
  };

  const _goBack = () => props.navigation.goBack();

  const handlePrevDate = () => {
    setSelectedDate((prev) => moment(prev).subtract(1, 'days').toDate());
  };

  const handleNextDate = () => {
    setSelectedDate((prev) => moment(prev).add(1, 'days').toDate());
  };

  const filteredTransactions = allTransactions.filter((item) => {
    if (filterMode === 'date') {
      const isSameDay = moment(item.date).isSame(selectedDate, 'day');
      if (!isSameDay) return false;
    }
    if (activeTab === 'credit') return item.type === 'credit';
    if (activeTab === 'debit') return item.type === 'debit';
    return true;
  });

  const totalCredit = allTransactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const totalDebit = allTransactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      {/* TOP HEADER */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={_goBack}
          style={styles.backCircleBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <BackArrow size={20} color="#E2B048" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{strings.passbook_title || 'TRANSACTIONS'}</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onRefresh}
          style={styles.refreshBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <RefreshIcon size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* BODY WRAPPER */}
      <View style={styles.bodyWrapper}>
        {/* SUMMARY STATS BAR */}
        <View style={styles.summaryBar}>
        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>Total Credit</Text>
          <Text style={[styles.summaryVal, { color: '#16A34A' }]}>+ ₹{totalCredit.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>Total Debit</Text>
          <Text style={[styles.summaryVal, { color: '#DC2626' }]}>- ₹{totalDebit.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      {/* FILTER MODE TOGGLE: All Transactions vs By Date */}
      <View style={styles.modeToggleRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.modeToggleBtn, filterMode === 'all' && styles.modeToggleBtnActive]}
          onPress={() => setFilterMode('all')}
        >
          <Text style={[styles.modeToggleText, filterMode === 'all' && styles.modeToggleTextActive]}>
            All ({allTransactions.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.modeToggleBtn, filterMode === 'date' && styles.modeToggleBtnActive]}
          onPress={() => setFilterMode('date')}
        >
          <Text style={[styles.modeToggleText, filterMode === 'date' && styles.modeToggleTextActive]}>
            📅 By Date
          </Text>
        </TouchableOpacity>
      </View>

      {/* TABS CAPSULE (All / Credit / Debit) */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.tabItem, activeTab === 'all' && styles.activeTabPill]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            {strings.tab_all || 'All'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.tabItem, activeTab === 'credit' && styles.activeTabPill]}
          onPress={() => setActiveTab('credit')}
        >
          <Text style={[styles.tabText, activeTab === 'credit' && styles.activeTabText]}>
            {strings.tab_credit || 'Credit'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.tabItem, activeTab === 'debit' && styles.activeTabPill]}
          onPress={() => setActiveTab('debit')}
        >
          <Text style={[styles.tabText, activeTab === 'debit' && styles.activeTabText]}>
            {strings.tab_debit || 'Debit'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* DATE NAVIGATION ROW (Shown only when By Date is active) */}
      {filterMode === 'date' && (
        <View style={styles.dateRow}>
          <TouchableOpacity activeOpacity={0.85} style={styles.navDateBtn} onPress={handlePrevDate}>
            <Text style={styles.navDateBtnText}>{strings.prev || 'Prev'}</Text>
          </TouchableOpacity>

          <Text style={styles.dateDisplay}>
            {moment(selectedDate).format('DD MMM YYYY')}
          </Text>

          <TouchableOpacity activeOpacity={0.85} style={styles.navDateBtn} onPress={handleNextDate}>
            <Text style={styles.navDateBtnText}>{strings.next || 'Next'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && <Loading />}

      {/* TRANSACTION LIST OR EMPTY STATE */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E2B048" />
        }
        contentContainerStyle={[
          styles.listContent,
          filteredTransactions.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.transCard}>
            <View style={styles.transCardTop}>
              <View style={styles.walletIconCircle}>
                <WalletBonusIcon size={46} />
              </View>
              <View style={styles.transCardDetails}>
                <Text style={styles.transCardTitle}>{item.title}</Text>
                <View style={styles.dateRowItem}>
                  <CalendarIcon size={14} color="#64748B" />
                  <Text style={styles.transCardDate}> {item.formattedDateTime}</Text>
                </View>
                <View style={styles.pillContainer}>
                  <View
                    style={[
                      styles.statusPill,
                      { backgroundColor: item.type === 'debit' ? '#DC2626' : (item.statusColor || '#00A859') },
                    ]}
                  >
                    <Text style={styles.statusPillText}>{item.statusText || 'Added to your wallet'}</Text>
                  </View>
                  {item.updatedAmount !== null && item.updatedAmount !== undefined ? (
                    <View style={styles.balancePill}>
                      <Text style={styles.balancePillText}>Bal: ₹{item.updatedAmount}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <Text
                style={[
                  styles.transCardAmount,
                  { color: item.type === 'credit' ? '#16A34A' : '#DC2626' },
                ]}
              >
                {item.type === 'credit' ? `+ ₹${item.amount}` : `- ₹${item.amount}`}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <ReceiptGirlIllustration size={130} />
              <Text style={styles.emptyTitle}>{strings.no_data_found || 'No data found'}</Text>
            </View>
          )
        }
        contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
      />
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
    backgroundColor: '#F8FAFC',
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
  refreshBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 4,
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1.2,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
  },
  activeTabPill: {
    backgroundColor: '#701A1E',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 16,
  },
  navDateBtn: {
    backgroundColor: '#061224',
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 9,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  navDateBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  dateDisplay: {
    color: '#C48417',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    color: '#C48417',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 16,
    letterSpacing: 0.2,
  },
  transCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  transCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#061224',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transCardDetails: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  transCardTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  dateRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  transCardDate: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  pillContainer: {
    marginTop: 8,
    flexDirection: 'row',
  },
  transCardAmount: {
    fontSize: 19,
    fontWeight: '800',
  },
  statusPill: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  statusPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  balancePill: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  balancePillText: {
    color: '#1D4ED8',
    fontSize: 11.5,
    fontWeight: '700',
  },
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  summaryCol: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
  },
  summaryVal: {
    fontSize: 16,
    fontWeight: '800',
  },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  modeToggleRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 10,
    gap: 8,
  },
  modeToggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modeToggleBtnActive: {
    backgroundColor: '#061224',
    borderColor: '#D4AF37',
  },
  modeToggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  modeToggleTextActive: {
    color: '#E2B048',
  },
});
