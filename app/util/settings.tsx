import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsContextType {
  language: string;
  setLanguage: (lang: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en'); // Default to English
  const [theme, setTheme] = useState('Light'); // Default to Light

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedLanguage) setLanguage(savedLanguage);
        if (savedTheme) {
          if (savedTheme === 'Light' || savedTheme === 'Dark') {
            setTheme(savedTheme);
          } else {
            setTheme('Light'); // Default to Light if invalid
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  const value = { language, setLanguage, theme, setTheme };
  console.log('Settings Context Value Provided:', value); // Debug log

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  console.log('Settings Context Value Used:', context); // Debug log
  return context;
}