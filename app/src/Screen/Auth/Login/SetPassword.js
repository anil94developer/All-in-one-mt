import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
  BackHandler,
  Animated,
  Keyboard,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Dialog } from '../../../context/DialogContext';
import { useLanguage } from '../../../context/LanguageContext';
import { base } from '../../../config/appConfig';
import { postDataJsonWithAuth } from '../../../services/Ops';
import {
  BackArrow,
  GoldLockIcon,
  AuthLockIcon,
  AuthEyeIcon,
  AuthEyeOffIcon,
  BlackShieldCheckIcon,
} from '../../../component/MatkaIcons';
import { screenWidth } from '../../../constants/Sizes.constant';

function SetPassword(props) {
  const insets = useSafeAreaInsets();
  const { strings } = useLanguage();
  const routeParams = props.route?.params || {};
  const isChangePassword = routeParams.screen === 'changepassword' || !routeParams.screen;

  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [focusedField, setFocusedField] = useState('');
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

  // Update password button continuous float & pulse animation
  const floatPwdAnim = useRef(new Animated.Value(0)).current;
  const scalePwdAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pwdLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(floatPwdAnim, {
            toValue: -8,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(scalePwdAnim, {
            toValue: 1.035,
            duration: 650,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(floatPwdAnim, {
            toValue: 0,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(scalePwdAnim, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    pwdLoop.start();
    return () => pwdLoop.stop();
  }, [floatPwdAnim, scalePwdAnim]);

  useEffect(() => {
    const backAction = () => {
      props.navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [props.navigation]);

  const handleUpdatePassword = async () => {
    Keyboard.dismiss();
    if (isChangePassword && !oldPassword.trim()) {
      Dialog.show({
        type: 'error',
        text1: strings.error || 'त्रुटि!',
        text2: strings.pwd_current_required || 'कृपया अपना वर्तमान पासवर्ड दर्ज करें।',
      });
      return;
    }
    if (!password.trim()) {
      Dialog.show({
        type: 'error',
        text1: strings.error || 'त्रुटि!',
        text2: strings.pwd_new_required || 'कृपया नया पासवर्ड दर्ज करें।',
      });
      return;
    }
    if (password.length < 6) {
      Dialog.show({
        type: 'error',
        text1: strings.error || 'त्रुटि!',
        text2: strings.pwd_min_chars || 'नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।',
      });
      return;
    }
    if (!confirmPassword.trim()) {
      Dialog.show({
        type: 'error',
        text1: strings.error || 'त्रुटि!',
        text2: strings.pwd_confirm_required || 'कृपया पासवर्ड की पुष्टि करें।',
      });
      return;
    }
    if (password !== confirmPassword) {
      Dialog.show({
        type: 'error',
        text1: strings.error || 'त्रुटि!',
        text2: strings.pwd_mismatch || 'दोनों पासवर्ड मेल नहीं खाते।',
      });
      return;
    }

    setLoading(true);
    try {
      const body = {
        current_password: oldPassword,
        new_password: password,
        new_password_confirmation: confirmPassword,
      };

      const result = await postDataJsonWithAuth(base.updatePassword, body);

      if (result?.status === true) {
        Dialog.show({
          type: 'success',
          text1: strings.success || 'सफल!',
          text2: result?.message || strings.pwd_updated_success || 'पासवर्ड सफलतापूर्वक बदल दिया गया है।',
        });
        setOldPassword('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          props.navigation.goBack();
        }, 1200);
      } else {
        Dialog.show({
          type: 'error',
          text1: strings.error || 'त्रुटि!',
          text2: result?.message || 'Failed to update password.',
        });
      }
    } catch (error) {
      console.log('Update password error', error);
      Dialog.show({
        type: 'error',
        text1: strings.error || 'त्रुटि!',
        text2: error?.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      {/* TOP HEADER */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => props.navigation.goBack()}
          style={styles.backCircleBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <BackArrow size={20} color="#E2B048" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {strings.pwd_change_title || 'पासवर्ड बदलें'}
        </Text>

        <View style={styles.headerRightBadge}>
          <GoldLockIcon size={18} color="#E2B048" />
        </View>
      </View>

      <View style={styles.bodyWrapper}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollContent}
            contentContainerStyle={[
              styles.scrollInner,
              { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 80 : 50 + insets.bottom },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
          {/* SECURITY HERO BANNER */}
          <LinearGradient
            colors={['#0E1E38', '#081528', '#040B16']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroIconCircle}>
              <GoldLockIcon size={26} color="#E2B048" />
            </View>
            <View style={styles.heroTextCol}>
              <Text style={styles.heroTitle}>
                {strings.account_security || 'खाता सुरक्षा'}
              </Text>
              <Text style={styles.heroSubtitle}>
                {strings.pwd_security_desc || 'नियमित रूप से पासवर्ड बदलकर अपने खाते को सुरक्षित रखें।'}
              </Text>
            </View>
          </LinearGradient>

          {/* MAIN FORM CARD */}
          <View style={styles.formCard}>
            {/* 1. CURRENT PASSWORD */}
            {isChangePassword && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {strings.pwd_current_label || 'वर्तमान पासवर्ड'}
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    focusedField === 'old' && styles.inputFocused,
                  ]}
                >
                  <View style={styles.inputLeftIcon}>
                    <AuthLockIcon size={18} color="#64748B" />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder={
                      strings.pwd_current_label || 'वर्तमान पासवर्ड दर्ज करें'
                    }
                    placeholderTextColor="#94A3B8"
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    secureTextEntry={!showOld}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setFocusedField('old')}
                    onBlur={() => setFocusedField('')}
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setShowOld(!showOld)}
                    style={styles.eyeBtn}
                  >
                    {showOld ? (
                      <AuthEyeIcon size={19} color="#64748B" />
                    ) : (
                      <AuthEyeOffIcon size={19} color="#94A3B8" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 2. NEW PASSWORD */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {strings.pwd_new_label || 'नया पासवर्ड'}
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedField === 'new' && styles.inputFocused,
                ]}
              >
                <View style={styles.inputLeftIcon}>
                  <AuthLockIcon size={18} color="#64748B" />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder={
                    strings.pwd_new_label || 'नया पासवर्ड दर्ज करें'
                  }
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showNew}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setFocusedField('new')}
                  onBlur={() => setFocusedField('')}
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowNew(!showNew)}
                  style={styles.eyeBtn}
                >
                  {showNew ? (
                    <AuthEyeIcon size={19} color="#64748B" />
                  ) : (
                    <AuthEyeOffIcon size={19} color="#94A3B8" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* 3. CONFIRM PASSWORD */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {strings.pwd_confirm_label || 'नया पासवर्ड कन्फर्म करें'}
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedField === 'confirm' && styles.inputFocused,
                ]}
              >
                <View style={styles.inputLeftIcon}>
                  <AuthLockIcon size={18} color="#64748B" />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder={
                    strings.pwd_confirm_label || 'नया पासवर्ड दोबारा दर्ज करें'
                  }
                  placeholderTextColor="#94A3B8"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setFocusedField('confirm')}
                  onBlur={() => setFocusedField('')}
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowConfirm(!showConfirm)}
                  style={styles.eyeBtn}
                >
                  {showConfirm ? (
                    <AuthEyeIcon size={19} color="#64748B" />
                  ) : (
                    <AuthEyeOffIcon size={19} color="#94A3B8" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* SECURITY GUIDANCE CARD */}
            <View style={styles.guidanceCard}>
              <View style={styles.guidanceRow}>
                <BlackShieldCheckIcon size={15} />
                <Text style={styles.guidanceText}>
                  {strings.pwd_min_chars || 'पासवर्ड न्यूनतम 6 अक्षरों का होना चाहिए।'}
                </Text>
              </View>
              <View style={[styles.guidanceRow, { marginTop: 6 }]}>
                <BlackShieldCheckIcon size={15} />
                <Text style={styles.guidanceText}>
                  {strings.pwd_security_desc || 'पासवर्ड किसी के साथ कभी भी साझा न करें।'}
                </Text>
              </View>
            </View>

            {/* SUBMIT BUTTON with Continuous Animation */}
            <Animated.View style={{ transform: [{ translateY: floatPwdAnim }, { scale: scalePwdAnim }] }}>
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={loading}
                onPress={handleUpdatePassword}
                style={styles.submitBtnTouch}
              >
                <LinearGradient
                  colors={['#C58B24', '#AD7517', '#8F5807']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitBtnGradient}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitBtnText}>
                      {strings.pwd_update_btn || 'पासवर्ड अपडेट करें'}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

export default SetPassword;

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
  headerRightBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(226, 176, 72, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(226, 176, 72, 0.25)',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  heroIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(226, 176, 72, 0.15)',
    borderWidth: 1.2,
    borderColor: '#E2B048',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  heroTextCol: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
    marginBottom: 3,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 17,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 7,
    marginLeft: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 50,
  },
  inputFocused: {
    borderColor: '#C58B24',
    backgroundColor: '#FFFFFF',
  },
  inputLeftIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14.5,
    color: '#0F172A',
    paddingVertical: 0,
    height: 50,
  },
  eyeBtn: {
    padding: 6,
    marginLeft: 4,
  },
  guidanceCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 12,
    marginTop: 4,
    marginBottom: 6,
  },
  guidanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guidanceText: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  submitBtnTouch: {
    marginTop: 18,
    borderRadius: 26,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#B87B14',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  submitBtnGradient: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1.2,
    borderTopColor: 'rgba(255, 255, 255, 0.45)',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
