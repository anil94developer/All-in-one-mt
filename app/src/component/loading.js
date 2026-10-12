import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

function Loading(props) {
  return (
    <View style={ls.loadingContainer}>
      <ActivityIndicator
        color="#00D09C"
        size={46}
      />
    </View>
  );
}

const ls = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    zIndex: 9999,
  },
});

export default Loading;

