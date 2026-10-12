/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
  Switch,
  Linking,
  ActivityIndicator,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get_profile, app_setting } from '../../services/User';
import { base } from '../../config/appConfig';
import { postDataJsonWithAuth } from '../../services/Ops';
import { Dialog } from '../../context/DialogContext';
import Loading from '../../component/loading';
import { images } from '../../assets/images';
import {
  BackArrow,
  UserIcon,
  AuthLockIcon,
  NavSupportIcon,
  BellIcon,
  GlobeIcon,
  TranslateIcon,
  PowerIcon,
  EditPencilIcon,
  ChevronRight,
} from '../../component/MatkaIcons';
import { useLanguage } from '../../context/LanguageContext';

export default function ProfileScreen(props) {
  const insets = useSafeAreaInsets();
  const { strings, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userProfileData, setUserProfileData] = useState(null);
  const [settings, setSettings] = useState({});
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
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

  // Update button continuous float & pulse animation
  const floatBtnAnim = useRef(new Animated.Value(0)).current;
  const scaleBtnAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(floatBtnAnim, {
            toValue: -8,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(scaleBtnAnim, {
            toValue: 1.035,
            duration: 650,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(floatBtnAnim, {
            toValue: 0,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(scaleBtnAnim, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [floatBtnAnim, scaleBtnAnim]);

  useEffect(() => {
    fetchProfile();
    const unsubscribe = props.navigation?.addListener?.('focus', fetchProfile);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [props.navigation]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const [profile, appSet] = await Promise.all([
        get_profile(),
        app_setting(),
      ]);
      setUserProfileData(profile || {});
      setSettings(appSet || {});
      setName(profile?.name || '');
      setEmail(profile?.email || '');
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    Keyboard.dismiss();
    if (!name.trim()) {
      Dialog.show({ type: 'error', text1: strings.error || 'Error', text2: strings.name_required || 'Name cannot be empty' });
      return;
    }
    setSubmitting(true);
    try {
      const phone = (await AsyncStorage.getItem('phone')) || userProfileData?.phone_number || userProfileData?.phone || '';
      const payload = {
        phone: phone,
        name: name.trim(),
        email: email.trim(),
      };

      const result = await postDataJsonWithAuth(base.editProfile, payload);
      if (result?.success == 1 || result?.success === '1' || result?.status === true) {
        Dialog.show({
          type: 'success',
          text1: strings.success || 'Success',
          text2: result?.msg || result?.message || strings.profile_updated_success || 'Profile updated successfully',
        });
        setIsEditing(false);

        // Update local caches so drawer and other screens immediately reflect updated name & email
        try {
          await AsyncStorage.setItem('name', name.trim());
          if (email.trim()) await AsyncStorage.setItem('email', email.trim());
          const curUserData = JSON.parse((await AsyncStorage.getItem('userData')) || '{}');
          await AsyncStorage.setItem('userData', JSON.stringify({
            ...curUserData,
            name: name.trim(),
            email: email.trim(),
            phone: phone,
            phone_number: phone,
          }));
        } catch (_) { }

        fetchProfile();
      } else {
        Dialog.show({
          type: 'error',
          text1: strings.error || 'Error',
          text2: result?.msg || result?.message || strings.profile_update_failed || 'Failed to update profile',
        });
      }
    } catch (e) {
      console.log('Update profile error:', e);
      Dialog.show({
        type: 'error',
        text1: strings.error || 'Error',
        text2: e?.message || 'Failed to update profile. Please check connection.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const logoutHandler = () => {
    Dialog.confirm({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      onConfirm: async () => {
        await AsyncStorage.removeItem('phone');
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userData');
        await AsyncStorage.removeItem('accountStatus');
        global.accountStatus = '0';
        props.navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      },
    });
  };

  const contactSupport = () => {
    props.navigation.navigate('ContactUsScreen');
  };

  const _goBack = () => props.navigation.goBack();

  const phone = userProfileData?.phone_number || userProfileData?.mobile || '9966322889';

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

        <Text style={styles.headerTitle}>{strings.profile_settings || strings.drawer_profile || 'Profile Settings'}</Text>

        <View style={{ width: 40 }} />
      </View>

      {loading && <Loading />}

      {/* BODY CONTENT WRAPPER */}
      <View style={styles.bodyWrapper}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          contentContainerStyle={[
            styles.scrollInner,
            { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 80 : 50 + insets.bottom },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* TOP WELCOME HERO CARD */}
          <View style={styles.heroCard}>
            {/* Logout button at top right */}
            <View style={styles.logoutWrapper}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={logoutHandler}
                style={styles.logoutCircleBtn}
              >
                <PowerIcon size={20} color="#EF4444" />
              </TouchableOpacity>
              <Text style={styles.logoutLabel}>{strings.logout || 'Logout'}</Text>
            </View>

            {/* Centered Avatar Disc */}
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarDisc}>
                <Image source={images.image} style={styles.avatarImg} resizeMode="contain" />
              </View>
            </View>

            {/* Real User Name & Phone */}
            <Text style={styles.welcomeText}>{name || userProfileData?.name || strings.drawer_profile || 'Profile'}</Text>
            <Text style={styles.phoneText}>{phone}</Text>
          </View>

          {/* 3 QUICK ACTION CARDS ROW */}
          <View style={styles.actionsRow}>
            {/* Card 1: Profile */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.actionCard}
              onPress={() => setIsEditing(!isEditing)}
            >
              <View style={styles.actionIconBadge}>
                <UserIcon size={22} color="#1E293B" />
              </View>
              <Text style={styles.actionCardLabel}>{strings.profile_title || 'Profile'}</Text>
            </TouchableOpacity>

            {/* Card 2: Change Password */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.actionCard}
              onPress={() => props.navigation.navigate('SetPassword')}
            >
              <View style={styles.actionIconBadge}>
                <AuthLockIcon size={22} color="#1E293B" />
              </View>
              <Text style={styles.actionCardLabel}>{strings.change_password || 'Password'}</Text>
            </TouchableOpacity>

            {/* Card 3: Support */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.actionCard}
              onPress={() => props.navigation.navigate('ContactUsScreen')}
            >
              <View style={styles.actionIconBadge}>
                <NavSupportIcon size={22} color="#1E293B" />
              </View>
              <Text style={styles.actionCardLabel}>{strings.nav_support || 'Support'}</Text>
            </TouchableOpacity>
          </View>

          {/* SECTION: APP SETTINGS CARD */}
          <View style={styles.settingsCard}>
            <Text style={styles.settingsCardTitle}>{strings.settings || 'Settings'}</Text>

            {/* Row 1: Notifications */}
            <View style={styles.settingRow}>
              <View style={styles.settingIconBadge}>
                <BellIcon size={20} color="#1E293B" />
              </View>
              <View style={styles.settingTextCol}>
                <Text style={styles.settingTitle}>{strings.notifications || 'Notifications'}</Text>
                <Text style={styles.settingSubtitle}>Push notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E2E8F0', true: '#720E24' }}
                thumbColor={notificationsEnabled ? '#D97706' : '#94A3B8'}
              />
            </View>

            <View style={styles.rowDivider} />

            {/* Row 2: Language */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.settingRow}
              onPress={() => props.navigation.navigate('SelectLanguage', { isFirstTime: false })}
            >
              <View style={styles.settingIconBadge}>
                <TranslateIcon size={20} color="#1E293B" />
              </View>
              <View style={styles.settingTextCol}>
                <Text style={styles.settingTitle}>{strings.select_language || 'Language'}</Text>
                <Text style={styles.settingSubtitle}>{language.toUpperCase()}</Text>
              </View>
              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* SECTION: USER DETAILS EDIT CARD */}
          <View style={styles.formCard}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.editPencilBtn}
              onPress={() => setIsEditing(!isEditing)}
            >
              <EditPencilIcon size={18} color={isEditing ? '#D97706' : '#1E293B'} />
            </TouchableOpacity>

            {/* Username Field */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.fieldHeader}>{strings.username_label || 'Username'}</Text>
              {isEditing && (
                <Text style={{ fontSize: 11, color: '#D97706', fontWeight: '700' }}>Editing...</Text>
              )}
            </View>
            <Text style={styles.fieldSubCaption}>{strings.username_label || 'Username'}</Text>
            <TextInput
              style={[styles.underlinedInput, isEditing && { borderBottomColor: '#D97706' }]}
              value={name}
              onChangeText={setName}
              placeholder={strings.enter_username || 'Enter Username'}
              placeholderTextColor="#94A3B8"
              editable={isEditing}
              onFocus={() => {
                setIsEditing(true);
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 150);
              }}
              onPressIn={() => setIsEditing(true)}
            />

            {/* Email Field */}
            <Text style={[styles.fieldHeader, { marginTop: 16 }]}>{strings.email_label || 'Email'}</Text>
            <TextInput
              style={[styles.underlinedInput, { marginTop: 4 }, isEditing && { borderBottomColor: '#D97706' }]}
              value={email}
              onChangeText={setEmail}
              placeholder={strings.email_label || 'Email'}
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={isEditing}
              onFocus={() => {
                setIsEditing(true);
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 150);
              }}
              onPressIn={() => setIsEditing(true)}
            />

            {/* Save & Update Button with Continuous Animation */}
            <Animated.View style={{ transform: [{ translateY: floatBtnAnim }, { scale: scaleBtnAnim }] }}>
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={submitting}
                style={styles.saveBtnTouch}
                onPress={() => {
                  if (!isEditing) {
                    setIsEditing(true);
                  } else {
                    handleUpdateProfile();
                  }
                }}
              >
                <LinearGradient
                  colors={isEditing ? ['#F6B871', '#EE9F4D'] : ['#E2B048', '#C99326']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveBtnGradient}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveBtnText}>
                      {isEditing ? (strings.update_and_save || 'Update & Save') : (strings.edit_profile || 'Edit Profile')}
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
  content: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heroCard: {
    backgroundColor: '#E7B97A',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  logoutWrapper: {
    position: 'absolute',
    top: 16,
    right: 16,
    alignItems: 'center',
  },
  logoutCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  logoutLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  avatarWrapper: {
    marginTop: 10,
    marginBottom: 12,
  },
  avatarDisc: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFE4E6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  avatarImg: {
    width: 70,
    height: 70,
  },
  welcomeText: {
    fontSize: 19,
    fontWeight: '900',
    color: '#1C160F',
    letterSpacing: 0.2,
  },
  phoneText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C160F',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderWidth: 1.2,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  actionIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionCardLabel: {
    color: '#700F27',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center'
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginTop: 14,
    borderWidth: 1.2,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  settingsCardTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#700F27',
    marginBottom: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  settingIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextCol: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 14,
    borderWidth: 1.2,
    borderColor: '#F1F5F9',
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  editPencilBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldHeader: {
    fontSize: 15,
    fontWeight: '900',
    color: '#700F27',
  },
  fieldSubCaption: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  underlinedInput: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    paddingVertical: 6,
    paddingHorizontal: 0,
    marginTop: 4,
  },
  saveBtnTouch: {
    marginTop: 24,
    borderRadius: 25,
    overflow: 'hidden',
  },
  saveBtnGradient: {
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
