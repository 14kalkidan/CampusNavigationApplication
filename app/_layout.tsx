import { Stack } from 'expo-router';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingContext'; 

export default function RootLayout() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="screens/[id]" />
          <Stack.Screen name="search" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="accessibility" />
          <Stack.Screen name="auth" />
        </Stack>
      </AuthProvider>
    </SettingsProvider>
  );
}
