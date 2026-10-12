import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { useAppSetting } from '../../context/AppSettingContext';
import { BackArrow, BellIcon, CalendarIcon } from '../../component/MatkaIcons';
import { useLanguage } from '../../context/LanguageContext';
import { getApiCall } from '../../services/AppSetting';
import { base } from '../../config/appConfig';

export default function NoticeScreen(props) {
  const insets = useSafeAreaInsets();
  const { appSetting } = useAppSetting();
  const { strings } = useLanguage();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async (skipLoading = false) => {
    if (!skipLoading) setLoading(true);
    try {
      const res = await getApiCall(base.notifications);
      let list = [];
      if (Array.isArray(res?.data)) list = res.data;
      else if (Array.isArray(res?.notifications)) list = res.notifications;
      else if (Array.isArray(res?.result)) list = res.result;

      if (list.length > 0) {
        setNotices(list);
      } else {
        // Fallback to appSetting marquee message if DB list is empty
        const defaultMsg = appSetting?.alert_message || appSetting?.home_text || "Welcome to Bhau Matka! Stay connected for real-time results.";
        setNotices([
          {
            id: '1',
            tag: '#NOTICE',
            title: 'NOTICE BOARD',
            message: defaultMsg,
            date: new Date().toISOString(),
          },
        ]);
      }
    } catch (e) {
      const defaultMsg = appSetting?.alert_message || appSetting?.home_text || "Welcome to Bhau Matka! Stay connected for real-time results.";
      setNotices([
        {
          id: '1',
          tag: '#NOTICE',
          title: 'NOTICE BOARD',
          message: defaultMsg,
          date: new Date().toISOString(),
        },
      ]);
    } finally {
      if (!skipLoading) setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotices(true);
    setRefreshing(false);
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      {/* TOP HEADER */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => props.navigation.goBack()}
          style={styles.backBtn}
        >
          <BackArrow size={20} color="#E2B048" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{strings.notice_title || 'Notice Board'}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* BODY CONTENT WRAPPER */}
      <View style={styles.bodyWrapper}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E2B048" />
        }
      >
        {/* GOLD ADMIN UPDATE BANNER */}
        <LinearGradient
          colors={['#A86D12', '#C58B24', '#7A4D07']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.adminBannerCard}
        >
          <View style={styles.bannerBellCircle}>
            <BellIcon size={26} color="#991B1B" />
          </View>
          <View style={styles.bannerTextCol}>
            <Text style={styles.bannerTitle}>{strings.admin_update_title || 'नवीनतम एडमिन अपडेट'}</Text>
            <Text style={styles.bannerSubtitle}>
              {strings.admin_update_sub || 'नवीनतम एडमिन नोटिफिकेशन दिखाए जा रहे हैं'}
            </Text>
          </View>
        </LinearGradient>

        {loading && notices.length === 0 ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#E2B048" />
            <Text style={{ marginTop: 10, color: '#94A3B8', fontSize: 13 }}>सूचनाएं लोड हो रही हैं...</Text>
          </View>
        ) : (
          /* NOTICES LIST */
          <View style={styles.noticesList}>
            {notices.map((item, index) => {
              const formattedDate = item.date
                ? moment(item.date).format('DD MMM YYYY, hh:mm A')
                : moment().format('DD MMM YYYY, hh:mm A');

              return (
                <View key={item.id || index} style={styles.noticeCard}>
                  <View style={styles.noticeCardHeader}>
                    <View style={styles.noticeBellBadge}>
                      <BellIcon size={18} color="#DC2626" />
                    </View>

                    <Text style={styles.noticeCardTitle}>{item.title || 'NOTICE'}</Text>

                    <View style={styles.tagBadge}>
                      <Text style={styles.tagBadgeText}>{item.tag || `#${index + 1}`}</Text>
                    </View>
                  </View>

                  <Text style={styles.noticeMessage}>{item.message}</Text>

                  <View style={styles.noticeFooter}>
                    <CalendarIcon size={14} color="#94A3B8" />
                    <Text style={styles.noticeDate}>{formattedDate}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
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
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#E2B048',
    letterSpacing: 0.3,
  },
  scrollArea: {
    flex: 1,
  },
  adminBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 18,
    elevation: 3,
    shadowColor: '#C58B24',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  bannerBellCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTextCol: {
    flex: 1,
    marginLeft: 14,
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  bannerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FEF3C7',
    marginTop: 3,
  },
  noticesList: {
    paddingHorizontal: 16,
    marginTop: 14,
  },
  noticeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  noticeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noticeBellBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noticeCardTitle: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    marginLeft: 12,
    letterSpacing: 0.3,
  },
  tagBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  tagBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#991B1B',
  },
  noticeMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 12,
  },
  noticeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  noticeDate: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#94A3B8',
    marginLeft: 6,
  },
});
