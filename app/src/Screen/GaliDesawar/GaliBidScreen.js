/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackArrow, WalletIcon } from '../../component/MatkaIcons';
import { get_wallet, get_profile } from '../../services/User';
import { postDataJsonWithAuth } from '../../services/Ops';
import { base } from '../../config/appConfig';
import { Dialog } from '../../context/DialogContext';
import Loading from '../../component/loading';
import { useLanguage } from '../../context/LanguageContext';
import DropDownCom from '../../component/DropDownCom';
import { gameList1, gameList2 } from '../../enums/panaList';

const QUICK_POINTS = [10, 50, 100, 200, 500, 1000];
const SINGLE_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export default function GaliBidScreen(props) {
  const insets = useSafeAreaInsets();
  const { strings } = useLanguage();
  const { market = { name: 'FARIDABAD', id: '103' }, gameType = 'Left Digit', wallet } =
    props.route.params || {};

  const [walletBalance, setWalletBalance] = useState(Number(wallet) || 0);
  const [digitInput, setDigitInput] = useState('');
  const [pointsInput, setPointsInput] = useState('');
  const [bidsList, setBidsList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Today's formatted date e.g. "22-Sep-2026"
  const getFormattedDate = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const isJodi = gameType === 'Jodi Digit';
  const digitLabel = isJodi
    ? (strings.jodi_digit || strings.jodi || 'Jodi')
    : gameType === 'Left Digit'
      ? (strings.left_digit || 'Left Digit')
      : (strings.right_digit || 'Right Digit');

  const digitPlaceholder = isJodi
    ? (strings.enter_jodi || 'Enter Jodi (00-99)')
    : (strings.enter_digit || 'Enter Digit (0-9)');
  const maxDigitLength = isJodi ? 2 : 1;

  const galiOptions = React.useMemo(() => {
    return isJodi ? gameList2 : gameList1;
  }, [isJodi]);

  // Robust Wallet Fetching: Cache first + Live API fallback
  const fetchBalance = useCallback(async () => {
    try {
      const bal = await get_wallet();
      if (bal !== undefined && bal !== null && !isNaN(bal) && Number(bal) > 0) {
        setWalletBalance(Number(bal));
        return;
      }
      // Fallback to get_profile
      const prof = await get_profile();
      if (prof?.wallet !== undefined && prof?.wallet !== null) {
        setWalletBalance(Number(prof.wallet) || 0);
        return;
      }
    } catch (e) {
      console.log('Error fetching live wallet:', e);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      // 1. Immediately read cached wallet from AsyncStorage
      try {
        const stored = await AsyncStorage.getItem('userData');
        if (stored) {
          const parsed = JSON.parse(stored);
          const cachedBal = parsed?.wallet ?? parsed?.user?.wallet;
          if (cachedBal !== undefined && cachedBal !== null && isMounted) {
            setWalletBalance(Number(cachedBal));
          }
        }
      } catch (_) { }

      // 2. Fetch fresh live balance
      if (isMounted) {
        await fetchBalance();
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [fetchBalance]);

  const totalPoints = bidsList.reduce(
    (sum, item) => sum + Number(item.points || 0),
    0
  );

  const handleQuickPoint = (val) => {
    const cur = parseInt(pointsInput, 10) || 0;
    setPointsInput(String(cur + val));
  };

  const handleAddBid = () => {
    const cleanDigit = digitInput.trim();
    if (!cleanDigit) {
      Dialog.show({
        type: 'error',
        text1: 'Validation Error',
        text2: `Please enter valid ${digitLabel}`,
      });
      return;
    }

    if (isJodi && cleanDigit.length !== 2) {
      Dialog.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Jodi digit must be 2 digits (00-99)',
      });
      return;
    }

    if (!isJodi && cleanDigit.length !== 1) {
      Dialog.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Single digit must be 1 digit (0-9)',
      });
      return;
    }

    const pointsNum = parseInt(pointsInput, 10);
    if (!pointsNum || pointsNum < 10) {
      Dialog.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Minimum bid points is 10',
      });
      return;
    }

    // Check if duplicate digit already exists in current list
    const existingIndex = bidsList.findIndex((b) => b.digit === cleanDigit);
    if (existingIndex >= 0) {
      const updated = [...bidsList];
      updated[existingIndex].points += pointsNum;
      setBidsList(updated);
    } else {
      const newBid = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
        digit: cleanDigit,
        points: pointsNum,
        gameType,
      };
      setBidsList([...bidsList, newBid]);
    }

    setDigitInput('');
    setPointsInput('');
  };

  const handleDeleteBid = (bidId) => {
    setBidsList(bidsList.filter((b) => b.id !== bidId));
  };

  const handleSubmitBids = async () => {
    if (bidsList.length === 0) {
      Dialog.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please add at least one bid.',
      });
      return;
    }

    if (totalPoints > walletBalance) {
      Dialog.show({
        type: 'error',
        text1: 'Insufficient Balance',
        text2: 'You do not have enough points in your wallet.',
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        market_id: market.id,
        market_name: market.name || market.game_name,
        game_name: market.name || market.game_name,
        game_type: gameType,
        bids: bidsList.map((item) => ({
          digit: String(item.digit).trim(),
          points: Number(item.points),
          game_type: item.gameType || gameType,
          market_id: market.id,
          market_name: market.name || market.game_name,
          game_name: market.name || market.game_name,
        })),
      };

      const res = await postDataJsonWithAuth(base.galiPlaceBid, payload);
      setLoading(false);

      if (res && (res.status === true || res.success === '1' || res.success === 1)) {
        Dialog.show({
          type: 'success',
          text1: 'Congratulations!',
          text2: res.msg || 'Bids placed successfully.',
        });
        setBidsList([]);
        if (res.new_balance !== undefined && res.new_balance !== null) {
          setWalletBalance(Number(res.new_balance));
        } else {
          setWalletBalance((prev) => Math.max(0, prev - totalPoints));
          fetchBalance();
        }
      } else {
        Dialog.show({
          type: 'error',
          text1: 'Bid Error',
          text2: (res && (res.msg || res.error)) || 'Could not place bid. Please try again.',
        });
      }
    } catch (e) {
      setLoading(false);
      Dialog.show({
        type: 'error',
        text1: 'Error',
        text2: e.message || 'Something went wrong.',
      });
    }
  };

  // Safe bottom clearance for Android navigation bar and iOS home indicator
  const bottomInset = Platform.OS === 'android' ? Math.max(insets.bottom + 12, 68) : (insets.bottom > 0 ? insets.bottom + 12 : 16);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backCircleBtn}
          onPress={() => props.navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <BackArrow size={20} color="#E2B048" />
        </TouchableOpacity>

        <View style={styles.headerTitleCol}>
          <Text style={styles.headerMarketName} numberOfLines={1}>
            {market.name || market.game_name || 'GALI DESAWAR'}
          </Text>
          <View style={styles.gameTypeBadge}>
            <Text style={styles.gameTypeBadgeText}>{gameType}</Text>
          </View>
        </View>

        {/* Live Wallet Chip */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={fetchBalance}
          style={styles.walletPill}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <WalletIcon size={16} color="#E2B048" />
          <Text style={styles.walletBalanceText}>₹{walletBalance}</Text>
        </TouchableOpacity>
      </View>

      {/* BODY CONTENT WRAPPER */}
      <View style={styles.bodyWrapper}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 130 + bottomInset }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* DATE PILL BANNER */}
          <View style={styles.datePillWrapper}>
            <View style={styles.datePill}>
              <Text style={styles.datePillText}>📅 {getFormattedDate()}</Text>
            </View>
          </View>

          {/* QUICK 0-9 DIGIT BOARD (FOR LEFT / RIGHT SINGLE DIGIT) */}
          {!isJodi && (
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardHeaderTitle}>SELECT {digitLabel.toUpperCase()} (0-9)</Text>
                {digitInput !== '' && (
                  <View style={styles.selectedDigitChip}>
                    <Text style={styles.selectedDigitText}>Selected: {digitInput}</Text>
                  </View>
                )}
              </View>
              <View style={styles.singleDigitsGrid}>
                {SINGLE_DIGITS.map((d) => {
                  const isSelected = digitInput === d;
                  return (
                    <TouchableOpacity
                      key={d}
                      activeOpacity={0.75}
                      style={[styles.singleDigitBtn, isSelected && styles.singleDigitBtnActive]}
                      onPress={() => setDigitInput(d)}
                    >
                      <Text style={[styles.singleDigitNum, isSelected && styles.singleDigitNumActive]}>
                        {d}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* PLACE BET FORM CARD */}
          <View style={styles.betCard}>
            <View style={styles.betCardHeader}>
              <Text style={styles.betCardHeaderText}>{strings.place_bet || 'Place Bet'}</Text>
            </View>

            <View style={styles.betCardBody}>
              {/* Digit Input */}
              <View style={styles.formRow}>
                <Text style={styles.inputLabel}>{digitLabel}</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={digitPlaceholder}
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  maxLength={maxDigitLength}
                  value={digitInput}
                  onChangeText={(val) => setDigitInput(val.replace(/[^0-9]/g, ''))}
                />
              </View>

              {/* Optional Searchable Dropdown for Jodi */}
              {isJodi && (
                <View style={styles.dropdownRow}>
                  <Text style={styles.dropdownLabel}>Or Select Jodi from list:</Text>
                  <View style={styles.dropdownWrap}>
                    <DropDownCom
                      width="100%"
                      backgroundColor="#061224"
                      borderColor="#1E3A5F"
                      search={true}
                      name={''}
                      placeholder="Select / Search Jodi..."
                      value={digitInput}
                      setName={() => { }}
                      setId={(val) => setDigitInput(String(val))}
                      list={galiOptions}
                      onPress={(val) => setDigitInput(String(val))}
                      bgType={'White'}
                      id={digitInput}
                    />
                  </View>
                </View>
              )}

              {/* Points Input */}
              <View style={styles.formRow}>
                <Text style={styles.inputLabel}>{strings.bid_points || 'Bid Points'}</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={strings.enter_points || 'Enter Points (min 10)'}
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={pointsInput}
                  onChangeText={(val) => setPointsInput(val.replace(/[^0-9]/g, ''))}
                />
              </View>

              {/* Quick Points Chips */}
              <View style={styles.quickPointsRow}>
                {QUICK_POINTS.map((amt) => (
                  <TouchableOpacity
                    key={amt}
                    activeOpacity={0.75}
                    style={styles.pointChip}
                    onPress={() => handleQuickPoint(amt)}
                  >
                    <Text style={styles.pointChipText}>+{amt}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  activeOpacity={0.75}
                  style={styles.pointClearChip}
                  onPress={() => setPointsInput('')}
                >
                  <Text style={styles.pointClearText}>Clear</Text>
                </TouchableOpacity>
              </View>

              {/* Add Bid Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.addBidBtnTouch}
                onPress={handleAddBid}
              >
                <LinearGradient
                  colors={['#D8B87E', '#C6A15E', '#B38B47', '#9C7430']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.addBidBtnGradient}
                >
                  <Text style={styles.addBidBtnText}>+ {strings.add_bid || 'Add Bid'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* BID LIST SECTION */}
          <View style={styles.bidListWrapper}>
            <View style={styles.bidListHeader}>
              <Text style={styles.bidListHeaderText}>
                {strings.bid_list || 'BID LIST'} ({bidsList.length})
              </Text>
              {bidsList.length > 0 && (
                <TouchableOpacity activeOpacity={0.7} onPress={() => setBidsList([])}>
                  <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>

            {bidsList.length === 0 ? (
              <View style={styles.emptyBidList}>
                <Text style={styles.emptyBidText}>{strings.no_bids_added || 'No bids added yet'}</Text>
              </View>
            ) : (
              <View style={styles.bidsTable}>
                {bidsList.map((bid, index) => (
                  <View key={bid.id || index} style={styles.bidRow}>
                    <View style={styles.bidColDigit}>
                      <Text style={styles.bidDigitLabel}>{strings.digit || 'Digit'}: </Text>
                      <Text style={styles.bidDigitVal}>{bid.digit}</Text>
                    </View>
                    <View style={styles.bidColPoints}>
                      <Text style={styles.bidPointsLabel}>{strings.points || 'Points'}: </Text>
                      <Text style={styles.bidPointsVal}>₹{bid.points}</Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.deleteBtn}
                      onPress={() => handleDeleteBid(bid.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={styles.deleteBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* STICKY BOTTOM FOOTER BAR (Elevated above Android Back Navigation Bar) */}
        {bidsList.length > 0 && (
          <View style={[styles.bottomBar, { paddingBottom: bottomInset, paddingTop: 12 }]}>
            <View style={styles.bottomCol}>
              <Text style={styles.bottomLabel}>{strings.bids_count_label || 'BIDS'}</Text>
              <Text style={styles.bottomVal}>{bidsList.length}</Text>
            </View>

            <View style={styles.bottomCol}>
              <Text style={styles.bottomLabel}>{strings.total_label || 'TOTAL'}</Text>
              <Text style={styles.bottomValTotal}>₹{totalPoints}</Text>
            </View>

            {/* Submit Bid Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.submitBtnTouch}
              onPress={handleSubmitBids}
              disabled={loading}
            >
              <LinearGradient
                colors={['#E2B048', '#C6922A', '#A27018']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitBtnGradient}
              >
                <Text style={styles.submitBtnText}>{strings.submit_bid || 'SUBMIT BIDS'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {loading && <Loading />}
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  backCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#E2B048',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(226, 176, 72, 0.1)',
    marginRight: 12,
  },
  headerTitleCol: {
    flex: 1,
    justifyContent: 'center',
  },
  headerMarketName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#E2B048',
    letterSpacing: 0.4,
  },
  gameTypeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(226, 176, 72, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
    borderWidth: 0.8,
    borderColor: 'rgba(226, 176, 72, 0.3)',
  },
  gameTypeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  walletPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2B048',
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(226, 176, 72, 0.12)',
  },
  walletBalanceText: {
    color: '#E2B048',
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 5,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  datePillWrapper: {
    alignItems: 'center',
    marginBottom: 12,
  },
  datePill: {
    backgroundColor: '#EEF2F6',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 18,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  datePillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.3,
  },

  // 0-9 Quick Single Digits Grid
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0A192F',
    letterSpacing: 0.5,
  },
  selectedDigitChip: {
    backgroundColor: 'rgba(226, 176, 72, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2B048',
  },
  selectedDigitText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0A192F',
  },
  singleDigitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  singleDigitBtn: {
    width: '18%',
    aspectRatio: 1.1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleDigitBtnActive: {
    backgroundColor: '#0A192F',
    borderColor: '#E2B048',
    borderWidth: 2,
    transform: [{ scale: 1.05 }],
  },
  singleDigitNum: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  singleDigitNumActive: {
    color: '#E2B048',
  },

  // Place Bet Form Card
  betCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    elevation: 2,
  },
  betCardHeader: {
    backgroundColor: '#0A192F',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  betCardHeaderText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  betCardBody: {
    padding: 14,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputLabel: {
    width: 90,
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  textInput: {
    flex: 1,
    height: 44,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  dropdownRow: {
    marginBottom: 12,
  },
  dropdownLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
  },
  dropdownWrap: {
    width: '100%',
  },
  quickPointsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  pointChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#EEF2F6',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  pointChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  pointClearChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  pointClearText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EF4444',
  },
  addBidBtnTouch: {
    height: 46,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  addBidBtnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  addBidBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  // Bid List
  bidListWrapper: {
    marginBottom: 20,
  },
  bidListHeader: {
    backgroundColor: '#0A192F',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bidListHeaderText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  clearAllText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '800',
  },
  emptyBidList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyBidText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  bidsTable: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  bidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  bidColDigit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bidDigitLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  bidDigitVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  bidColPoints: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bidPointsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  bidPointsVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#D4AF37',
  },
  deleteBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '900',
  },

  // Bottom Sticky Action Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0B1E38',
    borderTopWidth: 1,
    borderTopColor: '#1A3358',
    paddingTop: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 16,
    zIndex: 999,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -3 },
  },
  bottomCol: {
    alignItems: 'flex-start',
  },
  bottomLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.4,
  },
  bottomVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  bottomValTotal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#E2B048',
  },
  submitBtnTouch: {
    borderRadius: 10,
    overflow: 'hidden',
    minWidth: 140,
    elevation: 3,
  },
  submitBtnGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#061224',
    letterSpacing: 0.5,
  },
});
