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
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { BackArrow, WalletIcon } from '../../component/MatkaIcons';
import { get_wallet } from '../../services/User';
import { postDataJsonWithAuth } from '../../services/Ops';
import { base } from '../../config/appConfig';
import { Dialog } from '../../context/DialogContext';
import Loading from '../../component/loading';
import { useLanguage } from '../../context/LanguageContext';
import DropDownCom from '../../component/DropDownCom';
import { gameList1, gameList3, gameList4, gameList5 } from '../../enums/panaList';

export default function StarlineBidScreen(props) {
  const insets = useSafeAreaInsets();
  const { strings } = useLanguage();
  const { market = { time: '7:05 PM', id: 's11' }, gameType = 'Double Pana' } =
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

  const isSingleDigit = gameType === 'Single Digit';
  const digitLabel = isSingleDigit
    ? (strings.single_digit || strings.digit || 'Digit')
    : (strings.pana || 'Pana');
  const digitPlaceholder = isSingleDigit
    ? (strings.enter_digit || 'Enter Digits')
    : (strings.enter_pana || 'Enter Pana');
  const maxDigitLength = isSingleDigit ? 1 : 3;

  const starlineOptions = React.useMemo(() => {
    if (gameType === 'Single Digit') return gameList1;
    if (gameType === 'Single Pana') return gameList3;
    if (gameType === 'Double Pana') return gameList4;
    if (gameType === 'Triple Pana') return gameList5;
    return [...gameList3, ...gameList4, ...gameList5];
  }, [gameType]);

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

    if (!isSingleDigit && digitInput.trim().length !== 3) {
      Dialog.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Pana must be 3 digits (e.g. 122, 123)',
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
      type: gameType,
      pana: digitInput.trim(),
      points: pointsNum,
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
      const d = new Date();
      const bidDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      let successCount = 0;
      for (let i = 0; i < bidsList.length; i++) {
        const item = bidsList[i];
        const payload = {
          market_id: Number(market.id) || market.id,
          gtype_id: isSingleDigit ? 8 : 10,
          bid_date: bidDate,
          session: 'open',
          open_digit: isSingleDigit ? item.pana : null,
          open_panna: !isSingleDigit ? item.pana : null,
          amount: Number(item.points),
        };

        const res = await postDataJsonWithAuth(base.betPlace, payload);
        if (res && (res.status === true || res.success === 1)) {
          successCount++;
        }
      }

      setLoading(false);
      if (successCount > 0) {
        Dialog.show({
          type: 'success',
          text1: 'Congratulations!',
          text2: 'Bids placed successfully.',
        });
        setBidsList([]);
        const newBal = await get_wallet();
        setWalletBalance(newBal || 0);
      } else {
        Dialog.show({
          type: 'error',
          text1: 'Bid Error',
          text2: 'Could not place bid. Please try again.',
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
          <Text style={styles.datePillText}>{getFormattedDate()}</Text>
        </View>

        {/* PLACE BET FORM */}
        <View style={styles.formContainer}>
          {/* Row 1: Pana / Digit - Searchable Dropdown */}
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>{digitLabel}</Text>
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
              list={starlineOptions}
              onPress={(val) => setDigitInput(String(val))}
              bgType={'White'}
              id={digitInput}
            />
          </View>

          {/* Row 2: Bid Points */}
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>{strings.bid_points || 'Bid Points'}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={strings.enter_points || 'Enter Points'}
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={pointsInput}
              onChangeText={setPointsInput}
            />
          </View>

          {/* Add Bid Button (Navy Blue pill with highlight matching Image 4 & 2) */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.addBidBtnTouch}
            onPress={handleAddBid}
          >
            <LinearGradient
              colors={['#0E2038', '#1A3358', '#0E2038']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addBidBtnGradient}
            >
              <Text style={styles.addBidBtnText}>{strings.add_bid || 'Add Bid'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* BIDS TABLE (Gold border outline matching Image 4 & 2) */}
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeaderRow}>
            <View style={[styles.tableHeaderCol, { flex: 1.2 }]}>
              <Text style={styles.tableHeaderText}>{strings.type || 'Type'}</Text>
            </View>
            <View style={[styles.tableHeaderCol, { flex: 1.2 }]}>
              <Text style={styles.tableHeaderText}>{isSingleDigit ? (strings.digit || 'Digit') : (strings.pana || 'Pana')}</Text>
            </View>
            <View style={[styles.tableHeaderCol, { flex: 1.5 }]}>
              <Text style={styles.tableHeaderText}>{strings.points || 'Point'}</Text>
            </View>
            <View style={[styles.tableHeaderCol, { flex: 1 }]}>
              <Text style={styles.tableHeaderText}>{strings.delete || 'Delete'}</Text>
            </View>
          </View>

          {/* Table Body */}
          {bidsList.length === 0 ? (
            <View style={styles.emptyTable}>
              <Text style={styles.emptyTableText}>{strings.no_bids_added || 'No bids added yet'}</Text>
            </View>
          ) : (
            bidsList.map((bid, index) => (
              <View key={bid.id || index} style={styles.tableBodyRow}>
                <View style={[styles.tableBodyCol, { flex: 1.2 }]}>
                  <Text style={styles.tableBodyText}>{bid.type}</Text>
                </View>
                <View style={[styles.tableBodyCol, { flex: 1.2 }]}>
                  <Text style={styles.tableBodyTextBold}>{bid.pana}</Text>
                </View>
                <View style={[styles.tableBodyCol, { flex: 1.5 }]}>
                  <Text style={styles.tableBodyTextBold}>{bid.points}</Text>
                </View>
                <View style={[styles.tableBodyCol, { flex: 1 }]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.deleteBtn}
                    onPress={() => handleDeleteBid(bid.id)}
                  >
                    <Text style={styles.deleteBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* BOTTOM FOOTER BAR */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.bottomCol}>
          <Text style={styles.bottomLabel}>{strings.bids_count_label || 'Bids'}</Text>
          <Text style={styles.bottomValRed}>{bidsList.length}</Text>
        </View>

        <View style={styles.bottomCol}>
          <Text style={styles.bottomLabel}>{strings.points || 'Points'}</Text>
          <Text style={styles.bottomValRed}>{totalPoints}</Text>
        </View>

        {/* Submit Bid Button (Gold Gradient) */}
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
    marginBottom: 20,
  },
  datePillText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  formContainer: {
    marginBottom: 22,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    width: 120,
  },
  textInput: {
    flex: 1,
    height: 48,
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  addBidBtnTouch: {
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 3,
    marginTop: 8,
  },
  addBidBtnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  addBidBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  tableContainer: {
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#FAF5EA',
    borderBottomWidth: 1.5,
    borderBottomColor: '#D4AF37',
  },
  tableHeaderCol: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#D4AF37',
  },
  tableHeaderText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  tableBodyRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableBodyCol: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  tableBodyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tableBodyTextBold: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptyTable: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyTableText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
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
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FDECEF',
    borderTopWidth: 1,
    borderTopColor: '#FECDD3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
  },
  bottomCol: {
    alignItems: 'center',
    minWidth: 60,
  },
  bottomLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  bottomValRed: {
    fontSize: 17,
    fontWeight: '900',
    color: '#DC2626',
    marginTop: 2,
  },
  submitBtnTouch: {
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    minWidth: 140,
    elevation: 4,
  },
  submitBtnGradient: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
