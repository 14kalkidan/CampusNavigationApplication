import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Appearance } from 'react-native';

type AccessibilityContextType = {
  textScale: number;
  setTextScale: (scale: number) => void;
  highContrast: boolean;
  toggleContrast: () => void;
  isScreenReaderEnabled: boolean;
  reduceMotionEnabled: boolean;
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [textScale, setTextScale] = useState(1.0); 
  const [highContrast, setHighContrast] = useState(Appearance.getColorScheme() === 'dark');
  const [isScreenReaderEnabled] = useState(false); 
  const [reduceMotionEnabled] = useState(false); 

  const value = useMemo(() => ({
    textScale,
    setTextScale: (scale: number) => setTextScale(Math.max(0.8, Math.min(scale, 1.5))), 
    highContrast,
    toggleContrast: () => setHighContrast(prev => !prev),
    isScreenReaderEnabled,
    reduceMotionEnabled
  }), [textScale, highContrast, isScreenReaderEnabled, reduceMotionEnabled]);

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};