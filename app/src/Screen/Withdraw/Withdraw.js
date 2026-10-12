import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { screenWidth } from '../../constants/Sizes.constant';
import { base } from '../../config/appConfig';
import { postDataJsonWithAuth } from '../../services/Ops';
import { getApiCall } from '../../services/AppSetting';
import { Dialog } from '../../context/DialogContext';
import { useLanguage } from '../../context/LanguageContext';
import { get_profile, get_amount_setting } from '../../services/User';
import {
  BackArrow,
  WalletIcon,
  ChevronDown,
  ArrowUpIcon,
  ClockIcon,
} from '../../component/MatkaIcons';

export default function Withdraw(props) {
  const insets = useSafeAreaInsets();
  const { strings } = useLanguage();
  const [amount, setAmount] = useState('');
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [bankDetails, setBankDetails] = useState(null);
  const [amountSetting, setAmountSetting] = useState({});
  const [userName, setUserName] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates?.height || 280);
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const _goBack = () => props.navigation.goBack();

  useEffect(() => {
    get_data();
    get_data_withdraw();
    fetchBankDetails();

    const unsubscribe = props.navigation.addListener('focus', () => {
      get_data();
      get_data_withdraw();
      fetchBankDetails();
    });
    return unsubscribe;
  }, [props.navigation]);

  const get_data = async () => {
    const userData = await get_profile();
    setAmountSetting(await get_amount_setting());
    setWallet(userData?.wallet ?? 0);
    setUserName(userData?.name || 'User');
  };

  const isWithinWithdrawalTime = () => {
    const start = amountSetting.withdrawal_start_time;
    const end = amountSetting.withdrawal_end_time;
    if (!start || !end) return true;
    const now = new Date();
    const [sh, sm] = (start || '').split(':').map(Number);
    const [eh, em] = (end || '').split(':').map(Number);
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const startMins = sh * 60 + sm;
    const endMins = eh * 60 + em;
    return nowMins >= startMins && nowMins <= endMins;
  };

  const fetchBankDetails = async () => {
    try {
      const result = await getApiCall(base.getBank);
      const bank = result?.data?.bank || result?.data;
      if (bank && bank.account_number && bank.account_number !== 'undefined') {
        setBankDetails(bank);
      } else {
        setBankDetails(null);
      }
    } catch (e) {
      setBankDetails(null);
    }
  };

  const get_data_withdraw = async () => {
    try {
      const result = await getApiCall(base.getWithdrawList + '?limit=50');
      let items = [];
      if (Array.isArray(result?.data)) {
        items = result.data;
      } else if (Array.isArray(result?.data?.withdrawals)) {
        items = result.data.withdrawals;
      } else if (Array.isArray(result?.result)) {
        items = result.result;
      } else if (Array.isArray(result?.withdrawals)) {
        items = result.withdrawals;
      } else if (Array.isArray(result?.history)) {
        items = result.history;
      }
      setList(items);
    } catch (e) {
      setList([]);
    }
  };

  const formatWithdrawDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      return String(dateStr);
    }
  };

  const send_request_handler = async () => {
    Keyboard.dismiss();
    const amountNum = parseFloat(amount);
    if (!amount || amount === '') {
      Dialog.show({ type: 'error', text1: 'Withdraw Error', text2: 'Please enter amount' });
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0) {
      Dialog.show({ type: 'error', text1: 'Withdraw Error', text2: 'Please enter valid amount' });
      return;
    }
    const minW = Number(amountSetting.min_withdrawal) || 500;
    const maxW = Number(amountSetting.max_withdrawal) || 2000000;
    if (minW > 0 && amountNum < minW) {
      Dialog.show({ type: 'error', text1: 'Withdraw Error', text2: `Minimum withdrawal is ₹ ${minW}` });
      return;
    }
    if (maxW > 0 && amountNum > maxW) {
      Dialog.show({ type: 'error', text1: 'Withdraw Error', text2: `Maximum withdrawal is ₹ ${maxW}` });
      return;
    }
    if (!isWithinWithdrawalTime()) {
      Dialog.show({
        type: 'error',
        text1: 'Withdraw Closed',
        text2: `Withdrawal allowed between ${amountSetting.withdrawal_start_time} - ${amountSetting.withdrawal_end_time}`,
      });
      return;
    }
    if (!bankDetails || !bankDetails.account_number) {
      Dialog.show({ type: 'error', text1: 'Bank Required', text2: 'Please add bank details first' });
      props.navigation.navigate('BankDetails', { type: 'bank' });
      return;
    }

    setLoading(true);
    try {
      const body = {
        amount: amountNum,
        bankId: String(bankDetails.id || '1'),
        remark: `Withdrawal to ${bankDetails?.bank_name || 'Bank'} (${String(bankDetails?.account_number || '').slice(-4)})`,
      };
      const result = await postDataJsonWithAuth(base.sendWithdraw, body);

      if (result?.status === true || result?.success === '1') {
        Dialog.show({
          type: 'success',
          text1: 'Success',
          text2: result?.message || result?.msg || 'Withdraw request submitted successfully',
        });
        setAmount('');
        get_data();
        get_data_withdraw();
      } else {
        Dialog.show({
          type: 'error',
          text1: 'Error',
          text2: result?.message || result?.msg || 'Failed to submit withdraw request',
        });
      }
    } catch (error) {
      Dialog.show({ type: 'error', text1: 'Network Error', text2: 'Please check your connection' });
    } finally {
      setLoading(false);
    }
  };

  const minAmount = amountSetting.min_withdrawal || '500';
  const maxAmount = amountSetting.max_withdrawal || '2000000';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      {/* TOP HEADER */}
      <View style={styles.headerBar}>
        <TouchableOpacity activeOpacity={0.8} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} onPress={_goBack} style={styles.backCircleBtn}>
          <BackArrow size={20} color="#E2B048" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{strings.withdraw_title || 'फंड निकालें'}</Text>

        <View style={styles.walletBadge}>
          <WalletIcon size={16} color="#E2B048" />
          <Text style={styles.walletText}> ₹{wallet}</Text>
        </View>
      </View>

      {/* BODY WRAPPER */}
      <View style={styles.bodyWrapper}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
        <FlatList
          data={list}
          keyExtractor={(item) => String(item.id || item.request_no || Math.random())}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: keyboardHeight > 0 ? keyboardHeight + 80 : 50 + insets.bottom,
          }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ClockIcon size={36} color="#A0AEC0" />
            <Text style={styles.emptyTitle}>
              {strings.no_withdraw_history || 'No Withdrawal History Yet'}
            </Text>
            <Text style={styles.emptySub}>
              {strings.no_withdraw_history_sub || 'Your withdrawal requests and status will appear here.'}
            </Text>
          </View>
        }
        ListHeaderComponent={
          <View>
            {/* LIMIT SUBHEADER STRIP */}
            <View style={styles.limitStrip}>
              <Text style={styles.limitText}>
                Min Withdraw: ₹{minAmount}  Max Withdraw: ₹{maxAmount}
              </Text>
            </View>

            {/* REQUEST WITHDRAWAL CARD */}
            <View style={styles.cardContainer}>
              <Text style={styles.cardTitle}>{strings.request_withdrawal || 'Request Withdrawal'}</Text>

              {/* Amount input */}
              <Text style={styles.inputLabel}>{strings.amount_label || 'Amount (₹):'}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder={strings.amount_placeholder || 'राशि दर्ज करें'}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>

              {/* Method selection */}
              <Text style={styles.inputLabel}>{strings.method_label || 'Method:'}</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.methodSelector}
                onPress={() => props.navigation.navigate('BankDetails', { type: 'bank' })}
              >
                <Text style={styles.methodText} numberOfLines={1}>
                  {bankDetails
                    ? `${bankDetails.bank_name || 'Bank'} - ****${String(
                        bankDetails.account_number || '',
                      ).slice(-4)}`
                    : (strings.select_method || 'Select Method')}
                </Text>
                <ChevronDown size={18} color="#061224" />
              </TouchableOpacity>

              {/* Submit button */}
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={loading}
                style={styles.submitBtn}
                onPress={send_request_handler}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitBtnText}>{strings.submit_withdrawal || 'SUBMIT WITHDRAWAL'}</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* STATS & HISTORY HEADER */}
            <View style={styles.historySectionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ClockIcon size={18} color="#C2410C" />
                <Text style={styles.historySectionTitle}>
                  {' '}{strings.withdraw_history_title || 'Withdrawal History'}
                </Text>
                {list && list.length > 0 && (
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{list.length}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={get_data_withdraw}
                style={styles.refreshPill}
              >
                <Text style={styles.refreshPillText}>🔄 {strings.refresh || 'Refresh'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const isApproved = item.status === '1' || item.status === 1;
          const isRejected = item.status === '-1' || item.status === -1;
          const isPending = item.status === '0' || item.status === 0;

          const statusText = isApproved
            ? (strings.status_approved || 'Approved')
            : isRejected
            ? (strings.status_rejected || 'Rejected')
            : (strings.status_pending || 'Pending');

          const statusBg = isApproved
            ? '#DEF7EC'
            : isRejected
            ? '#FDE8E8'
            : '#FEF3C7';

          const statusColor = isApproved
            ? '#03543F'
            : isRejected
            ? '#9B1C1C'
            : '#92400E';

          const circleBg = isApproved
            ? '#059669'
            : isRejected
            ? '#DC2626'
            : '#D97706';

          const amt = item.points || item.amount || 0;
          const dateFormatted = formatWithdrawDate(item.date);
          const title = item.remark || `Withdraw Request #${item.request_no || item.id}`;

          return (
            <View style={styles.historyItemCard}>
              {/* Left: Status Icon Circle */}
              <View style={[styles.arrowCircle, { backgroundColor: circleBg }]}>
                <ArrowUpIcon size={20} color="#FFFFFF" />
              </View>

              {/* Center Info */}
              <View style={styles.historyItemCenter}>
                <Text style={styles.historyItemName} numberOfLines={1}>
                  ₹{amt} Withdraw
                </Text>
                <Text style={styles.historyItemSubtitle} numberOfLines={1}>
                  {title}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <View style={[styles.statusChip, { backgroundColor: statusBg }]}>
                    <Text style={[styles.statusChipText, { color: statusColor }]}>
                      {statusText}
                    </Text>
                  </View>
                  <Text style={[styles.historyItemTime, { marginLeft: 8 }]}>{dateFormatted}</Text>
                </View>
              </View>

              {/* Right: Amount */}
              <View style={styles.historyItemRight}>
                <Text style={styles.historyItemAmount}>-₹{amt}</Text>
                {item.request_no ? (
                  <Text style={styles.requestNoText}>#{item.request_no}</Text>
                ) : null}
              </View>
            </View>
          );
        }}
      />
      </KeyboardAvoidingView>
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
    backgroundColor: '#F5F5F7',
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#E2B048',
    letterSpacing: 0.3,
  },
  walletBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2B048',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: 'rgba(226, 176, 72, 0.08)',
  },
  walletText: {
    color: '#E2B048',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 3,
  },
  limitStrip: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  limitText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  limitValue: {
    color: '#0F172A',
    fontWeight: '800',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    borderRadius: 18,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#061224',
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A202C',
    marginTop: 14,
    marginBottom: 6,
  },
  inputWrapper: {
    borderWidth: 1.5,
    borderColor: '#CBD5E0',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A202C',
    height: 48,
  },
  methodSelector: {
    borderWidth: 2,
    borderColor: '#061224',
    borderRadius: 12,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  methodText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A202C',
    flex: 1,
  },
  submitBtn: {
    backgroundColor: '#061224',
    borderRadius: 24,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginTop: 18,
    marginBottom: 12,
  },
  activePill: {
    backgroundColor: '#FCECEE',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  activePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D3748',
  },
  activeNumber: {
    color: '#2B6CB0',
    fontWeight: '800',
  },
  historyPill: {
    backgroundColor: '#FEEBE3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  historyPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C05621',
  },
  historyItemCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    marginBottom: 10,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  arrowCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#061224',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyItemCenter: {
    flex: 1,
    marginLeft: 14,
  },
  historyItemName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#061224',
  },
  historyItemSubtitle: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  historyItemTime: {
    fontSize: 11,
    color: '#A0AEC0',
    marginTop: 2,
  },
  historyItemRight: {
    alignItems: 'flex-end',
  },
  historyItemAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#D90429',
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  requestNoText: {
    fontSize: 11,
    color: '#718096',
    fontWeight: '600',
    marginTop: 2,
  },
  historySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  historySectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#061224',
  },
  countBadge: {
    backgroundColor: '#061224',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 1,
    marginLeft: 6,
  },
  countBadgeText: {
    color: '#E2B048',
    fontSize: 11,
    fontWeight: '800',
  },
  refreshPill: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  refreshPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A5568',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4A5568',
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12.5,
    color: '#A0AEC0',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
});