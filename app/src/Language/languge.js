import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import hi from './hi.json';
import ar from './ar.json';
import sp from './sp.json';
import purtuguese from './purtuguese.json';

import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
  en: {
    translation: en,
  },
  hi: {
    translation: hi,
  },
  gu: {
    translation: hi, // fallback to hi base if specific json not present
  },
  mr: {
    translation: hi,
  },
  kn: {
    translation: hi,
  },
  ml: {
    translation: hi,
  },
  purtuguese: {
    translation: purtuguese,
  },
  sp: {
    translation: sp,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'hi',
  fallbackLng: 'en',
  compatibilityJSON: 'v3',
  interpolation: {
    escapeValue: false,
  },
});

// Load saved language on init
AsyncStorage.getItem('appLanguage').then((saved) => {
  if (saved) {
    i18n.changeLanguage(saved);
  }
}).catch(() => {});

const langague_change = async (value) => {
  await AsyncStorage.setItem('appLanguage', value);
  await AsyncStorage.setItem('language', value);
  i18n.changeLanguage(value);
};



const lang = (value) => {
  const { t } = useTranslation();
  return t(value);
}
export { lang, langague_change };
