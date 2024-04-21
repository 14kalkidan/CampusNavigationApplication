import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { useSettings } from './settings';

// 1. Define strict theme types
type ThemeName = 'Light' | 'Dark';
type ThemeColors = {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  border: string;
  [key: string]: string; // Allow additional color properties
};

// 2. Strongly typed theme definitions
const themes: Record<ThemeName, ThemeColors> = {
  Light: {
    background: '#ffffff',
    text: '#1f2937',
    primary: '#f97316',
    secondary: '#6b7280',
    border: '#d1d5db',
  },
  Dark: {
    background: '#1f2937',
    text: '#ffffff',
    primary: '#f59e0b',
    secondary: '#9ca3af',
    border: '#4b5563',
  },
};

// 3. Create styles from colors
const createThemeStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  text: {
    color: colors.text,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  // Add more style definitions as needed
});

// 4. Context type
type ThemeContextType = {
  colors: ThemeColors;
  styles: ReturnType<typeof createThemeStyles>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 5. Custom hook with better error message
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// 6. Improved ThemeProvider with validation
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useSettings();

  // Validate and normalize theme
  const normalizedTheme: ThemeName = 
    theme === 'Dark' || theme === 'Light' ? theme : 'Light';

  // Memoize theme values
  const themeValue = useMemo(() => {
    const colors = themes[normalizedTheme];
    return {
      colors,
      styles: createThemeStyles(colors),
    };
  }, [normalizedTheme]);

  console.log(`Current theme: ${normalizedTheme}`); // Debug log

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// 7. Optional: Utility hook for specific styles
export function useThemeStyles() {
  const { styles } = useTheme();
  return styles;
}

// 8. Optional: Utility hook for colors
export function useThemeColors() {
  const { colors } = useTheme();
  return colors;
}