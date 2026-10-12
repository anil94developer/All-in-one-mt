import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Linking,
  BackHandler,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '../../assets/images';
import { useLanguage } from '../../context/LanguageContext';
import { useAppSetting } from '../../context/AppSettingContext';
import LinearGradient from 'react-native-linear-gradient';

export default function AccountBlock(props) {
  const { strings } = useLanguage();
  const { appSetting } = useAppSetting();
  const insets = useSafeAreaInsets();

  const handleContactSupport = () => {
    if (appSetting?.whatsapp_number) {
      const num = appSetting.whatsapp_number.toString().trim();
      Linking.openURL(`whatsapp://send?phone=${num}&text=Hello, my account is blocked. Please help.`).catch(() => {});
    } else if (appSetting?.mobile_number) {
      Linking.openURL(`tel:${appSetting.mobile_number}`).catch(() => {});
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      <View style={[styles.bodyWrapper, { paddingBottom: 30 + insets.bottom }]}>
        <View style={styles.card}>
          <Image
            source={images.block}
            style={styles.blockImage}
            resizeMode="contain"
          />

          <Text style={styles.title}>
            {strings.account_blocked_title || 'Account Suspended'}
          </Text>

          <Text style={styles.message}>
            {strings.account_blocked_msg || 'Your account has been deactivated. Please contact our support team to resolve this issue.'}
          </Text>

          {Boolean(appSetting?.whatsapp_number || appSetting?.mobile_number) && (
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.supportBtn}
              onPress={handleContactSupport}
            >
              <LinearGradient
                colors={['#E2B048', '#C99732', '#9E6833']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGradient}
              >
                <Text style={styles.btnText}>
                  {strings.contact_support || 'Contact Customer Support'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.exitBtn}
            onPress={() => BackHandler.exitApp()}
          >
            <Text style={styles.exitText}>
              {strings.exit_app || 'Exit App'}
            </Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 36,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  blockImage: {
    height: 140,
    width: 140,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#061224',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  supportBtn: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14,
  },
  btnGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#061224',
  },
  exitBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  exitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
});