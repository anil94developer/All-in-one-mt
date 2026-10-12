import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  Animated,
  Linking,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { screenWidth } from '../../constants/Sizes.constant';
import { get_profile, get_amount_setting } from '../../services/User';
import Loading from '../../component/loading';
import { postDataJsonWithAuth } from '../../services/Ops';
import { getApiCall } from '../../services/AppSetting';
import { base as appBase } from '../../config/appConfig';
import { Dialog } from '../../context/DialogContext';
import {
  BackArrow,
  WalletIcon,
  DrawerWalletIcon,
  NaviIcon,
  PhonePeIcon,
  PaytmIcon,
  GPayIcon,
  WalletCashIllustration,
  CloseIcon,
  WarningAlertIcon,
  ClockIcon,
} from '../../component/MatkaIcons';
import { useLanguage } from '../../context/LanguageContext';

export default function AddFund(props) {
  const insets = useSafeAreaInsets();
  const { strings } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [wallet, setWallet] = useState(0);
  const [disableBtn, setDisableBtn] = useState(false);
  const [amountSetting, setAmountSetting] = useState({});
  const [selectedUpiApp, setSelectedUpiApp] = useState('phonepe');
  const [upi, setUpi] = useState('');
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [amountModalMsg, setAmountModalMsg] = useState('Please enter amount');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef(null);

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

  // Live Deposit History state
  const [historyList, setHistoryList] = useState([]);
  const [recentLiveFeed, setRecentLiveFeed] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyTab, setHistoryTab] = useState('my'); // 'my' | 'live'

  // Pay Now continuous floating/bobbing animation (Screenshot 3 - pay now vala diba hilta rehna chahiye)
  const floatPayAnim = React.useRef(new Animated.Value(0)).current;
  const scalePayAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const payLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(floatPayAnim, {
            toValue: -7,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(scalePayAnim, {
            toValue: 1.025,
            duration: 650,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(floatPayAnim, {
            toValue: 0,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(scalePayAnim, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    payLoop.start();
    return () => payLoop.stop();
  }, [floatPayAnim, scalePayAnim]);

  const _goBack = () => {
    props.navigation.goBack();
  };

  useEffect(() => {
    get_data();

    const unsubscribe = props.navigation?.addListener?.('focus', () => {
      get_data();
    });
    return unsubscribe;
  }, [props.navigation]);

  const fetch_history = async () => {
    setHistoryLoading(true);
    try {
      // 1. Fetch user personal deposit requests
      const depRes = await getApiCall(appBase.getDepositRequests);
      let myDeposits = [];
      if (Array.isArray(depRes?.data)) {
        myDeposits = depRes.data;
      } else if (Array.isArray(depRes?.result)) {
        myDeposits = depRes.result;
      } else if (Array.isArray(depRes?.data?.result)) {
        myDeposits = depRes.data.result;
      }
      setHistoryList(myDeposits);

      if (myDeposits.length > 0) {
        setHistoryTab('my');
      }

      // 2. Fetch live community deposits feed
      const feedRes = await getApiCall(appBase.recentDeposits);
      let liveFeed = [];
      if (Array.isArray(feedRes?.data)) {
        liveFeed = feedRes.data;
      } else if (Array.isArray(feedRes?.result)) {
        liveFeed = feedRes.result;
      }
      if (liveFeed.length > 0) {
        setRecentLiveFeed(liveFeed);
      }
    } catch (e) {
      console.log('Error fetching history:', e);
    } finally {
      setHistoryLoading(false);
    }
  };

  const get_data = async () => {
    try {
      const userData = await get_profile();
      setWallet(userData?.wallet ?? 0);
      const setting = await get_amount_setting();
      setAmountSetting(setting || {});
      const activeUpi =
        setting?.payment_upi_id ||
        setting?.upi_payment_id ||
        setting?.upi_payment ||
        '';
      if (activeUpi) {
        setUpi(activeUpi);
      }
      fetch_history();
    } catch (e) {
      console.log('Error get_data:', e);
    } finally {
      setLoading(false);
    }
  };

  const payNow = async () => {
    Keyboard.dismiss();
    const minD = Number(amountSetting?.min_deposite || 100);
    const maxD = Number(amountSetting?.max_deposite || 50000);
    const val = Number(amount);

    if (!amount || amount.trim() === '' || isNaN(val) || val <= 0) {
      setAmountModalMsg(strings.enter_amount || 'Please enter amount');
      setShowAmountModal(true);
      return;
    }
    if (val < minD) {
      setAmountModalMsg(`Please enter minimum ₹${minD}`);
      setShowAmountModal(true);
      return;
    }
    if (maxD > 0 && val > maxD) {
      setAmountModalMsg(`Maximum deposit is ₹${maxD}`);
      setShowAmountModal(true);
      return;
    }

    const targetUpi =
      upi?.trim() ||
      amountSetting?.payment_upi_id ||
      amountSetting?.upi_payment_id ||
      amountSetting?.upi_payment ||
      '9982778833@paytm';

    if (!targetUpi) {
      Dialog.show({
        type: 'error',
        text1: 'UPI Error',
        text2: 'UPI ID उपलब्ध नहीं है। कृपया व्यवस्थापक से संपर्क करें।',
      });
      return;
    }

    const payeeName = amountSetting?.upi_name || amountSetting?.app_name || 'Tara Baba';
    const txnRef = `TXN${Date.now()}`;
    const txnNote = `Add Fund ${val}`;

    const upiQuery = [
      `pa=${encodeURIComponent(targetUpi)}`,
      `pn=${encodeURIComponent(payeeName)}`,
      `am=${encodeURIComponent(val.toFixed(2))}`,
      `cu=INR`,
      `tn=${encodeURIComponent(txnNote)}`,
      `tr=${encodeURIComponent(txnRef)}`,
    ].join('&');

    const genericUpiUrl = `upi://pay?${upiQuery}`;

    let primaryAppUrl = '';
    if (selectedUpiApp === 'phonepe') {
      primaryAppUrl = `phonepe://pay?${upiQuery}`;
    } else if (selectedUpiApp === 'paytm') {
      primaryAppUrl = `paytmmp://pay?${upiQuery}`;
    } else if (selectedUpiApp === 'gpay') {
      primaryAppUrl = `tez://upi/pay?${upiQuery}`;
    } else if (selectedUpiApp === 'navi') {
      primaryAppUrl = `navi://pay?${upiQuery}`;
    }

    setDisableBtn(true);

    // Record request in backend
    try {
      postDataJsonWithAuth(appBase.walletAddAmount, {
        amount: val,
        utr_no: txnRef,
        payment_method: 'upi',
        upi_app: selectedUpiApp,
        upi: targetUpi,
      })
        .then((result) => {
          if (result?.status === true || result?.success === '1' || result?.success === 1) {
            get_data();
          }
        })
        .catch(() => { });
    } catch (e) { }

    let launched = false;

    // 1. Try launching selected UPI app
    if (primaryAppUrl) {
      try {
        const canOpen = await Linking.canOpenURL(primaryAppUrl);
        if (canOpen) {
          await Linking.openURL(primaryAppUrl);
          launched = true;
        }
      } catch (err) {
        console.log('Error opening primary UPI app:', err);
      }
    }

    // 2. Secondary check for Paytm (paytm://pay?)
    if (!launched && selectedUpiApp === 'paytm') {
      try {
        const altPaytm = `paytm://pay?${upiQuery}`;
        const canOpenAlt = await Linking.canOpenURL(altPaytm);
        if (canOpenAlt) {
          await Linking.openURL(altPaytm);
          launched = true;
        }
      } catch (err) { }
    }

    // 3. Fallback to generic UPI chooser (upi://pay?)
    if (!launched) {
      try {
        const canOpenGeneric = await Linking.canOpenURL(genericUpiUrl);
        if (canOpenGeneric) {
          await Linking.openURL(genericUpiUrl);
          launched = true;
        } else {
          await Linking.openURL(genericUpiUrl);
          launched = true;
        }
      } catch (err) {
        console.log('Error opening generic UPI:', err);
      }
    }

    setDisableBtn(false);

    if (!launched) {
      Dialog.show({
        type: 'error',
        text1: 'UPI App',
        text2: 'डिवाइस पर कोई UPI ऐप नहीं मिला। कृपया PhonePe, Paytm या GPay इंस्टॉल करें।',
      });
    }
  };

  const quickAmounts = [
    ['300', '500'],
    ['1000', '5000'],
  ];

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      {/* TOP HEADER */}
      <View style={styles.headerBar}>
        <TouchableOpacity activeOpacity={0.8} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} onPress={_goBack} style={styles.backBtn}>
          <BackArrow size={20} color="#E2B048" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{strings.add_fund_header || 'फंड जोड़ें'}</Text>

        <View style={styles.walletPill}>
          <WalletIcon size={16} color="#E2B048" />
          <Text style={styles.walletPillText}> ₹{wallet}</Text>
        </View>
      </View>

      {loading && <Loading />}

      {/* BODY WRAPPER */}
      <View style={styles.bodyWrapper}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollArea}
          contentContainerStyle={{
            paddingBottom: keyboardHeight > 0 ? keyboardHeight + 80 : 50 + insets.bottom,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* GOLD CURRENT BALANCE BANNER */}
          <LinearGradient
            colors={['#8C550E', '#B3751B', '#D8992D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.goldBannerCard}
          >
            <WalletCashIllustration size={56} />
            <View style={styles.goldBannerRight}>
              <Text style={styles.goldBannerValue}>₹{wallet}</Text>
              <Text style={styles.goldBannerLabel}>{strings.current_balance || 'वर्तमान शेष'}</Text>
            </View>
          </LinearGradient>

          {/* ENTER AMOUNT SECTION */}
          <Text style={styles.sectionHeading}>{strings.enter_amount || 'राशि दर्ज करें'}</Text>
          <View style={styles.amountInputWrap}>
            <DrawerWalletIcon size={24} color="#64748B" />
            <TextInput
              style={styles.amountInput}
              placeholder={strings.enter_amount || 'राशि दर्ज करें'}
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              value={amount}
              onChangeText={(t) => setAmount(t)}
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollTo({ y: 120, animated: true });
                }, 150);
              }}
            />
          </View>

        {/* 2X2 QUICK AMOUNT BLUE BUTTONS */}
        <View style={styles.quickGrid}>
          {quickAmounts.map((row, rIdx) => (
            <View key={rIdx} style={styles.quickRow}>
              {row.map((val) => (
                <TouchableOpacity
                  key={val}
                  activeOpacity={0.85}
                  style={styles.quickBtnTouch}
                  onPress={() => setAmount(val)}
                >
                  <LinearGradient
                    colors={['#1E40AF', '#2563EB', '#3B82F6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.quickBtnGradient}
                  >
                    <Text style={styles.quickBtnText}>{val}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* UPI APP SELECTION */}
        <Text style={styles.sectionHeading}>{strings.select_upi_app || 'UPI ऐप चुनें'}</Text>
        <View style={styles.upiRow}>
          {/* 1. Navi */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.upiCard, selectedUpiApp === 'navi' && styles.upiCardActive]}
            onPress={() => setSelectedUpiApp('navi')}
          >
            <NaviIcon size={28} />
            <Text style={styles.upiCardText}>navi</Text>
          </TouchableOpacity>

          {/* 2. PhonePe */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.upiCard, selectedUpiApp === 'phonepe' && styles.upiCardActive]}
            onPress={() => setSelectedUpiApp('phonepe')}
          >
            <PhonePeIcon size={28} />
            <Text style={styles.upiCardText}>PhonePe</Text>
          </TouchableOpacity>

          {/* 3. Paytm */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.upiCard, selectedUpiApp === 'paytm' && styles.upiCardActive]}
            onPress={() => setSelectedUpiApp('paytm')}
          >
            <PaytmIcon size={28} />
          </TouchableOpacity>

          {/* 4. GPay */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.upiCard, selectedUpiApp === 'gpay' && styles.upiCardActive]}
            onPress={() => setSelectedUpiApp('gpay')}
          >
            <GPayIcon size={28} />
          </TouchableOpacity>
        </View>

        {upi ? (
          <View style={styles.upiIdBadge}>
            <Text style={styles.upiIdLabel}>UPI ID: </Text>
            <Text style={styles.upiIdValue}>{upi}</Text>
          </View>
        ) : null}

        {/* PAY NOW LARGE BUTTON - FLOATING / BOBBING */}
        <Animated.View style={{ transform: [{ translateY: floatPayAnim }, { scale: scalePayAnim }] }}>
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={disableBtn}
            style={styles.payNowTouch}
            onPress={payNow}
          >
            <LinearGradient
              colors={['#112340', '#08172E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.payNowGradient}
            >
              <Text style={styles.payNowText}>{strings.pay_now || 'अभी भुगतान करें'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* ADD FUND LIVE HISTORY SECTION */}
        <View style={styles.historySectionHeader}>
          <View style={styles.historyTitleRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ClockIcon size={18} color="#1E293B" />
              <Text style={styles.historySectionTitle}>
                {' '}{strings.deposit_history || 'जमा इतिहास'}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={fetch_history}
              style={styles.historyRefreshTouch}
            >
              {historyLoading ? (
                <ActivityIndicator size="small" color="#2563EB" />
              ) : (
                <Text style={styles.historyRefreshText}>🔄 {strings.refresh || 'रिफ्रेश'}</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* TAB SWITCHER: My Deposits vs Live Feed */}
          <View style={styles.historyTabWrap}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.historyTabBtn, historyTab === 'my' && styles.historyTabBtnActive]}
              onPress={() => setHistoryTab('my')}
            >
              <Text style={[styles.historyTabText, historyTab === 'my' && styles.historyTabTextActive]}>
                {strings.my_deposits || 'मेरी हिस्ट्री'} ({historyList.length})
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.historyTabBtn, historyTab === 'live' && styles.historyTabBtnActive]}
              onPress={() => setHistoryTab('live')}
            >
              <View style={styles.liveDotWrap}>
                <Text style={styles.liveDot}>• </Text>
                <Text style={[styles.historyTabText, historyTab === 'live' && styles.historyTabTextActive]}>
                  {strings.recent_add_money || 'लाइव फ़ीड'}
                </Text>
              </View>
            </TouchableOpacity> */}
          </View>
        </View>

        {/* LIST CONTAINER */}
        <View style={styles.feedCard}>
          {historyLoading && historyList.length === 0 && recentLiveFeed.length === 0 ? (
            <View style={{ paddingVertical: 24, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={{ marginTop: 8, fontSize: 13, color: '#64748B' }}>
                डेटा लोड हो रहा है...
              </Text>
            </View>
          ) : historyTab === 'my' ? (
            historyList.length > 0 ? (
              historyList.map((item, index) => {
                const isPending = item.status === '0' || item.status === 0;
                const isApproved = item.status === '1' || item.status === 1;

                const statusBg = isApproved ? '#DCFCE7' : isPending ? '#FEF3C7' : '#FEE2E2';
                const statusTextColor = isApproved ? '#15803D' : isPending ? '#B45309' : '#B91C1C';
                const statusLabel = isApproved ? 'स्वीकृत' : isPending ? 'प्रक्रियाधीन' : 'अस्वीकृत';

                return (
                  <React.Fragment key={item.id || index}>
                    {index > 0 && <View style={styles.feedDivider} />}
                    <View style={styles.feedRow}>
                      <View style={[styles.feedAvatar, { backgroundColor: statusBg }]}>
                        <WalletIcon size={18} color={statusTextColor} />
                      </View>
                      <View style={styles.feedInfo}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={styles.feedUser}>{item.amount}</Text>
                          <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                            <Text style={[styles.statusBadgeText, { color: statusTextColor }]}>
                              {statusLabel}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.feedTime}>
                          {item.date ? String(item.date).slice(0, 16) : 'हाल ही में'}
                        </Text>
                        {item.utr ? (
                          <Text style={styles.utrText} numberOfLines={1}>
                            Ref: {item.utr}
                          </Text>
                        ) : null}
                      </View>
                      <Text style={[styles.feedAmount, { color: statusTextColor }]}>
                        ₹{item.amount}
                      </Text>
                    </View>
                  </React.Fragment>
                );
              })
            ) : (
              <View style={styles.emptyHistoryWrap}>
                <DrawerWalletIcon size={32} color="#94A3B8" />
                <Text style={styles.emptyHistoryTitle}>कोई जमा हिस्ट्री नहीं है</Text>
                <Text style={styles.emptyHistorySub}>
                  अपनी पहली राशि जोड़ने के लिए ऊपर 'अभी भुगतान करें' दबाएं।
                </Text>
              </View>
            )
          ) : (
            (recentLiveFeed.length > 0
              ? recentLiveFeed
              : [
                { user: 'Naveen 82****15', amount: '1000', date: 'Amount added' },
                { user: 'Sayan 78****73', amount: '15000', date: 'Amount added 8 hour ago' },
              ]
            ).map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <View style={styles.feedDivider} />}
                <View style={styles.feedRow}>
                  <View style={styles.feedAvatar}>
                    <WalletIcon size={18} color="#16A34A" />
                  </View>
                  <View style={styles.feedInfo}>
                    <Text style={styles.feedUser}>{item.user || item.phone || 'User'}</Text>
                    <Text style={styles.feedTime}>
                      {item.date ? String(item.date).slice(0, 16) : strings.amount_added || 'Amount added'}
                    </Text>
                  </View>
                  <Text style={styles.feedAmount}>₹{item.amount}</Text>
                </View>
              </React.Fragment>
            ))
          )}
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
      </View>
      {/* PLEASE ENTER AMOUNT MODAL (Screenshot 2) */}
      <Modal
        visible={showAmountModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAmountModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.alertCard}>
            {/* Top Right Close Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.alertCloseBtn}
              onPress={() => setShowAmountModal(false)}
            >
              <CloseIcon size={20} color="#64748B" />
            </TouchableOpacity>

            {/* Red Warning Triangle in Light Red Circle */}
            <View style={styles.warningCircle}>
              <WarningAlertIcon size={32} color="#EF4444" />
            </View>

            {/* Title */}
            <Text style={styles.alertTitle}>{amountModalMsg}</Text>

            {/* Red OK, got it Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.alertOkBtn}
              onPress={() => setShowAmountModal(false)}
            >
              <LinearGradient
                colors={['#FF4D4D', '#EF4444']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.alertOkGradient}
              >
                <Text style={styles.alertOkText}>OK, got it</Text>
              </LinearGradient>
            </TouchableOpacity>
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  alertCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 22,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    position: 'relative',
  },
  alertCloseBtn: {
    position: 'absolute',
    top: 14,
    right: 16,
    padding: 6,
    zIndex: 5,
  },
  warningCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 14,
  },
  alertTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 22,
    letterSpacing: 0.2,
  },
  alertOkBtn: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#EF4444',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  alertOkGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  alertOkText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '800',
    letterSpacing: 0.4,
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
  backBtn: {
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
  walletPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2B048',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: 'rgba(226, 176, 72, 0.08)',
  },
  walletPillText: {
    color: '#E2B048',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 2,
  },
  scrollArea: {
    flex: 1,
  },
  goldBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: '#B3751B',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  goldBannerRight: {
    marginLeft: 20,
  },
  goldBannerValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  goldBannerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF7ED',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  amountInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    height: 54,
  },
  amountInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  quickGrid: {
    marginHorizontal: 16,
    marginTop: 14,
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  quickBtnTouch: {
    width: (screenWidth - 44) / 2,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#1D4ED8',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  quickBtnGradient: {
    height: 46,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickBtnText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  upiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 4,
  },
  upiCard: {
    width: (screenWidth - 56) / 4,
    height: 62,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  upiCardActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
  },
  upiCardText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 3,
  },
  upiIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  upiIdLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E40AF',
  },
  upiIdValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.3,
  },
  payNowTouch: {
    marginHorizontal: 16,
    marginTop: 22,
    borderRadius: 26,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  payNowGradient: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payNowText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  socialProofHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 22,
    marginBottom: 10,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  activeDot: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '900',
  },
  activeLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#1E293B',
  },
  activeCount: {
    color: '#1D4ED8',
    fontWeight: '800',
  },
  recentPill: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  recentLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#C2410C',
  },
  historySectionHeader: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 10,
  },
  historyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  historySectionTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.2,
  },
  historyRefreshTouch: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  historyRefreshText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  historyTabWrap: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 3,
  },
  historyTabBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  historyTabBtnActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  historyTabText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  historyTabTextActive: {
    color: '#1D4ED8',
    fontWeight: '800',
  },
  liveDotWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    marginLeft: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  utrText: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  emptyHistoryWrap: {
    alignItems: 'center',
    paddingVertical: 26,
    paddingHorizontal: 16,
  },
  emptyHistoryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#334155',
    marginTop: 8,
  },
  emptyHistorySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  feedCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  feedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  feedAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  feedInfo: {
    flex: 1,
  },
  feedUser: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  feedTime: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  feedAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#16A34A',
  },
  feedDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
});