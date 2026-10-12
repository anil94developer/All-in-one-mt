import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSetting } from '../../context/AppSettingContext';
import LinearGradient from 'react-native-linear-gradient';

const AppUpdate = (props) => {
  const insets = useSafeAreaInsets();
  const { appSetting } = useAppSetting();
  const latestVersion = appSetting.app_version || '—';
  const currentVersion = props.route?.params?.currentVersion ?? '—';
  const hasLink = Boolean(appSetting.app_link?.trim());

  const onUpdate = () => {
    if (hasLink) Linking.openURL(appSetting.app_link.trim()).catch(() => {});
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
          {/* Header strip */}
          <LinearGradient
            colors={['#061224', '#0B1E38', '#142E54']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerStrip}
          >
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>↻</Text>
            </View>
            <Text style={styles.headerTitle}>New Version Available</Text>
            <Text style={styles.headerSub}>Update now for the latest features & security</Text>
          </LinearGradient>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Update Required</Text>
            <Text style={styles.subtitle}>
              A new and improved version of the application is available. Please update to continue playing.
            </Text>

            {/* Version comparison */}
            <View style={styles.versionSection}>
              <View style={styles.versionBox}>
                <Text style={styles.versionLabel}>Current Version</Text>
                <Text style={styles.versionValue}>{currentVersion}</Text>
              </View>
              <View style={styles.versionArrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
              <View style={[styles.versionBox, styles.versionBoxNew]}>
                <Text style={styles.versionLabel}>Latest Version</Text>
                <Text style={styles.versionValueNew}>{latestVersion}</Text>
              </View>
            </View>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>✓</Text>
              <Text style={styles.bulletText}>High-speed server connectivity & bug fixes</Text>
            </View>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>✓</Text>
              <Text style={styles.bulletText}>Improved UI, new games, and faster withdrawals</Text>
            </View>

            <TouchableOpacity
              style={styles.updateBtn}
              onPress={onUpdate}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#E2B048', '#C99732', '#9E6833']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGradient}
              >
                <Text style={styles.buttonText}>Update Now</Text>
              </LinearGradient>
            </TouchableOpacity>

            {!hasLink && (
              <Text style={styles.hint}>Download link will be available soon.</Text>
            )}
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
  iconCircle: {
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
  iconText: {
    fontSize: 28,
    color: '#E2B048',
    fontWeight: '700',
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
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#061224',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  versionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  versionBox: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  versionBoxNew: {
    borderColor: '#E2B048',
    backgroundColor: '#FFFDF5',
    borderWidth: 1.5,
  },
  versionLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: '600',
  },
  versionValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#061224',
  },
  versionValueNew: {
    fontSize: 15,
    fontWeight: '800',
    color: '#B87B14',
  },
  versionArrow: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 20,
    color: '#94A3B8',
    fontWeight: '700',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    marginBottom: 10,
  },
  bullet: {
    fontSize: 14,
    marginRight: 8,
    color: '#10B981',
    fontWeight: '800',
  },
  bulletText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
    flex: 1,
  },
  updateBtn: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 14,
  },
  btnGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#061224',
  },
  hint: {
    marginTop: 12,
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
});

export default AppUpdate;
