// app/_layout.tsx
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider } from './context/SettingContext';
import { AuthProvider } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AuthProvider>
          <AccessibilityProvider>
            <Slot />
          </AccessibilityProvider>
        </AuthProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
