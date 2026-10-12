/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { get_profile } from '../../services/User';
import { getApiCall } from '../../services/AppSetting';
import { base } from '../../config/appConfig';
import Loading from '../../component/loading';
import {
  BackArrow,
  RupeeIcon,
  AtmCardIcon,
  BankBuildingIcon,
  WalletUploadIcon,
  PhoneCardIcon,
  ChevronRight,
  CloseIcon,
} from '../../component/MatkaIcons';
import { useLanguage } from '../../context/LanguageContext';

export default function Wallet(props) {
  const insets = useSafeAreaInsets();
  const { strings } = useLanguage();
  const [wallet, setWallet] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);

  useEffect(() => {
    get_data();
    fetchDepositHistory();
  }, [props]);

  const get_data = async () => {
    const userData = await get_profile();
    setWallet(userData?.wallet ?? 0);
  };

  const fetchDepositHistory = async (skipLoading = false) => {
    if (!skipLoading) setLoading(true);
    try {
      const result = await getApiCall(`${base.getDepositHistory}?limit=20`);
      if (result?.status === true && result?.data) {
        const deposits = result.data.deposits ?? result.data.history ?? result.data ?? [];
        setHistory(Array.isArray(deposits) ? deposits : []);
      } else {
        setHistory([]);
      }
    } catch (e) {
      setHistory([]);
    } finally {
      if (!skipLoading) setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await get_data();
    await fetchDepositHistory(true);
    setRefreshing(false);
  };

  const _goBack = () => props.navigation.goBack();

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const actionCards = [
    {
      id: 'add_funds',
      title: strings.add_funds_title || 'Add Funds',
      subtitle: strings.add_funds_sub || 'Instantly add money to wallet',
      icon: <RupeeIcon size={22} color="#FFFFFF" />,
      arrowColor: '#9CA3AF',
      action: () => props.navigation.navigate('AddFund'),
    },
    {
      id: 'withdraw',
      title: strings.withdraw_funds_title || 'Withdraw',
      subtitle: strings.withdraw_funds_sub || 'Request withdrawal winnings',
      icon: <AtmCardIcon size={22} color="#FFFFFF" />,
      arrowColor: '#DC2626',
      action: () => props.navigation.navigate('Withdraw'),
    },
    {
      id: 'bank_detail',
      title: strings.bank_detail_title || 'Bank Detail',
      subtitle: strings.bank_detail_sub || 'Manage bank for withdrawals',
      icon: <BankBuildingIcon size={22} color="#FFFFFF" />,
      arrowColor: '#9333EA',
      action: () => props.navigation.navigate('BankDetails'),
    },
    {
      id: 'add_history',
      title: strings.add_history_title || 'Add Fund History',
      subtitle: strings.add_history_sub || 'Recharge and manual add records',
      icon: <WalletUploadIcon size={22} color="#FFFFFF" />,
      arrowColor: '#16A34A',
      action: () => props.navigation.navigate('Passbook', { initialTab: 'all' }),
    },
    {
      id: 'withdraw_history',
      title: strings.withdraw_history_title || 'Withdraw Fund History',
      subtitle: strings.withdraw_history_sub || 'Pending and success requests',
      icon: <PhoneCardIcon size={22} color="#FFFFFF" />,
      arrowColor: '#EA580C',
      action: () => props.navigation.navigate('Passbook', { initialTab: 'debit' }),
    },
  ];

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.backBtn}
          onPress={_goBack}
        >
          <BackArrow size={20} color="#E2B048" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{strings.funds_title || 'Funds'}</Text>
        <View style={styles.walletBadge}>
          <Text style={styles.walletBadgeText}>₹{wallet}</Text>
        </View>
      </View>

      {loading && <Loading />}

      {/* FUNDS ACTION CARDS LIST */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E2B048" />
        }
      >
        {actionCards.map((card) => (
          <TouchableOpacity
            key={card.id}
            activeOpacity={0.85}
            style={styles.fundCard}
            onPress={card.action}
          >
            {/* Circular Dark Gold Icon Badge */}
            <LinearGradient
              colors={['#2D1F00', '#5E4105', '#8C600B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconCircle}
            >
              {card.icon}
            </LinearGradient>

            {/* Title & Subtitle */}
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
            </View>

            {/* Arrow */}
            <View style={styles.arrowContainer}>
              <ChevronRight size={18} color={card.arrowColor} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* MODAL: ADD FUND HISTORY */}
      <Modal
        visible={historyModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setHistoryModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{strings.add_history_title || 'Add Fund History'}</Text>
              <TouchableOpacity
                onPress={() => setHistoryModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <CloseIcon size={20} color="#061224" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={history}
              keyExtractor={(item) =>
                item.id?.toString() || item.created_at || Math.random().toString()
              }
              style={{ maxHeight: 400 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const remark = item.remark ?? item.description ?? item.type ?? 'Deposit';
                const date = formatDate(item.date ?? item.created_at);
                const amount = item.amount ?? 0;
                return (
                  <View style={styles.historyCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.historyRemark}>{remark}</Text>
                      <Text style={styles.historyDate}>{date}</Text>
                    </View>
                    <Text style={styles.historyAmount}>+₹{amount}</Text>
                  </View>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No deposit history yet</Text>
                </View>
              }
            />
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
  scrollContainer: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    backgroundColor: '#061224',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2B048',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(226, 176, 72, 0.08)',
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: '#E2B048',
    letterSpacing: 0.3,
  },
  walletBadge: {
    backgroundColor: 'rgba(226, 176, 72, 0.15)',
    borderWidth: 1,
    borderColor: '#E2B048',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  walletBadgeText: {
    color: '#E2B048',
    fontSize: 14,
    fontWeight: '800',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },
  fundCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#061224',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: '#C58B24',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#061224',
    letterSpacing: 0.2,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 3,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#061224',
  },
  modalCloseBtn: {
    padding: 4,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historyRemark: {
    fontSize: 15,
    fontWeight: '700',
    color: '#061224',
  },
  historyDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#16A34A',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
  },
});
