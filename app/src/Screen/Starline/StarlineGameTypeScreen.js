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

// 1. Single Digit Badge (Red Diamond)
const SingleDigitBadge = ({ size = 74 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <Path d="M50 6L90 46L50 86L10 46Z" fill="#BE123C" stroke="#D4AF37" strokeWidth="3" />
    <Path d="M50 14L82 46L50 78L18 46Z" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />
    <SvgText x="50" y="52" fill="#FFFFFF" fontSize="30" fontWeight="900" textAnchor="middle">
      1
    </SvgText>
    <Path d="M8 72L18 66H82L92 72L82 78H18Z" fill="#881337" stroke="#D4AF37" strokeWidth="1" />
    <SvgText x="50" y="74" fill="#FFFFFF" fontSize="7.5" fontWeight="900" textAnchor="middle">
      SINGLE DIGIT
    </SvgText>
  </Svg>
);

// 2. Single Pana Badge (Pink Triangle / Crown with 123)
const SinglePanaBadge = ({ size = 74 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* Triangle Shape */}
    <Path d="M50 8L92 78H8L50 8Z" fill="#BE185D" stroke="#FEF08A" strokeWidth="3" />
    <Path d="M50 18L82 72H18L50 18Z" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.2" />
    {/* Crown icon on top */}
    <Path d="M44 26L47 30L50 25L53 30L56 26L54 33H46L44 26Z" fill="#FDE047" />
    <SvgText x="50" y="52" fill="#FFFFFF" fontSize="22" fontWeight="900" textAnchor="middle">
      123
    </SvgText>
    {/* Ribbon Banner at bottom */}
    <Path d="M6 72L16 66H84L94 72L84 78H16Z" fill="#047857" stroke="#FEF08A" strokeWidth="1" />
    <SvgText x="50" y="74" fill="#FFFFFF" fontSize="7.5" fontWeight="900" textAnchor="middle">
      SINGLE PANA
    </SvgText>
  </Svg>
);

// 3. Double Pana Badge (Shield with 122)
const DoublePanaBadge = ({ size = 74 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* Shield Shape */}
    <Path d="M50 8L86 24V56C86 74 50 90 50 90C50 90 14 74 14 56V24L50 8Z" fill="#B91C1C" stroke="#D4AF37" strokeWidth="3" />
    <Path d="M50 16L78 28V54C78 68 50 80 50 80C50 80 22 68 22 54V28L50 16Z" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1.2" />
    <SvgText x="50" y="52" fill="#FFFFFF" fontSize="22" fontWeight="900" textAnchor="middle">
      122
    </SvgText>
    {/* Ribbon Banner */}
    <Path d="M8 72L18 66H82L92 72L82 78H18Z" fill="#991B1B" stroke="#D4AF37" strokeWidth="1" />
    <SvgText x="50" y="74" fill="#FFFFFF" fontSize="7.5" fontWeight="900" textAnchor="middle">
      DOUBLE PANA
    </SvgText>
  </Svg>
);

// 4. Triple Pana Badge (Crown / Laurel circle with 333)
const TriplePanaBadge = ({ size = 74 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* Circle with laurel / crown */}
    <Circle cx="50" cy="46" r="30" fill="#7E22CE" stroke="#FBBF24" strokeWidth="3" />
    {/* Golden Crown */}
    <Path d="M38 24L44 32L50 22L56 32L62 24L59 36H41L38 24Z" fill="#FBBF24" />
    <SvgText x="50" y="54" fill="#FFFFFF" fontSize="21" fontWeight="900" textAnchor="middle">
      333
    </SvgText>
    {/* Ribbon Banner */}
    <Path d="M10 72L20 66H80L90 72L80 78H20Z" fill="#581C87" stroke="#FBBF24" strokeWidth="1" />
    <SvgText x="50" y="74" fill="#FFFFFF" fontSize="7.5" fontWeight="900" textAnchor="middle">
      TRIPLE PANA
    </SvgText>
  </Svg>
);

export default function StarlineGameTypeScreen(props) {
  const insets = useSafeAreaInsets();
  const { strings } = useLanguage();
  const { market } = props.route.params || { market: { time: '7:05 PM' } };

  const handleSelectGame = (gameType) => {
    props.navigation.navigate('StarlineBidScreen', {
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
        <Text style={styles.headerTitle}>{market.time || 'STARLINE'}</Text>
      </View>

      {/* BODY CONTENT WRAPPER */}
      <View style={styles.bodyWrapper}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Row 1: Single Digit & Single Pana */}
        <View style={styles.row}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.card, styles.singleDigitCard]}
            onPress={() => handleSelectGame('Single Digit')}
          >
            <View style={styles.badgeWrapper}>
              <SingleDigitBadge size={76} />
            </View>
            <Text style={styles.cardLabel}>{strings.single_digit || 'Single Digit'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.card, styles.singlePanaCard]}
            onPress={() => handleSelectGame('Single Pana')}
          >
            <View style={styles.badgeWrapper}>
              <SinglePanaBadge size={76} />
            </View>
            <Text style={styles.cardLabel}>{strings.single_pana || 'Single Pana'}</Text>
          </TouchableOpacity>
        </View>

        {/* Row 2: Double Pana & Triple Pana */}
        <View style={styles.row}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.card, styles.doublePanaCard]}
            onPress={() => handleSelectGame('Double Pana')}
          >
            <View style={styles.badgeWrapper}>
              <DoublePanaBadge size={76} />
            </View>
            <Text style={styles.cardLabel}>{strings.double_pana || 'Double Pana'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.card, styles.triplePanaCard]}
            onPress={() => handleSelectGame('Triple Pana')}
          >
            <View style={styles.badgeWrapper}>
              <TriplePanaBadge size={76} />
            </View>
            <Text style={styles.cardLabel}>{strings.triple_pana || 'Triple Pana'}</Text>
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
    paddingTop: 22,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
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
  singleDigitCard: {
    backgroundColor: '#E6F7F7', // Soft cyan matching Image 3
  },
  singlePanaCard: {
    backgroundColor: '#FDEEF0', // Soft pink matching Image 3
  },
  doublePanaCard: {
    backgroundColor: '#EAF8EE', // Soft green matching Image 3
  },
  triplePanaCard: {
    backgroundColor: '#F3E8FF', // Soft lavender matching Image 3
  },
  badgeWrapper: {
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
