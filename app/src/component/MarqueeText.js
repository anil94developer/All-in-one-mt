import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const MarqueeText = ({ text, style, duration = 10000 }) => {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!text) return;
    const scrollWidth = 400;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: -scrollWidth,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [text, duration]);

  if (!text) return null;

  return (
    <View style={[styles.container, style]} overflow="hidden">
      <Animated.View style={[styles.row, { transform: [{ translateX }] }]}>
        <Text style={styles.text}>{text}</Text>
        <Text style={[styles.text, styles.duplicate]}>{text}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 28,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 14,
    color: '#fff',
    paddingHorizontal: 8,
  },
  duplicate: {
    marginLeft: 20,
  },
});

export default MarqueeText;
