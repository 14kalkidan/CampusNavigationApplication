import React, { createContext, useState } from 'react';
export const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('Light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export const LanguageContext = createContext();
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
export const AccessibilityContext = createContext();
export const AccessibilityProvider = ({ children }) => {
  const [textSize, setTextSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(false);

  return (
    <AccessibilityContext.Provider value={{
      textSize,
      setTextSize,
      highContrast,
      setHighContrast,
      textToSpeech,
      setTextToSpeech,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const SettingsProvider = ({ children }) => (
  <ThemeProvider>
    <LanguageProvider>
      <AccessibilityProvider>
        {children}
      </AccessibilityProvider>
    </LanguageProvider>
  </ThemeProvider>
);
