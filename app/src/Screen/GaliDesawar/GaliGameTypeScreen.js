/* eslint-disable prettier/prettier */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, Text as SvgText } from 'react-native-svg';
import { BackArrow } from '../../component/MatkaIcons';
import { useLanguage } from '../../context/LanguageContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

// Diamond Badge for Single Digit (Left Digit)
const LeftDigitBadge = ({ size = 76 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* Red Diamond */}
    <Path d="M50 6L90 46L50 86L10 46Z" fill="#BE123C" stroke="#D4AF37" strokeWidth="3" />
    <Path d="M50 14L82 46L50 78L18 46Z" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />
    <SvgText x="50" y="52" fill="#FFFFFF" fontSize="30" fontWeight="900" textAnchor="middle">
      1
    </SvgText>
    {/* Ribbon Banner */}
    <Path d="M8 72L18 66H82L92 72L82 78H18Z" fill="#881337" stroke="#D4AF37" strokeWidth="1" />
    <SvgText x="50" y="74" fill="#FFFFFF" fontSize="7.5" fontWeight="900" textAnchor="middle">
      SINGLE DIGIT
    </SvgText>
  </Svg>
);

// Diamond Badge for Single Digit Bulk (Right Digit)
const RightDigitBadge = ({ size = 76 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* Amber Diamond */}
    <Path d="M50 6L90 46L50 86L10 46Z" fill="#D97706" stroke="#FEF08A" strokeWidth="3" />
    <Path d="M50 14L82 46L50 78L18 46Z" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />
    <SvgText x="50" y="44" fill="#FFFFFF" fontSize="24" fontWeight="900" textAnchor="middle">
      1
    </SvgText>
    <SvgText x="50" y="57" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">
      BULK
    </SvgText>
    {/* Ribbon Banner */}
    <Path d="M4 72L14 66H86L96 72L86 78H14Z" fill="#92400E" stroke="#FEF08A" strokeWidth="1" />
    <SvgText x="50" y="74" fill="#FFFFFF" fontSize="6.5" fontWeight="900" textAnchor="middle">
      SINGLE DIGIT BULK
    </SvgText>
  </Svg>
);

// Round Bulb Badge for Jodi Digit
const JodiDigitBadge = ({ size = 76 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* Bulb Circle */}
    <Circle cx="50" cy="44" r="32" fill="#831843" stroke="#F59E0B" strokeWidth="3.5" />
    {/* Theatre Bulbs */}
    <Circle cx="50" cy="16" r="2.2" fill="#FDE047" />
    <Circle cx="70" cy="24" r="2.2" fill="#FDE047" />
    <Circle cx="78" cy="44" r="2.2" fill="#FDE047" />
    <Circle cx="70" cy="64" r="2.2" fill="#FDE047" />
    <Circle cx="50" cy="72" r="2.2" fill="#FDE047" />
    <Circle cx="30" cy="64" r="2.2" fill="#FDE047" />
    <Circle cx="22" cy="44" r="2.2" fill="#FDE047" />
    <Circle cx="30" cy="24" r="2.2" fill="#FDE047" />
    <SvgText x="50" y="52" fill="#FFFFFF" fontSize="24" fontWeight="900" textAnchor="middle">
      12
    </SvgText>
    {/* Ribbon Banner */}
    <Path d="M10 72L20 66H80L90 72L80 78H20Z" fill="#701A75" stroke="#F59E0B" strokeWidth="1" />
    <SvgText x="50" y="74" fill="#FFFFFF" fontSize="8" fontWeight="900" textAnchor="middle">
      JODI DIGIT
    </SvgText>
  </Svg>
);

export default function GaliGameTypeScreen(props) {
  const insets = useSafeAreaInsets();
  const { strings } = useLanguage();
  const { market } = props.route.params || { market: { name: 'FARIDABAD' } };

  const handleSelectGame = (gameType) => {
    props.navigation.navigate('GaliBidScreen', {
      market,
      gameType,
    });
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backCircleBtn}
          onPress={() => props.navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <BackArrow size={20} color="#E2B048" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{market.name.toUpperCase()}</Text>
      </View>

      {/* BODY CONTENT WRAPPER */}
      <View style={styles.bodyWrapper}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top 2 Cards: Left Digit & Right Digit */}
        <View style={styles.topRow}>
          {/* Card 1: Left Digit */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.card, styles.leftDigitCard]}
            onPress={() => handleSelectGame('Left Digit')}
          >
            <View style={styles.badgeWrapper}>
              <LeftDigitBadge size={80} />
            </View>
            <Text style={styles.cardLabel}>{strings.left_digit || 'Left Digit'}</Text>
          </TouchableOpacity>

          {/* Card 2: Right Digit */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.card, styles.rightDigitCard]}
            onPress={() => handleSelectGame('Right Digit')}
          >
            <View style={styles.badgeWrapper}>
              <RightDigitBadge size={80} />
            </View>
            <Text style={styles.cardLabel}>{strings.right_digit || 'Right Digit'}</Text>
          </TouchableOpacity>
        </View>

        {/* Center Card 3: Jodi Digit */}
        <View style={styles.centerRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.card, styles.jodiDigitCard]}
            onPress={() => handleSelectGame('Jodi Digit')}
          >
            <View style={styles.badgeWrapper}>
              <JodiDigitBadge size={80} />
            </View>
            <Text style={styles.cardLabel}>{strings.jodi_digit || 'Jodi Digit'}</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#F5F6FA',
  },
  header: {
    backgroundColor: '#061224',
    minHeight: 56,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 14,
  },
  headerTitle: {
    flex: 1,
    fontSize: 19,
    fontWeight: '800',
    color: '#E2B048',
    letterSpacing: 0.5,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  centerRow: {
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  leftDigitCard: {
    backgroundColor: '#E6F7F7', // Soft cyan matching Image 3
  },
  rightDigitCard: {
    backgroundColor: '#FDEEF0', // Soft pink matching Image 3
  },
  jodiDigitCard: {
    backgroundColor: '#EAF8EE', // Soft green matching Image 3
  },
  badgeWrapper: {
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
