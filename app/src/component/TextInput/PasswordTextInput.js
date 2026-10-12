import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { screenWidth } from '../../constants/Sizes.constant';

const EyeIcon = ({ secure }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    {secure ? (
      <>
        <Path
          d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2.73 16.11 1 12C1.75 10.22 2.87 8.64 4.28 7.37M9.9 4.24A9.12 9.12 0 0 1 12 4C17 4 21.27 7.89 23 12C22.27 13.73 21.18 15.28 19.82 16.54"
          stroke="#718096"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path d="M1 1L23 23" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ) : (
      <>
        <Path
          d="M1 12C2.73 7.89 7 4 12 4C17 4 21.27 7.89 23 12C21.27 16.11 17 20 12 20C7 20 2.73 16.11 1 12Z"
          stroke="#718096"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx="12" cy="12" r="3" stroke="#718096" strokeWidth="2" />
      </>
    )}
  </Svg>
);

export default function PasswordTextInput({
  label,
  placeholder,
  value,
  onChangeText,
  maxLength,
  style,
  error,
  ...props
}) {
  const [isSecure, setIsSecure] = useState(true);

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputWrapper, error ? styles.errorBorder : null]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9EA4AE"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          maxLength={maxLength}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsSecure(!isSecure)}
          style={styles.eyeBtn}
        >
          <EyeIcon secure={isSecure} />
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth - 20,
    alignSelf: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
    marginLeft: 2,
  },
  inputWrapper: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A202C',
    paddingVertical: 0,
    height: 48,
  },
  eyeBtn: {
    padding: 6,
    marginLeft: 6,
  },
  errorBorder: {
    borderColor: '#E53E3E',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
