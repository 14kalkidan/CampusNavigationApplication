// app/accessibility.tsx
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext } from 'react';
import { ThemeContext } from '../context/Contexts';
const Colors = { darkBlue: '#021024', white: '#FFFFFF' };
export default function AccessibilityScreen() {
  const { theme } = useContext(ThemeContext);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme === 'Dark' ? Colors.darkBlue : Colors.white }}>
      <Text style={{ color: theme === 'Dark' ? Colors.white : Colors.black }}>Accessibility Settings</Text>
    </SafeAreaView>
  );
}