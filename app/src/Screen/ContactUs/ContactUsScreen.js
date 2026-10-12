/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Linking,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSetting } from '../../context/AppSettingContext';
import { useLanguage } from '../../context/LanguageContext';
import { screenWidth } from '../../constants/Sizes.constant';
import { getApiCall } from '../../services/AppSetting';
import { base } from '../../config/appConfig';
import {
  BackArrow,
  SupportTeamIllustration,
  ContactPhoneIcon,
  ContactTelegramIcon,
  ContactWhatsappIcon,
  ContactChatIcon,
} from '../../component/MatkaIcons';

export default function ContactUsScreen(props) {
  const insets = useSafeAreaInsets();
  const { appSetting } = useAppSetting();
  const { strings } = useLanguage();
  const [liveContact, setLiveContact] = useState(null);

  useEffect(() => {
    fetchLiveContact();
  }, []);

  const fetchLiveContact = async () => {
    try {
      const res = await getApiCall(base.contactUs);
      if (res?.data && typeof res.data === 'object') {
        setLiveContact(res.data);
      }
    } catch (e) {}
  };

  const getPhoneNumber = () => {
    return String(liveContact?.mobile || appSetting?.mobile_number || '1122233446').trim();
  };

  const getWhatsappNumber = () => {
    const num = liveContact?.wp_mobile || appSetting?.whatsapp_number || liveContact?.mobile || appSetting?.mobile_number || '9982667788';
    return String(num).trim();
  };

  const getEmail = () => {
    return String(liveContact?.email || appSetting?.contact_email || 'info@admin.com').trim();
  };

  const getAddress = () => {
    return String(liveContact?.address || appSetting?.contact_address || 'Rajasthan').trim();
  };

  const handlePhoneCall = () => {
    const phone = getPhoneNumber();
    Linking.openURL(`tel:${phone}`).catch((err) => console.log('Phone call error:', err));
  };

  const handleTelegram = () => {
    let link = String(appSetting?.telegram_link || 'https://t.me/matkasupport').trim();
    if (link && !link.startsWith('http://') && !link.startsWith('https://')) {
      link = `https://${link}`;
    }
    Linking.openURL(link).catch((err) => console.log('Telegram open error:', err));
  };

  const handleWhatsapp = () => {
    const rawNumber = getWhatsappNumber();
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const appUrl = `whatsapp://send?phone=${cleanNumber}`;
    const webUrl = `https://wa.me/${cleanNumber}`;

    Linking.canOpenURL(appUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(appUrl);
        } else {
          return Linking.openURL(webUrl);
        }
      })
      .catch(() => Linking.openURL(webUrl));
  };

  const handleChatUs = () => {
    props.navigation.navigate('SupportChatScreen');
  };

  const handleEmail = () => {
    const email = getEmail();
    Linking.openURL(`mailto:${email}`).catch((err) => console.log('Email error:', err));
  };

  const cardWidth = (screenWidth - 32 - 14) / 2;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      {/* TOP HEADER */}
      <View style={styles.headerBar}>
        {/* Gold Outlined Back Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => props.navigation.goBack()}
          style={styles.backCircleBtn}
        >
          <BackArrow size={20} color="#E2B048" />
        </TouchableOpacity>

        {/* Centered Gold Title */}
        <Text style={styles.headerTitle}>
          {strings.contact_title || 'Contact Us'}
        </Text>

        {/* Right balance spacer */}
        <View style={styles.headerSpacer} />
      </View>

      {/* SCREEN CONTENT AREA */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 36 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Support Team Illustration */}
        <View style={styles.illustrationWrapper}>
          <SupportTeamIllustration width={screenWidth * 0.88} height={180} />
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          {strings.contact_sub || 'We usually respond within a few minutes'}
        </Text>

        {/* 2x2 Action Cards Grid */}
        <View style={styles.gridContainer}>
          {/* Card 1: Phone Call */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handlePhoneCall}
            style={[styles.card, { width: cardWidth }]}
          >
            <View style={[styles.iconBadge, styles.phoneBadge]}>
              <ContactPhoneIcon size={28} />
            </View>
            <Text style={styles.cardTitle}>
              {strings.phone_call || 'Phone Call'}
            </Text>
          </TouchableOpacity>

          {/* Card 2: Telegram */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleTelegram}
            style={[styles.card, { width: cardWidth }]}
          >
            <View style={[styles.iconBadge, styles.telegramBadge]}>
              <ContactTelegramIcon size={32} />
            </View>
            <Text style={styles.cardTitle}>
              {strings.telegram || 'Telegram'}
            </Text>
          </TouchableOpacity>

          {/* Card 3: Whatsapp */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleWhatsapp}
            style={[styles.card, { width: cardWidth }]}
          >
            <View style={[styles.iconBadge, styles.whatsappBadge]}>
              <ContactWhatsappIcon size={32} />
            </View>
            <Text style={styles.cardTitle}>
              {strings.whatsapp || 'Whatsapp'}
            </Text>
          </TouchableOpacity>

          {/* Card 4: Chat Us */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleChatUs}
            style={[styles.card, { width: cardWidth }]}
          >
            <View style={[styles.iconBadge, styles.chatBadge]}>
              <ContactChatIcon size={28} />
            </View>
            <Text style={styles.cardTitle}>
              {strings.chat_us || 'Chat Us'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* DETAILED CONTACT INFO FROM DATABASE */}
        <View style={styles.contactDetailsCard}>
          <Text style={styles.contactCardTitle}>Customer Support Details</Text>

          <TouchableOpacity activeOpacity={0.7} style={styles.detailRow} onPress={handlePhoneCall}>
            <Text style={styles.detailLabel}>📞 Calling Helpline:</Text>
            <Text style={styles.detailValue}>+91 {getPhoneNumber()}</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={styles.detailRow} onPress={handleWhatsapp}>
            <Text style={styles.detailLabel}>💬 WhatsApp Support:</Text>
            <Text style={styles.detailValue}>+91 {getWhatsappNumber()}</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={styles.detailRow} onPress={handleEmail}>
            <Text style={styles.detailLabel}>✉️ Official Email:</Text>
            <Text style={styles.detailValue}>{getEmail()}</Text>
          </TouchableOpacity>

          {getAddress() ? (
            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.detailLabel}>📍 Registered Office:</Text>
              <Text style={styles.detailValue}>{getAddress()}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
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
    fontSize: 20,
    fontWeight: '800',
    color: '#E2B048',
    letterSpacing: 0.4,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  scrollArea: {
    flex: 1,
    backgroundColor: '#D8C3A7',
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 36,
  },
  illustrationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
    letterSpacing: 0.2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  iconBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  phoneBadge: {
    backgroundColor: '#E0F2FE',
  },
  telegramBadge: {
    backgroundColor: '#E0F2FE',
  },
  whatsappBadge: {
    backgroundColor: '#DCFCE7',
  },
  chatBadge: {
    backgroundColor: '#FFEDD5',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  contactDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 30,
    padding: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  contactCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#061224',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  detailRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#64748B',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
});
