/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';
import { screenWidth } from '../../constants/Sizes.constant';
import { base } from '../../config/appConfig';
import { getApiCall } from '../../services/AppSetting';
import { postDataJsonWithAuth } from '../../services/Ops';
import { get_profile } from '../../services/User';
import { Dialog } from '../../context/DialogContext';
import Loading from '../../component/loading';
import {
  BackArrow,
  WalletIcon,
  CloseIcon,
  BankBuildingPillIcon,
  PhonePeAppIcon,
  GooglePayAppIcon,
  PaytmAppIcon,
  EditPencilIcon,
  CheckCircleFillIcon,
} from '../../component/MatkaIcons';
import { useLanguage } from '../../context/LanguageContext';

// Helper SVG Icons
const EyeOpenIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
  </Svg>
);

const EyeClosedIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12A18.45 18.45 0 0 1 5.06 6.94M9.9 4.24A9.12 9.12 0 0 1 12 4C19 4 23 12 23 12A18.5 18.5 0 0 1 19.82 16.06"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line x1="1" y1="1" x2="23" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const TrashIcon = ({ size = 18, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6H5H21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6M8 6V4C8 2.9 8.9 2 10 2H14C15.1 2 16 2.9 16 4V6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line x1="10" y1="11" x2="10" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="14" y1="11" x2="14" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const ShieldSecurityIcon = ({ size = 20, color = '#E2B048' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22S4 18 4 12V5L12 2L20 5V12C20 18 12 22 12 22Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M9 12L11 14L15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function BankDetails(props) {
  const insets = useSafeAreaInsets();
  const { strings } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submittingBank, setSubmittingBank] = useState(false);
  const [submittingUpi, setSubmittingUpi] = useState(false);
  const [wallet, setWallet] = useState(0);

  // Bank states
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [branchName, setBranchName] = useState('');
  const [hasBank, setHasBank] = useState(false);
  const [showFullAccount, setShowFullAccount] = useState(false);

  // Form input states for modal
  const [inputBankName, setInputBankName] = useState('');
  const [inputAccountHolder, setInputAccountHolder] = useState('');
  const [inputAccountNumber, setInputAccountNumber] = useState('');
  const [inputConfirmAccount, setInputConfirmAccount] = useState('');
  const [inputIfsc, setInputIfsc] = useState('');
  const [inputBranch, setInputBranch] = useState('');

  // UPI states
  const [phonePeId, setPhonePeId] = useState('');
  const [gPayId, setGPayId] = useState('');
  const [paytmId, setPaytmId] = useState('');

  // Modals
  const [bankModalVisible, setBankModalVisible] = useState(false);
  const [upiModalVisible, setUpiModalVisible] = useState(false);
  const [activeUpiApp, setActiveUpiApp] = useState('PhonePe');
  const [tempUpiInput, setTempUpiInput] = useState('');
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

  const cleanString = (val) => (!val || val === 'undefined' || val === 'null' ? '' : String(val).trim());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userData, bankRes] = await Promise.all([
        get_profile(),
        getApiCall(base.getBank),
      ]);

      const wBalance = userData?.wallet ?? 0;
      setWallet(wBalance);

      const profileData = bankRes?.data || userData || {};
      const bankInfo = bankRes?.data?.bank || profileData;

      const fetchedBankName = cleanString(bankInfo.bank_name || profileData.bank_name);
      const fetchedAccount = cleanString(bankInfo.account_number || profileData.account_number);
      const fetchedHolder = cleanString(bankInfo.holder_name || bankInfo.account_holder_name || profileData.account_holder_name || profileData.name);
      const fetchedIfsc = cleanString(bankInfo.ifsc_code || profileData.ifsc_code);
      const fetchedBranch = cleanString(bankInfo.branch_name || profileData.branch_name);

      setBankName(fetchedBankName);
      setAccountNumber(fetchedAccount);
      setConfirmAccountNumber(fetchedAccount);
      setAccountHolder(fetchedHolder);
      setIfscCode(fetchedIfsc);
      setBranchName(fetchedBranch);
      setHasBank(Boolean(fetchedAccount && fetchedBankName));

      // UPI apps
      setPhonePeId(cleanString(profileData.phonepay || profileData.phonpe || userData?.phonepay));
      setGPayId(cleanString(profileData.googlepay || profileData.gpay || userData?.googlepay));
      setPaytmId(cleanString(profileData.paytm || userData?.paytm));
    } catch (e) {
      console.log('Error fetching bank/UPI data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  // Open Bank Modal
  const openBankModal = () => {
    setInputBankName(bankName);
    setInputAccountHolder(accountHolder);
    setInputAccountNumber(accountNumber);
    setInputConfirmAccount(accountNumber);
    setInputIfsc(ifscCode);
    setInputBranch(branchName);
    setBankModalVisible(true);
  };

  // Save Bank Details
  const saveBankDetails = async () => {
    Keyboard.dismiss();
    const trimmedBank = inputBankName.trim();
    const trimmedHolder = inputAccountHolder.trim();
    const trimmedAcc = inputAccountNumber.trim();
    const trimmedConfirm = inputConfirmAccount.trim();
    const trimmedIfsc = inputIfsc.trim().toUpperCase();
    const trimmedBranch = inputBranch.trim();

    if (!trimmedBank) {
      Dialog.show({ type: 'error', text1: 'Validation Error', text2: 'Please enter your Bank Name.' });
      return;
    }
    if (!trimmedHolder || trimmedHolder.length < 2) {
      Dialog.show({ type: 'error', text1: 'Validation Error', text2: 'Please enter a valid Account Holder Name.' });
      return;
    }
    if (!trimmedAcc || !/^\d{9,20}$/.test(trimmedAcc)) {
      Dialog.show({ type: 'error', text1: 'Validation Error', text2: 'Account number must be 9 to 20 digits.' });
      return;
    }
    if (trimmedAcc !== trimmedConfirm) {
      Dialog.show({ type: 'error', text1: 'Validation Error', text2: 'Account numbers do not match! Please verify.' });
      return;
    }
    if (!trimmedIfsc || trimmedIfsc.length !== 11) {
      Dialog.show({ type: 'error', text1: 'Validation Error', text2: 'Please enter a valid 11-character IFSC code (e.g. SBIN0001234).' });
      return;
    }

    setSubmittingBank(true);
    try {
      const body = {
        bank_name: trimmedBank,
        account_holder_name: trimmedHolder,
        account_holder: trimmedHolder,
        account_number: trimmedAcc,
        ifsc_code: trimmedIfsc,
        branch_name: trimmedBranch,
      };

      const result = await postDataJsonWithAuth(base.updateBank, body);

      if (result?.status === true || result?.success === '1' || result?.success === 1) {
        Dialog.show({
          type: 'success',
          text1: 'Bank Account Saved!',
          text2: result?.message || result?.msg || 'Bank details saved to database successfully.',
        });
        setBankModalVisible(false);
        fetchData();
      } else {
        Dialog.show({
          type: 'error',
          text1: 'Save Failed',
          text2: result?.message || result?.msg || 'Could not save bank details. Please try again.',
        });
      }
    } catch (error) {
      Dialog.show({ type: 'error', text1: 'Network Error', text2: 'Please check your connection and try again.' });
    } finally {
      setSubmittingBank(false);
    }
  };

  // Remove / Unlink Bank Account
  const handleUnlinkBank = () => {
    Alert.alert(
      'Unlink Bank Account?',
      'Are you sure you want to remove your linked bank account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const body = {
                bank_name: '',
                account_holder_name: '',
                account_holder: '',
                account_number: '',
                ifsc_code: '',
                branch_name: '',
              };
              const result = await postDataJsonWithAuth(base.updateBank, body);
              if (result?.status === true || result?.success === '1' || result?.success === 1) {
                Dialog.show({ type: 'success', text1: 'Unlinked', text2: 'Bank account removed successfully.' });
                setHasBank(false);
                setBankName('');
                setAccountNumber('');
                setAccountHolder('');
                setIfscCode('');
                setBranchName('');
                fetchData();
              } else {
                Dialog.show({ type: 'error', text1: 'Error', text2: 'Failed to unlink bank account.' });
              }
            } catch (err) {
              Dialog.show({ type: 'error', text1: 'Network Error', text2: 'Could not connect to server.' });
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Open UPI Modal
  const openUpiModal = (appName) => {
    setActiveUpiApp(appName);
    if (appName === 'PhonePe') setTempUpiInput(phonePeId);
    else if (appName === 'Google Pay') setTempUpiInput(gPayId);
    else if (appName === 'Paytm') setTempUpiInput(paytmId);
    setUpiModalVisible(true);
  };

  // Save UPI Details
  const saveUpiDetails = async () => {
    Keyboard.dismiss();
    const trimmedInput = tempUpiInput.trim();
    if (!trimmedInput) {
      Dialog.show({ type: 'error', text1: 'Required', text2: 'Please enter a UPI ID or mobile number.' });
      return;
    }

    setSubmittingUpi(true);
    try {
      const body = {};
      if (activeUpiApp === 'PhonePe') {
        body.phonepay = trimmedInput;
        body.phonpe = trimmedInput;
      } else if (activeUpiApp === 'Google Pay') {
        body.googlepay = trimmedInput;
        body.gpay = trimmedInput;
      } else if (activeUpiApp === 'Paytm') {
        body.paytm = trimmedInput;
      }

      const result = await postDataJsonWithAuth(base.updateUpi || base.editProfile, body);

      if (result?.status === true || result?.success === '1' || result?.success === 1) {
        Dialog.show({
          type: 'success',
          text1: `${activeUpiApp} Linked!`,
          text2: `${activeUpiApp} details saved to database successfully.`,
        });
        setUpiModalVisible(false);
        fetchData();
      } else {
        Dialog.show({
          type: 'error',
          text1: 'Save Failed',
          text2: result?.message || result?.msg || 'Failed to update UPI details.',
        });
      }
    } catch (err) {
      Dialog.show({ type: 'error', text1: 'Network Error', text2: 'Please check your connection.' });
    } finally {
      setSubmittingUpi(false);
    }
  };

  // Remove / Unlink UPI App
  const handleUnlinkUpi = async (appName) => {
    Alert.alert(
      `Unlink ${appName}?`,
      `Are you sure you want to remove your ${appName} details?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlink',
          style: 'destructive',
          onPress: async () => {
            setSubmittingUpi(true);
            try {
              const body = {};
              if (appName === 'PhonePe') {
                body.phonepay = '';
                body.phonpe = '';
              } else if (appName === 'Google Pay') {
                body.googlepay = '';
                body.gpay = '';
              } else if (appName === 'Paytm') {
                body.paytm = '';
              }

              const result = await postDataJsonWithAuth(base.updateUpi || base.editProfile, body);
              if (result?.status === true || result?.success === '1' || result?.success === 1) {
                Dialog.show({ type: 'success', text1: 'Unlinked', text2: `${appName} removed successfully.` });
                setUpiModalVisible(false);
                fetchData();
              } else {
                Dialog.show({ type: 'error', text1: 'Error', text2: `Failed to unlink ${appName}.` });
              }
            } catch (err) {
              Dialog.show({ type: 'error', text1: 'Network Error', text2: 'Could not connect to server.' });
            } finally {
              setSubmittingUpi(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const _goBack = () => props.navigation.goBack();

  const getMaskedAccount = (num) => {
    if (!num) return '';
    if (showFullAccount) return num;
    const cleanNum = String(num);
    if (cleanNum.length <= 4) return cleanNum;
    const lastFour = cleanNum.slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      {/* TOP HEADER */}
      <View style={styles.headerBar}>
        <TouchableOpacity activeOpacity={0.8} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} onPress={_goBack} style={styles.backCircleBtn}>
          <BackArrow size={20} color="#E2B048" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{strings.bank_manage_title || 'Bank & UPI Details'}</Text>

        <View style={styles.walletBadge}>
          <WalletIcon size={16} color="#E2B048" />
          <Text style={styles.walletText}> ₹{Number(wallet).toFixed(2)}</Text>
        </View>
      </View>

      {loading && <Loading />}

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#E2B048']} tintColor="#E2B048" />
        }
      >
        {/* SECTION 1: PRIMARY BANK ACCOUNT */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionAccentBar} />
          <Text style={styles.sectionTitle}>{strings.kyc_access || 'KYC & BANK ACCESS'}</Text>
        </View>

        {hasBank ? (
          /* ACTIVE LINKED BANK CARD */
          <View style={styles.activeBankCard}>
            {/* Top row: Bank icon + Title + Verified Badge */}
            <View style={styles.activeCardTop}>
              <View style={styles.activeCardTopLeft}>
                <View style={styles.bankIconCircle}>
                  <BankBuildingPillIcon size={40} />
                </View>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.activeCardBadgeText}>{strings.primary_bank || 'PRIMARY BANK ACCOUNT'}</Text>
                  <Text style={styles.activeBankName} numberOfLines={1}>
                    {bankName}
                  </Text>
                </View>
              </View>

              <View style={styles.verifiedPill}>
                <CheckCircleFillIcon size={13} color="#10B981" />
                <Text style={styles.verifiedPillText}>LINKED</Text>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.cardDivider} />

            {/* Account Details Box */}
            <View style={styles.bankDetailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>A/C HOLDER</Text>
                <Text style={styles.detailValue} numberOfLines={1}>{accountHolder || 'N/A'}</Text>
              </View>

              <View style={styles.detailItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={styles.detailLabel}>ACCOUNT NUMBER</Text>
                  <TouchableOpacity
                    onPress={() => setShowFullAccount(!showFullAccount)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    {showFullAccount ? <EyeClosedIcon size={16} /> : <EyeOpenIcon size={16} />}
                  </TouchableOpacity>
                </View>
                <Text style={[styles.detailValue, styles.accountNumText]} numberOfLines={1}>
                  {getMaskedAccount(accountNumber)}
                </Text>
              </View>

              <View style={[styles.detailItem, { width: '48%' }]}>
                <Text style={styles.detailLabel}>IFSC CODE</Text>
                <Text style={[styles.detailValue, styles.ifscText]} numberOfLines={1}>{ifscCode || 'N/A'}</Text>
              </View>

              <View style={[styles.detailItem, { width: '48%' }]}>
                <Text style={styles.detailLabel}>BRANCH</Text>
                <Text style={styles.detailValue} numberOfLines={1}>{branchName || 'Main'}</Text>
              </View>
            </View>

            {/* Action Buttons Row: Edit + Remove */}
            <View style={styles.bankActionsRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.editBankBtn}
                onPress={openBankModal}
              >
                <EditPencilIcon size={15} color="#061224" />
                <Text style={styles.editBankBtnText}>EDIT DETAILS</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.unlinkBankBtn}
                onPress={handleUnlinkBank}
              >
                <TrashIcon size={15} color="#EF4444" />
                <Text style={styles.unlinkBankBtnText}>UNLINK</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* EMPTY BANK CARD */
          <View style={styles.emptyBankCard}>
            <View style={styles.emptyBankLeft}>
              <View style={styles.emptyIconCircle}>
                <BankBuildingPillIcon size={42} />
              </View>
              <View style={styles.emptyBankInfo}>
                <Text style={styles.emptyBankTitle}>Add Bank Account</Text>
                <Text style={styles.emptyBankSub}>Link your bank for secure withdrawal transfers</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.addBtnWrapper}
              onPress={openBankModal}
            >
              <LinearGradient
                colors={['#E2B048', '#C99326', '#9E6208']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.addBtnGradient}
              >
                <Text style={styles.addBtnText}>+ ADD NOW</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* SECTION 2: DIRECT TRANSFER APPS (UPI) */}
        <View style={[styles.sectionHeader, { marginTop: 30 }]}>
          <View style={styles.sectionAccentBar} />
          <View>
            <Text style={styles.sectionTitle}>DIRECT TRANSFER APPS (UPI)</Text>
            <Text style={styles.sectionSubtitle}>Instant withdrawals directly to your verified UPI apps</Text>
          </View>
        </View>

        {/* UPI APP 1: PHONEPE */}
        <View style={styles.upiCard}>
          <View style={styles.upiCardLeft}>
            <View style={[styles.upiIconWrapper, { backgroundColor: 'rgba(103, 58, 183, 0.08)' }]}>
              <PhonePeAppIcon size={38} />
            </View>
            <View style={styles.upiInfoWrapper}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.upiAppName}>PhonePe</Text>
                {phonePeId ? (
                  <View style={styles.upiLinkedBadge}>
                    <Text style={styles.upiLinkedBadgeText}>✓ LINKED</Text>
                  </View>
                ) : (
                  <View style={styles.upiUnlinkedBadge}>
                    <Text style={styles.upiUnlinkedBadgeText}>NOT LINKED</Text>
                  </View>
                )}
              </View>
              <Text style={styles.upiAppId} numberOfLines={1}>
                {phonePeId ? phonePeId : 'Link PhonePe UPI or Mobile'}
              </Text>
            </View>
          </View>

          <View style={styles.upiActionsGroup}>
            {phonePeId ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.upiEditBtn}
                  onPress={() => openUpiModal('PhonePe')}
                >
                  <EditPencilIcon size={14} color="#673AB7" />
                  <Text style={[styles.upiEditBtnText, { color: '#673AB7' }]}>EDIT</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.upiDeleteBtn}
                  onPress={() => handleUnlinkUpi('PhonePe')}
                >
                  <TrashIcon size={14} color="#EF4444" />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.upiLinkNowBtn, { backgroundColor: '#673AB7' }]}
                onPress={() => openUpiModal('PhonePe')}
              >
                <Text style={styles.upiLinkNowText}>+ LINK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* UPI APP 2: GOOGLE PAY */}
        <View style={styles.upiCard}>
          <View style={styles.upiCardLeft}>
            <View style={[styles.upiIconWrapper, { backgroundColor: 'rgba(66, 133, 244, 0.08)' }]}>
              <GooglePayAppIcon size={36} />
            </View>
            <View style={styles.upiInfoWrapper}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.upiAppName}>Google Pay</Text>
                {gPayId ? (
                  <View style={styles.upiLinkedBadge}>
                    <Text style={styles.upiLinkedBadgeText}>✓ LINKED</Text>
                  </View>
                ) : (
                  <View style={styles.upiUnlinkedBadge}>
                    <Text style={styles.upiUnlinkedBadgeText}>NOT LINKED</Text>
                  </View>
                )}
              </View>
              <Text style={styles.upiAppId} numberOfLines={1}>
                {gPayId ? gPayId : 'Link Google Pay UPI or Mobile'}
              </Text>
            </View>
          </View>

          <View style={styles.upiActionsGroup}>
            {gPayId ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.upiEditBtn}
                  onPress={() => openUpiModal('Google Pay')}
                >
                  <EditPencilIcon size={14} color="#1A73E8" />
                  <Text style={[styles.upiEditBtnText, { color: '#1A73E8' }]}>EDIT</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.upiDeleteBtn}
                  onPress={() => handleUnlinkUpi('Google Pay')}
                >
                  <TrashIcon size={14} color="#EF4444" />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.upiLinkNowBtn, { backgroundColor: '#1A73E8' }]}
                onPress={() => openUpiModal('Google Pay')}
              >
                <Text style={styles.upiLinkNowText}>+ LINK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* UPI APP 3: PAYTM */}
        <View style={styles.upiCard}>
          <View style={styles.upiCardLeft}>
            <View style={[styles.upiIconWrapper, { backgroundColor: 'rgba(0, 185, 245, 0.08)' }]}>
              <PaytmAppIcon size={32} />
            </View>
            <View style={styles.upiInfoWrapper}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.upiAppName}>Paytm</Text>
                {paytmId ? (
                  <View style={styles.upiLinkedBadge}>
                    <Text style={styles.upiLinkedBadgeText}>✓ LINKED</Text>
                  </View>
                ) : (
                  <View style={styles.upiUnlinkedBadge}>
                    <Text style={styles.upiUnlinkedBadgeText}>NOT LINKED</Text>
                  </View>
                )}
              </View>
              <Text style={styles.upiAppId} numberOfLines={1}>
                {paytmId ? paytmId : 'Link Paytm UPI or Mobile'}
              </Text>
            </View>
          </View>

          <View style={styles.upiActionsGroup}>
            {paytmId ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.upiEditBtn}
                  onPress={() => openUpiModal('Paytm')}
                >
                  <EditPencilIcon size={14} color="#0080B0" />
                  <Text style={[styles.upiEditBtnText, { color: '#0080B0' }]}>EDIT</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.upiDeleteBtn}
                  onPress={() => handleUnlinkUpi('Paytm')}
                >
                  <TrashIcon size={14} color="#EF4444" />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.upiLinkNowBtn, { backgroundColor: '#002E6E' }]}
                onPress={() => openUpiModal('Paytm')}
              >
                <Text style={styles.upiLinkNowText}>+ LINK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* SECURITY & COMPLIANCE BADGE */}
        <View style={styles.securityCard}>
          <ShieldSecurityIcon size={24} color="#E2B048" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.securityTitle}>100% Safe & Bank Verified</Text>
            <Text style={styles.securityDesc}>
              Your bank & UPI credentials are safe and encrypted. Payouts are directly transferred to accounts registered in your name.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* MODAL: ADD / EDIT BANK ACCOUNT */}
      <Modal
        visible={bankModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setBankModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <BankBuildingPillIcon size={32} />
                <Text style={styles.modalSheetTitle}>
                  {hasBank ? 'Edit Bank Account' : 'Add Bank Account'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setBankModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <CloseIcon size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: keyboardHeight > 0 ? keyboardHeight + 50 : 20 }}
            >
              <Text style={styles.inputFieldLabel}>Bank Name *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. State Bank of India, HDFC, ICICI"
                placeholderTextColor="#94A3B8"
                value={inputBankName}
                onChangeText={setInputBankName}
              />

              <Text style={styles.inputFieldLabel}>Account Holder Name *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Name as per bank passbook"
                placeholderTextColor="#94A3B8"
                value={inputAccountHolder}
                onChangeText={setInputAccountHolder}
              />

              <Text style={styles.inputFieldLabel}>Account Number *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter Account Number (9-20 digits)"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                value={inputAccountNumber}
                onChangeText={setInputAccountNumber}
              />

              <Text style={styles.inputFieldLabel}>Confirm Account Number *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Re-enter Account Number"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                value={inputConfirmAccount}
                onChangeText={setInputConfirmAccount}
              />

              <Text style={styles.inputFieldLabel}>IFSC Code *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="11-digit IFSC (e.g. SBIN0001234)"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                maxLength={11}
                value={inputIfsc}
                onChangeText={setInputIfsc}
              />

              <Text style={styles.inputFieldLabel}>Branch Name (Optional)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Mumbai Main Branch"
                placeholderTextColor="#94A3B8"
                value={inputBranch}
                onChangeText={setInputBranch}
              />

              <TouchableOpacity
                activeOpacity={0.85}
                disabled={submittingBank}
                style={styles.modalSaveBtn}
                onPress={saveBankDetails}
              >
                {submittingBank ? (
                  <ActivityIndicator size="small" color="#061224" />
                ) : (
                  <Text style={styles.modalSaveBtnText}>SAVE BANK DETAILS</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL: ADD / EDIT UPI APP */}
      <Modal
        visible={upiModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setUpiModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <View style={[styles.modalSheet, { maxHeight: 420 }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {activeUpiApp === 'PhonePe' && <PhonePeAppIcon size={30} />}
                {activeUpiApp === 'Google Pay' && <GooglePayAppIcon size={30} />}
                {activeUpiApp === 'Paytm' && <PaytmAppIcon size={26} />}
                <Text style={styles.modalSheetTitle}> Link {activeUpiApp}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setUpiModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <CloseIcon size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputFieldLabel}>
              Enter {activeUpiApp} UPI ID or Registered Number
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder={
                activeUpiApp === 'PhonePe'
                  ? 'e.g. 9876543210@ybl or mobile number'
                  : activeUpiApp === 'Google Pay'
                  ? 'e.g. name@okaxis or mobile number'
                  : 'e.g. 9876543210@paytm or mobile number'
              }
              placeholderTextColor="#94A3B8"
              value={tempUpiInput}
              onChangeText={setTempUpiInput}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={submittingUpi}
              style={styles.modalSaveBtn}
              onPress={saveUpiDetails}
            >
              {submittingUpi ? (
                <ActivityIndicator size="small" color="#061224" />
              ) : (
                <Text style={styles.modalSaveBtnText}>SAVE {activeUpiApp.toUpperCase()}</Text>
              )}
            </TouchableOpacity>

            {/* If currently linked, offer Unlink option */}
            {((activeUpiApp === 'PhonePe' && phonePeId) ||
              (activeUpiApp === 'Google Pay' && gPayId) ||
              (activeUpiApp === 'Paytm' && paytmId)) ? (
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={submittingUpi}
                style={styles.modalUnlinkBtn}
                onPress={() => handleUnlinkUpi(activeUpiApp)}
              >
                <TrashIcon size={16} color="#EF4444" />
                <Text style={styles.modalUnlinkBtnText}>UNLINK {activeUpiApp.toUpperCase()}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  headerTitle: {
    fontSize: 19,
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
    paddingVertical: 6,
    backgroundColor: 'rgba(226, 176, 72, 0.12)',
  },
  walletText: {
    color: '#E2B048',
    fontSize: 14.5,
    fontWeight: '800',
    marginLeft: 3,
  },
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionAccentBar: {
    width: 4,
    height: 22,
    backgroundColor: '#E2B048',
    borderRadius: 2,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  /* ACTIVE BANK CARD */
  activeBankCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  activeCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeCardTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bankIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCardBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#B45309',
    letterSpacing: 0.4,
  },
  activeBankName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedPillText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  bankDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '100%',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.4,
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  accountNumText: {
    fontFamily: 'monospace',
    fontSize: 15,
    color: '#0369A1',
    letterSpacing: 1,
  },
  ifscText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#475569',
    letterSpacing: 0.5,
  },
  bankActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  editBankBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDE68A',
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
  },
  editBankBtnText: {
    color: '#061224',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 6,
    letterSpacing: 0.3,
  },
  unlinkBankBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  unlinkBankBtnText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.3,
  },

  /* EMPTY BANK CARD */
  emptyBankCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  emptyBankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBankInfo: {
    marginLeft: 12,
    flex: 1,
  },
  emptyBankTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptyBankSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  addBtnWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addBtnGradient: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#061224',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.3,
  },

  /* UPI CARDS */
  upiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    elevation: 1,
  },
  upiCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  upiIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upiInfoWrapper: {
    marginLeft: 12,
    flex: 1,
  },
  upiAppName: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  upiLinkedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  upiLinkedBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#059669',
  },
  upiUnlinkedBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  upiUnlinkedBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
  },
  upiAppId: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
    marginTop: 3,
  },
  upiActionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upiEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    marginRight: 6,
  },
  upiEditBtnText: {
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 4,
  },
  upiDeleteBtn: {
    backgroundColor: '#FEE2E2',
    padding: 8,
    borderRadius: 10,
  },
  upiLinkNowBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  upiLinkNowText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  /* SECURITY CARD */
  securityCard: {
    backgroundColor: '#061224',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    borderWidth: 1,
    borderColor: 'rgba(226, 176, 72, 0.3)',
  },
  securityTitle: {
    color: '#E2B048',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  securityDesc: {
    color: '#94A3B8',
    fontSize: 11.5,
    lineHeight: 16,
    marginTop: 3,
  },

  /* MODALS */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(6, 18, 36, 0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalSheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginLeft: 8,
  },
  modalCloseBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
  },
  inputFieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 12,
  },
  modalInput: {
    height: 48,
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14.5,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  modalSaveBtn: {
    backgroundColor: '#E2B048',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 6,
    elevation: 2,
  },
  modalSaveBtnText: {
    color: '#061224',
    fontSize: 14.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  modalUnlinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    height: 44,
    marginTop: 10,
  },
  modalUnlinkBtnText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 6,
    letterSpacing: 0.3,
  },
});