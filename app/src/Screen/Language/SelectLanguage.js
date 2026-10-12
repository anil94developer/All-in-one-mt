/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackArrow } from '../../component/MatkaIcons';
import { langague_change } from '../../Language/languge';
import { useLanguage } from '../../context/LanguageContext';

// Realistic Waving US Flag
const WavingUSFlag = ({ width = 36, height = 26 }) => (
  <Svg width={width} height={height} viewBox="0 0 36 26" fill="none">
    {/* Base Red Background with wave curves */}
    <Path
      d="M2 3.5C7 1.5 12 5.5 18 3.5C24 1.5 29 5.5 34 3.5V20.5C29 22.5 24 18.5 18 20.5C12 22.5 7 18.5 2 20.5V3.5Z"
      fill="#B22234"
    />
    {/* White Stripes with wave curves */}
    <Path
      d="M2 6.5C7 4.5 12 8.5 18 6.5C24 4.5 29 8.5 34 6.5V8.5C29 10.5 24 6.5 18 8.5C12 10.5 7 6.5 2 8.5V6.5Z"
      fill="#FFFFFF"
    />
    <Path
      d="M2 11.5C7 9.5 12 13.5 18 11.5C24 9.5 29 13.5 34 11.5V13.5C29 15.5 24 11.5 18 13.5C12 15.5 7 11.5 2 13.5V11.5Z"
      fill="#FFFFFF"
    />
    <Path
      d="M2 16.5C7 14.5 12 18.5 18 16.5C24 14.5 29 18.5 34 16.5V18.5C29 20.5 24 16.5 18 20.5V16.5Z"
      fill="#FFFFFF"
    />
    {/* Blue Canton with wave */}
    <Path
      d="M2 3.5C7 1.5 12 5.5 18 3.5V13.5C12 15.5 7 11.5 2 13.5V3.5Z"
      fill="#3C3B6E"
    />
    {/* Tiny Stars on Canton */}
    <Circle cx="5" cy="5.8" r="0.7" fill="#FFFFFF" />
    <Circle cx="9" cy="5.8" r="0.7" fill="#FFFFFF" />
    <Circle cx="13" cy="5.8" r="0.7" fill="#FFFFFF" />
    <Circle cx="7" cy="8.5" r="0.7" fill="#FFFFFF" />
    <Circle cx="11" cy="8.5" r="0.7" fill="#FFFFFF" />
    <Circle cx="15" cy="8.5" r="0.7" fill="#FFFFFF" />
    <Circle cx="5" cy="11.2" r="0.7" fill="#FFFFFF" />
    <Circle cx="9" cy="11.2" r="0.7" fill="#FFFFFF" />
    <Circle cx="13" cy="11.2" r="0.7" fill="#FFFFFF" />
  </Svg>
);

// Realistic Waving India Flag (Tiranga)
const WavingIndiaFlag = ({ width = 36, height = 26 }) => (
  <Svg width={width} height={height} viewBox="0 0 36 26" fill="none">
    {/* Top Saffron Band with wave curves */}
    <Path
      d="M2 3.5C7 1.5 12 5.5 18 3.5C24 1.5 29 5.5 34 3.5V9.5C29 11.5 24 7.5 18 9.5C12 11.5 7 7.5 2 9.5V3.5Z"
      fill="#FF9933"
    />
    {/* Middle White Band with wave curves */}
    <Path
      d="M2 9.5C7 7.5 12 11.5 18 9.5C24 7.5 29 11.5 34 9.5V15.5C29 17.5 24 13.5 18 15.5C12 17.5 7 13.5 2 15.5V9.5Z"
      fill="#FFFFFF"
    />
    {/* Bottom Green Band with wave curves */}
    <Path
      d="M2 15.5C7 13.5 12 17.5 18 15.5C24 13.5 29 17.5 34 15.5V21.5C29 23.5 24 19.5 18 21.5C12 23.5 7 19.5 2 21.5V15.5Z"
      fill="#138808"
    />
    {/* Ashoka Chakra in center */}
    <Circle cx="18" cy="12.5" r="2.4" stroke="#000088" strokeWidth="0.7" fill="none" />
    <Circle cx="18" cy="12.5" r="0.7" fill="#000088" />
  </Svg>
);

const LANGUAGES = [
  { id: 'en', code: 'en', title: 'English', subtitle: 'Default', isUS: true },
  { id: 'hi', code: 'hi', title: 'हिंदी', subtitle: 'Hindi', isUS: false },
  { id: 'gu', code: 'gu', title: 'ગુજરાતી', subtitle: 'Gujarati', isUS: false },
  { id: 'mr', code: 'mr', title: 'मराठी', subtitle: 'Marathi', isUS: false },
  { id: 'kn', code: 'kn', title: 'ಕನ್ನಡ', subtitle: 'Kannada', isUS: false },
  { id: 'ml', code: 'ml', title: 'മലയാളം', subtitle: 'Malayalam', isUS: false },
];

