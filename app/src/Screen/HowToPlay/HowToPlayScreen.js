/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Linking,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackArrow } from '../../component/MatkaIcons';
import { useLanguage } from '../../context/LanguageContext';
import { useAppSetting } from '../../context/AppSettingContext';
import { getApiCall } from '../../services/AppSetting';
import { base } from '../../config/appConfig';

export default function HowToPlayScreen(props) {
  const insets = useSafeAreaInsets();
  const { strings } = useLanguage();
  const { appSetting } = useAppSetting();
  const [adminHowToPlay, setAdminHowToPlay] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchHowToPlayData();
  }, []);

  const fetchHowToPlayData = async (skipLoading = false) => {
    if (!skipLoading) setLoading(true);
    try {
      const res = await getApiCall(base.howToPlay);
      const content = res?.data?.how_to_play || res?.how_to_play || appSetting?.how_to_play || '';
      setAdminHowToPlay(content);

      // Check if content or res has a video URL (YouTube, etc.)
      const vid = res?.data?.video_url || res?.video_url || extractUrl(content);
      if (vid) setVideoUrl(vid);
    } catch (e) {
      if (appSetting?.how_to_play) {
        setAdminHowToPlay(appSetting.how_to_play);
      }
    } finally {
      if (!skipLoading) setLoading(false);
    }
  };

  const extractUrl = (text) => {
    if (!text) return '';
    const match = text.match(/(https?:\/\/[^\s]+)/g);
    return match ? match[0] : '';
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHowToPlayData(true);
    setRefreshing(false);
  };

  const handleOpenVideo = () => {
    if (videoUrl) {
      Linking.openURL(videoUrl).catch((err) => console.log('Open video error:', err));
    }
  };

  const cardsData = [
    {
      id: 'intro',
      bgColor: '#E8F8F5',
      title: strings.htp_intro_title || 'HOW TO PLAY',
      body: strings.htp_intro_body || 'Here you can see general information related to Bid, Wallet, Add Money, Withdrawal and your History.',
    },
    {
      id: '1',
      bgColor: '#FFEBF0',
      title: strings.htp_bid_title || '1. Bid Information',
      body: strings.htp_bid_body || 'Bid is an entry made according to available game rules. Before submitting, carefully check the selected game, date, time and applicable rules.',
    },
    {
      id: '2',
      bgColor: '#EDFAEE',
      title: strings.htp_result_title || '2. Result & Winning',
      body: strings.htp_result_body || 'Results are published according to scheduled game timetable. If any winning amount applies, its processing is done according to the platform rules.',
    },
    {
      id: '3',
      bgColor: '#F7EEFA',
      title: strings.htp_deposit_title || '3. Add Money',
      body: strings.htp_deposit_body || 'Minimum Deposit: ₹100. Always check available UPI options and submit correct reference number.',
    },
    {
      id: '5',
      bgColor: '#EDF6FD',
      title: strings.htp_history_title || '5. Bid & Win History',
      body: strings.htp_history_body || 'You can view your submitted bid records in Bid History. Result and applicable winning records can be viewed in Win History.',
    },
    {
      id: '6',
      bgColor: '#EEF0F9',
      title: strings.htp_bank_title || '6. Bank & UPI',
      body: strings.htp_bank_body || 'Keep your Bank Account and UPI info verified. Always use payment accounts registered in your own name.',
    },
    {
      id: '7',
      bgColor: '#FFF8E7',
      title: strings.htp_important_title || '7. Important Information',
      body: strings.htp_important_body || 'Use this service only if permitted in your location. Follow all applicable laws and platform rules.',
    },
  ];

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      {/* TOP HEADER */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => props.navigation.goBack()}
          style={styles.backCircleBtn}
        >
          <BackArrow size={20} color="#E2B048" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {strings.how_to_play_title || 'How to Play'}
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.langPillBtn}
          onPress={() => props.navigation.navigate('SelectLanguage', { isFirstTime: false })}
        >
          <Text style={styles.langPillText}>{strings.select_language || 'भाषा'}</Text>
        </TouchableOpacity>
      </View>

      {/* BODY CONTENT WRAPPER */}
      <View style={styles.bodyWrapper}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 30 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E2B048" />
        }
      >
        {loading && (
          <View style={{ paddingVertical: 14, alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#E2B048" />
          </View>
        )}

        {/* DYNAMIC ADMIN INSTRUCTIONS CARD (Added by Admin in DB) */}
        {adminHowToPlay ? (
          <View style={styles.adminGuideCard}>
            <View style={styles.adminGuideHeader}>
              <Text style={styles.adminGuideBadge}>👑 OFFICIAL GUIDE</Text>
              <Text style={styles.adminGuideTitle}>Admin Instructions & Game Rules</Text>
            </View>
            <Text style={styles.adminGuideBody}>{adminHowToPlay}</Text>

            {videoUrl ? (
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.videoBtn}
                onPress={handleOpenVideo}
              >
                <Text style={styles.videoBtnText}>▶ Watch Video Tutorial</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}

        {/* PASTEL TINTED CARDS LIST */}
        {cardsData.map((item) => (
          <View
            key={item.id}
            style={[
              styles.infoCard,
              { backgroundColor: item.bgColor },
              item.isCardWhite && styles.whiteCardBorder,
            ]}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardBody}>{item.body}</Text>
          </View>
        ))}

        {/* BOTTOM FOOTER NOTICE */}
        <Text style={styles.footerNote}>
          {strings.htp_footer_note || 'Please read the applicable rules before using the service.'}
        </Text>
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
    fontSize: 20,
    fontWeight: '800',
    color: '#E2B048',
    letterSpacing: 0.3,
  },
  langPillBtn: {
    backgroundColor: '#DCFCE7',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langPillText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 36,
  },
  infoCard: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  whiteCardBorder: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowOpacity: 0.08,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  cardBody: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 22,
  },
  footerNote: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 13.5,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  adminGuideCard: {
    backgroundColor: '#0B1A2F',
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    elevation: 4,
    shadowColor: '#D4AF37',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  adminGuideHeader: {
    marginBottom: 10,
  },
  adminGuideBadge: {
    color: '#E2B048',
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  adminGuideTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  adminGuideBody: {
    color: '#E2E8F0',
    fontSize: 14.5,
    lineHeight: 23,
    fontWeight: '500',
  },
  videoBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 14,
    alignSelf: 'flex-start',
  },
  videoBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
});
