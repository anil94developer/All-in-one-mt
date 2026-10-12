import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSetting } from '../../context/AppSettingContext';
import { icons } from '../../assets/images';
import LinearGradient from 'react-native-linear-gradient';

const DEFAULT_MESSAGE =
  'Our app is currently under maintenance. We are working to bring you a better experience. Please check back soon. Thank you for your patience!';

const UnderMaintenance = (props) => {
  const insets = useSafeAreaInsets();
  const { appSetting, refresh, loading } = useAppSetting();
  const message = props.route?.params?.message ?? appSetting.message ?? DEFAULT_MESSAGE;
  const hasWhatsApp = Boolean(appSetting.whatsapp_number?.toString().trim());

  const onTryAgain = async () => {
    await refresh();
    props.navigation.replace('Splash');
  };

  const onWhatsAppSupport = () => {
    if (hasWhatsApp) {
      const num = appSetting.whatsapp_number.toString().trim();
      Linking.openURL('whatsapp://send?text=Hello, I need support.&phone=' + num).catch(() => {});
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      <View style={styles.bodyWrapper}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 30 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header */}
          <LinearGradient
            colors={['#061224', '#0B1E38', '#142E54']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerStrip}
          >
            <View style={styles.iconWrap}>
              <Text style={styles.iconEmoji}>🔧</Text>
            </View>
            <Text style={styles.headerTitle}>Under Maintenance</Text>
            <Text style={styles.headerSub}>We'll be back shortly</Text>
          </LinearGradient>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>System Notice</Text>
            <View style={styles.messageBox}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
            <Text style={styles.footerText}>
              If you have any urgent queries or pending transactions, please contact customer support.
            </Text>

            {hasWhatsApp && (
              <TouchableOpacity
                style={styles.whatsappBtn}
                onPress={onWhatsAppSupport}
                activeOpacity={0.85}
              >
                <Image source={icons.whatapp} style={styles.whatsappIcon} resizeMode="contain" />
                <Text style={styles.whatsappBtnText}>Contact on WhatsApp</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.tryAgainBtn}
              onPress={onTryAgain}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#E2B048', '#C99732', '#9E6833']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#061224" size="small" />
                ) : (
                  <Text style={styles.tryAgainText}>Check Server Status</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061224',
  },
  bodyWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerStrip: {
    borderRadius: 22,
    paddingVertical: 26,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(226, 176, 72, 0.18)',
    borderWidth: 1.5,
    borderColor: '#E2B048',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconEmoji: {
    fontSize: 28,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#061224',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  messageBox: {
    width: '100%',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
    backgroundColor: '#FFFBEB',
    marginBottom: 16,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#78350F',
    textAlign: 'left',
  },
  footerText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: '#25D366',
    width: '100%',
  },
  whatsappIcon: {
    width: 22,
    height: 22,
    tintColor: '#FFFFFF',
    marginRight: 10,
  },
  whatsappBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tryAgainBtn: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  btnGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tryAgainText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#061224',
  },
});

export default UnderMaintenance;
