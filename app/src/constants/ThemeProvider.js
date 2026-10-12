import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, NativeModules } from 'react-native';
import { darkTheme, lightTheme } from './Colors.constant';

const ThemeContext = createContext();

let tt = 'dark';

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(lightTheme);
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);

  useEffect(() => {
    findOldTheme();
  }, [{ children }]);

  const findOldTheme = async () => {
    const themeMode = await AsyncStorage.getItem('themeMode');
    console.log('themeMode', themeMode);
    tt = themeMode;
    if (themeMode !== null) {
      themeMode === 'light' ? setTheme(lightTheme) : setTheme(darkTheme);
      setIsLoadingTheme(false);
    }
    setIsLoadingTheme(false);
  };

  const updateTheme = (currentThemeMode) => {
    // if (type != 'root') {
    //   NativeModules.DevSettings.reload();
    // }
    tt = currentThemeMode;
    console.log(currentThemeMode,);
    const newTheme = currentThemeMode === 'dark' ? darkTheme : lightTheme;
    setTheme(newTheme);
    console.log(newTheme.themeMode, '------');
    AsyncStorage.setItem('themeMode', newTheme.themeMode);
    currentTheme();
  };

  return (
    <ThemeContext.Provider value={{ theme, isLoadingTheme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
export const useTheme = () => useContext(ThemeContext);

export const currentTheme =() => {
  // const themeMode = await AsyncStorage.getItem('themeMode');
  let theme = tt === 'light' ? darkTheme :lightTheme;
  return theme;
};

export default ThemeProvider;
