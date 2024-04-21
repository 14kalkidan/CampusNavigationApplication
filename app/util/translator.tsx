import React, { useMemo } from 'react';
import { useSettings } from './settings';

interface Translation {
  [key: string]: {
    [lang: string]: string;
  };
}

const translations: Translation = {
  welcome: {
    en: 'Welcome',
    am: 'እንኳን ደህና መጡ',
  },
  signIn: {
    en: 'Sign In',
    am: 'ግባ',
  },
  signUp: {
    en: 'Sign Up',
    am: 'ይመዝገቡ',
  },
  email: {
    en: 'Email',
    am: 'ኢሜይል',
  },
  password: {
    en: 'Password',
    am: 'የይለፍ ቃል',
  },
  forgotPassword: {
    en: 'Forgot Password?',
    am: 'የይለፍ ቃል ረስተዋል?',
  },
  settings: {
    en: 'Settings',
    am: 'ቅንብሮች',
  },
  language: {
    en: 'Language',
    am: 'ቋንቋ',
  },
  theme: {
    en: 'Theme',
    am: 'ገጽታ',
  },
  save: {
    en: 'Save',
    am: 'አስቀምጥ',
  },
  cancel: {
    en: 'Cancel',
    am: 'ሰርዝ',
  },
};

export function useTranslator() {
  const { language } = useSettings();

  console.log('Translator Language Value:', language); // Debug log

  const t = useMemo(() => {
    return (key: string, fallback?: string): string => {
      return translations[key]?.[language] || fallback || key;
    };
  }, [language]);

  return { t };
}

export function Translate({ children, key: translationKey, fallback }: { children?: string; key: string; fallback?: string }) {
  const { t } = useTranslator();
  return <>{t(translationKey, fallback) || children}</>;
}