export default function SelectLanguage(props) {
  const insets = useSafeAreaInsets();
  const isFirstTime = props.route?.params?.isFirstTime ?? false;
  const { language, changeLanguage, strings } = useLanguage();
  const [selectedLang, setSelectedLang] = useState(language || 'en');

  // Next button continuous floating & scale pulse animation
  const floatNextAnim = useRef(new Animated.Value(0)).current;
  const scaleNextAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const nextLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(floatNextAnim, {
            toValue: -6,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(scaleNextAnim, {
            toValue: 1.025,
            duration: 650,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(floatNextAnim, {
            toValue: 0,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(scaleNextAnim, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    nextLoop.start();
    return () => nextLoop.stop();
  }, [floatNextAnim, scaleNextAnim]);

  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const saved = await AsyncStorage.getItem('appLanguage');
        if (saved) {
          setSelectedLang(saved);
        } else if (language) {
          setSelectedLang(language);
        }
      } catch (e) {}
    };
    loadSavedLanguage();
  }, [language]);

  const handleSelectLanguage = async (lang) => {
    setSelectedLang(lang.id);
    try {
      await changeLanguage(lang.id);
      await AsyncStorage.setItem('appLanguage', lang.id);
      await AsyncStorage.setItem('language', lang.id);
      await AsyncStorage.setItem('language_selected', 'true');
      await langague_change(lang.id);
    } catch (e) {}
  };

  const handleNext = async () => {
    try {
      await changeLanguage(selectedLang);
      await AsyncStorage.setItem('appLanguage', selectedLang);
      await AsyncStorage.setItem('language', selectedLang);
      await AsyncStorage.setItem('language_selected', 'true');
      await langague_change(selectedLang);
    } catch (e) {}

    if (isFirstTime) {
      try {
        const token = await AsyncStorage.getItem('token');
        const phone = await AsyncStorage.getItem('phone');
        if (token && phone) {
          props.navigation.replace('Drawers', { screen: 'Home' });
        } else {
          props.navigation.replace('SignUp');
        }
      } catch (e) {
        props.navigation.replace('Drawers', { screen: 'Home' });
      }
    } else {
      if (props.navigation.canGoBack()) {
        props.navigation.goBack();
      } else {
        props.navigation.replace('Drawers', { screen: 'Home' });
      }
    }
  };

  const handleBack = () => {
    if (props.navigation.canGoBack()) {
      props.navigation.goBack();
    } else {
      props.navigation.replace('Drawers', { screen: 'Home' });
    }
  };

  const bottomInsetMargin = Math.max(insets.bottom, 16) + 10;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      {/* TOP HEADER BAR */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.backCircleBtn}
          onPress={handleBack}
        >
          <BackArrow size={20} color="#E2B048" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{strings.select_language_title || 'Select Language'}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* BODY CONTENT WRAPPER */}
      <View style={styles.bodyWrapper}>
      {/* LANGUAGE SELECTION LIST */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomInsetMargin + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {LANGUAGES.map((lang) => {
          const isSelected = selectedLang === lang.id;
          return (
            <TouchableOpacity
              key={lang.id}
              activeOpacity={0.85}
              style={[
                styles.langCard,
                isSelected ? styles.langCardSelected : styles.langCardUnselected,
              ]}
              onPress={() => handleSelectLanguage(lang)}
            >
              {/* Flag Container */}
              <View style={styles.flagBox}>
                {lang.isUS ? (
                  <WavingUSFlag width={36} height={26} />
                ) : (
                  <WavingIndiaFlag width={36} height={26} />
                )}
              </View>

              {/* Title & Subtitle */}
              <View style={styles.langTextContainer}>
                <Text style={styles.langTitle}>
                  {lang.title}
                </Text>
                <Text style={styles.langSubtitle}>{lang.subtitle}</Text>
              </View>

              {/* Selection Checkmark Icon on Selected */}
              {isSelected && (
                <View style={styles.checkCircleBadge}>
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M20 6L9 17L4 12"
                      stroke="#FFFFFF"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* BOTTOM FLOATING NEXT BUTTON with Safe Area & No Overflow Cutoff */}
      <View style={[styles.bottomFloatingWrapper, { bottom: bottomInsetMargin }]} pointerEvents="box-none">
        <Animated.View style={{ transform: [{ translateY: floatNextAnim }, { scale: scaleNextAnim }] }}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.nextBtnTouch}
            onPress={handleNext}
          >
            <LinearGradient
              colors={['#D8B87E', '#C6A15E', '#B38B47', '#9C7430']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.nextBtnGradient}
            >
              <Text style={styles.nextBtnText}>{strings.next_btn || 'Next'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
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
    backgroundColor: '#F5F5F7',
  },
  header: {
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
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: '#E2B048',
    letterSpacing: 0.3,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  langCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  langCardUnselected: {
    borderWidth: 1.5,
    borderColor: '#E8ECF2',
  },
  langCardSelected: {
    borderWidth: 2,
    borderColor: '#7A1C2E',
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#7A1C2E',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  flagBox: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  langTextContainer: {
    flex: 1,
  },
  langTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.2,
  },
  langSubtitle: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#828282',
    marginTop: 2,
  },
  checkCircleBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#7A1C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomFloatingWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 99,
  },
  nextBtnTouch: {
    width: '100%',
    height: 52,
    borderRadius: 18,
    elevation: 6,
    shadowColor: '#8A5D20',
    shadowOpacity: 0.38,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  nextBtnGradient: {
    width: '100%',
    height: 52,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1.2,
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
    borderBottomWidth: 1.2,
    borderBottomColor: 'rgba(110, 75, 20, 0.4)',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: 'rgba(195, 155, 75, 0.35)',
    borderRightColor: 'rgba(195, 155, 75, 0.35)',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
