import React, { createContext, useState, ReactNode } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('Light');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  );
};
