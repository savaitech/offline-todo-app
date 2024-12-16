import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './en.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'en', // Default language
  lng: 'en', // Current language
  resources: {
    en: { translation: en },
      },
  interpolation: {
    escapeValue: false, // React already handles escaping
  },
});

export default i18n;
