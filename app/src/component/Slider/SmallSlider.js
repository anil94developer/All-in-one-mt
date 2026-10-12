/* eslint-disable prettier/prettier */
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { screenWidth } from '../../constants/Sizes.constant';
import { domainUrl } from '../../config/appConfig';

const CARD_WIDTH = screenWidth - 28;
const CARD_HEIGHT = 145;

export default function SmallSlider(props) {
  const { list } = props;
  const scrollViewRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Auto-play sliding every 3.8 seconds
  useEffect(() => {
    if (!list || list.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) => {
        const nextIndex = (prev + 1) % list.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * screenWidth,
          animated: true,
        });
        return nextIndex;
      });
    }, 3800);

    return () => clearInterval(interval);
  }, [list]);

  if (!list || list.length === 0) {
    return null;
  }

  const handleScroll = (event) => {
    const { x } = event.nativeEvent.contentOffset;
    const nextIndex = Math.round(x / screenWidth);
    if (nextIndex >= 0 && nextIndex < list.length && nextIndex !== currentPage) {
      setCurrentPage(nextIndex);
    }
  };

  const onItemPress = (item) => {
    if (item?.url) {
      Linking.openURL(item.url).catch(() => null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Slider View */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        style={styles.scrollView}
      >
        {list.map((item, index) => {
          const imageUri = item.image?.startsWith('http')
            ? item.image
            : `${domainUrl}/${item.image}`;

          return (
            <View key={item.id || index} style={styles.slidePage}>
              <TouchableOpacity
                activeOpacity={item?.url ? 0.85 : 1}
                onPress={() => onItemPress(item)}
                style={styles.cardWrapper}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />

                {/* Permanent subtle top gloss reflection */}
                <LinearGradient
                  colors={[
                    'rgba(255, 255, 255, 0.18)',
                    'rgba(255, 255, 255, 0.04)',
                    'transparent',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.glossOverlay}
                  pointerEvents="none"
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* Pagination Dots */}
      {list.length > 1 && (
        <View style={styles.paginationRow}>
          {list.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentPage ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    alignItems: 'center',
    width: screenWidth,
  },
  scrollView: {
    width: screenWidth,
  },
  slidePage: {
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#0F1E36',
    borderWidth: 1.2,
    borderColor: 'rgba(226, 176, 72, 0.35)',
    // Shadow & Elevation
    elevation: 7,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  glossOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    height: 5,
    borderRadius: 2.5,
    marginHorizontal: 3,
  },
  activeDot: {
    width: 22,
    backgroundColor: '#E2B048',
  },
  inactiveDot: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
});