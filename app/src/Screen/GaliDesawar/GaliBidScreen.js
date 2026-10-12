/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackArrow, WalletIcon } from '../../component/MatkaIcons';
import { get_wallet } from '../../services/User';
import { postDataJsonWithAuth } from '../../services/Ops';
import { base } from '../../config/appConfig';
import { Dialog } from '../../context/DialogContext';
import Loading from '../../component/loading';
import { useLanguage } from '../../context/LanguageContext';
import DropDownCom from '../../component/DropDownCom';
import { gameList1, gameList2 } from '../../enums/panaList';

export default function GaliBidScreen(props) {
  const insets = useSafeAreaInsets();
  const { strings } = useLanguage();
  const { market = { name: 'FARIDABAD', id: '103' }, gameType = 'Left Digit' } =
    props.route.params || {};

  const [walletBalance, setWalletBalance] = useState(0);
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

  const digitPlaceholder = isJodi ? (strings.enter_jodi || 'Enter Jodi Digits') : (strings.enter_digit || 'Enter Digits');
  const maxDigitLength = isJodi ? 2 : 1;

  const galiOptions = React.useMemo(() => {
    return isJodi ? gameList2 : gameList1;
  }, [isJodi]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const bal = await get_wallet();
        setWalletBalance(bal || 0);
      } catch (e) {}
    };
    fetchBalance();
  }, []);

  const totalPoints = bidsList.reduce(
    (sum, item) => sum + Number(item.points || 0),
    0
  );

  const handleAddBid = () => {
    if (!digitInput.trim()) {
      Dialog.show({
        type: 'error',
        text1: 'Validation Error',
        text2: `Please enter valid ${digitLabel}`,
      });
      return;
    }

    if (isJodi && digitInput.trim().length !== 2) {
      Dialog.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Jodi digit must be 2 digits (00-99)',
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

    const newBid = {
      id: Date.now().toString(),
      digit: digitInput.trim(),
      points: pointsNum,
      gameType,
    };

    setBidsList([...bidsList, newBid]);
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
        game_type: gameType,
        bids: bidsList.map((item) => ({
          digit: String(item.digit).trim(),
          points: Number(item.points),
          game_type: item.gameType || gameType,
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
          setWalletBalance(res.new_balance);
        } else {
          const newBal = await get_wallet();
          setWalletBalance(newBal || 0);
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
        <Text style={styles.headerTitle}>{gameType}</Text>

        {/* Wallet Pill Badge */}
        <View style={styles.walletPill}>
          <WalletIcon size={18} color="#E2B048" />
          <Text style={styles.walletBalanceText}>{walletBalance}</Text>
        </View>
      </View>

      {/* BODY CONTENT WRAPPER */}
      <View style={styles.bodyWrapper}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 90 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* DATE PILL BANNER */}
        <View style={styles.datePillWrapper}>
          <View style={styles.datePill}>
            <Text style={styles.datePillText}>{getFormattedDate()}</Text>
          </View>
        </View>

        {/* PLACE BET CARD */}
        <View style={styles.betCard}>
          <View style={styles.betCardHeader}>
            <Text style={styles.betCardHeaderText}>{strings.place_bet || 'Place Bet'}</Text>
          </View>

          <View style={styles.betCardBody}>
            {/* Input Row 1: Digit - Searchable Dropdown */}
            <View style={styles.formRow}>
              <Text style={styles.inputLabel}>{digitLabel}</Text>
              <DropDownCom
                width="100%"
                backgroundColor="#061224"
                borderColor="#1E3A5F"
                search={true}
                name={''}
                placeholder={digitPlaceholder}
                value={digitInput}
                setName={() => {}}
                setId={setDigitInput}
                list={galiOptions}
                onPress={(val) => setDigitInput(String(val))}
                bgType={'White'}
                id={digitInput}
              />
            </View>

            {/* Input Row 2: Points */}
            <View style={styles.formRow}>
              <Text style={styles.inputLabel}>{strings.bid_points || 'Bid Points'}</Text>
              <TextInput
                style={styles.textInput}
                placeholder={strings.enter_points || 'Enter Points'}
                placeholderTextColor="#A0AEC0"
                keyboardType="numeric"
                value={pointsInput}
                onChangeText={setPointsInput}
              />
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
                <Text style={styles.addBidBtnText}>{strings.add_bid || 'Add Bid'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* BID LIST SECTION */}
        <View style={styles.bidListWrapper}>
          <View style={styles.bidListHeader}>
            <Text style={styles.bidListHeaderText}>{strings.bid_list || 'BID LIST'}</Text>
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
                    <Text style={styles.bidPointsVal}>{bid.points}</Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.deleteBtn}
                    onPress={() => handleDeleteBid(bid.id)}
                  >
                    <Text style={styles.deleteBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* BOTTOM FOOTER BAR */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.bottomCol}>
          <Text style={styles.bottomLabel}>{strings.bids_count_label || 'BIDS'}</Text>
          <Text style={styles.bottomVal}>{bidsList.length}</Text>
        </View>

        <View style={styles.bottomCol}>
          <Text style={styles.bottomLabel}>{strings.total_label || 'TOTAL'}</Text>
          <Text style={styles.bottomVal}>₹{totalPoints}</Text>
        </View>

        {/* Submit Bid Button */}
        {bidsList.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.submitBtnTouch}
            onPress={handleSubmitBids}
          >
            <LinearGradient
              colors={['#D8B87E', '#C6A15E', '#9C7430']}
              style={styles.submitBtnGradient}
            >
              <Text style={styles.submitBtnText}>{strings.submit_bid || 'Submit'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
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
  walletPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2B048',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(226, 176, 72, 0.1)',
  },
  walletBalanceText: {
    color: '#E2B048',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 6,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 90,
  },
  datePillWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  datePill: {
    backgroundColor: '#EEF2F6',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  datePillText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  betCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
    elevation: 2,
  },
  betCardHeader: {
    backgroundColor: '#0A192F',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  betCardHeaderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  betCardBody: {
    padding: 16,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputLabel: {
    width: 100,
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  textInput: {
    flex: 1,
    height: 46,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  addBidBtnTouch: {
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 3,
    marginTop: 6,
  },
  addBidBtnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  addBidBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  bidListWrapper: {
    marginBottom: 20,
  },
  bidListHeader: {
    backgroundColor: '#0A192F',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  bidListHeaderText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  emptyBidList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyBidText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  bidsTable: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  bidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  bidColDigit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bidDigitLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  bidDigitVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  bidColPoints: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bidPointsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  bidPointsVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#D4AF37',
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '900',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
  },
  bottomCol: {
    alignItems: 'flex-start',
  },
  bottomLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  bottomVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  submitBtnTouch: {
    height: 40,
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 24,
    elevation: 3,
  },
  submitBtnGradient: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
