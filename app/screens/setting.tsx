import React, { useContext, useEffect } from 'react';
import { 
  View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView, LayoutAnimation, UIManager, Platform 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';
import { useRouter } from 'expo-router';
import { ThemeContext, LanguageContext, AccessibilityContext } from '../context/SettingContext';
import GoBackButton from '../components/GoBackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const SettingsScreen = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const { 
    textSize, setTextSize, 
    highContrast, setHighContrast, 
    textToSpeech, setTextToSpeech 
  } = useContext(AccessibilityContext);
  const router = useRouter();

  const [isAccessibilityCollapsed, setIsAccessibilityCollapsed] = React.useState(true);

  const toggleTheme = async () => {
    Haptics.selectionAsync();
    const newTheme = theme === 'Light' ? 'Dark' : 'Light';
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  const toggleLanguage = async () => {
    Haptics.selectionAsync();
    const newLang = language === 'en' ? 'am' : 'en';
    setLanguage(newLang);
    await AsyncStorage.setItem('language', newLang);
  };

  const toggleHighContrast = async () => {
    Haptics.selectionAsync();
    setHighContrast(!highContrast);
    await AsyncStorage.setItem('highContrast', JSON.stringify(!highContrast));
  };

  const toggleTextToSpeech = async () => {
    Haptics.selectionAsync();
    setTextToSpeech(!textToSpeech);
    await AsyncStorage.setItem('textToSpeech', JSON.stringify(!textToSpeech));
  };

  const toggleAccessibility = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsAccessibilityCollapsed(!isAccessibilityCollapsed);
  };

  const resetAccessibility = async () => {
    setTextSize(16);
    setHighContrast(false);
    setTextToSpeech(false);
    await AsyncStorage.multiRemove(['textSize', 'highContrast', 'textToSpeech']);
  };

  const translations = {
    en: {
      settings: 'Settings', theme: 'Theme', language: 'Language', accessibility: 'Accessibility',
      textSize: 'Text Size', highContrast: 'High Contrast', textToSpeech: 'Text to Speech',
      light: 'Light', dark: 'Dark', english: 'English', amharic: 'Amharic',
      enlarge: 'Enlarge Text', enable: 'Enable', disable: 'Disable', signIn: 'Sign In', reset: 'Reset Accessibility'
    },
    am: {
      settings: 'ቅንብሮች', theme: 'ገጽታ', language: 'ቋንቋ', accessibility: 'ተገቢነት',
      textSize: 'የጽሑፍ መጠን', highContrast: 'ከፍተኛ መልክ', textToSpeech: 'ጽሑፍ ወደ ድምፅ',
      light: 'ቀላል', dark: 'ጨለማ', english: 'እንግሊዝኛ', amharic: 'አማርኛ',
      enlarge: 'ጨምር ጽሑፍ', enable: 'አንቃ', disable: 'ተግባር', signIn: 'ግባ', reset: 'ተገቢነትን ወደ መነሻ መልስ'
    },
  };

  const t = (key) => translations[language][key];

  return (
    <View style={[styles.container, { backgroundColor: theme === 'Dark' ? '#1A1A1A' : '#F5F5F5' }]}>      
      <View style={styles.header}>
        <GoBackButton />
        <Text style={[styles.title, { fontSize: textSize, color: highContrast ? '#FFFFFF' : theme === 'Dark' ? '#E0E0E0' : '#333333' }]}>
          {t('settings')}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <TouchableOpacity style={styles.row} onPress={toggleTheme} accessibilityLabel={t('theme')}>
            <MaterialIcons 
              name={theme === 'Dark' ? 'dark-mode' : 'light-mode'} 
              size={24} 
              color={theme === 'Dark' ? '#BB86FC' : 'orange'} 
            />
            <Text style={[styles.text, { fontSize: textSize, color: highContrast ? '#FFFFFF' : theme === 'Dark' ? '#E0E0E0' : '#333333' }]}>
              {t('theme')} ({t(theme.toLowerCase())})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.row} onPress={toggleLanguage} accessibilityLabel={t('language')}>
            <MaterialIcons name="language" size={24} color={theme === 'Dark' ? '#BB86FC' : '#6200EE'} />
            <Text style={[styles.text, { fontSize: textSize, color: highContrast ? '#FFFFFF' : theme === 'Dark' ? '#E0E0E0' : '#333333' }]}>
              {t('language')} ({t(language === 'en' ? 'english' : 'amharic')})
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.section} onPress={toggleAccessibility} accessibilityLabel={t('accessibility')}>
          <View style={styles.row}>
            <MaterialIcons name="accessibility" size={24} color={theme === 'Dark' ? '#BB86FC' : '#6200EE'} />
            <Text style={[styles.text, { fontSize: textSize, color: highContrast ? '#FFFFFF' : theme === 'Dark' ? '#E0E0E0' : '#333333' }]}>
              {t('accessibility')}
            </Text>
            <MaterialIcons 
              name={isAccessibilityCollapsed ? 'expand-more' : 'expand-less'} 
              size={24} 
              color={theme === 'Dark' ? '#BB86FC' : '#6200EE'} 
            />
          </View>
        </TouchableOpacity>

        <Collapsible collapsed={isAccessibilityCollapsed}>
          <View style={styles.collapsible}>
            <View style={styles.row}>
              <MaterialIcons name="format-size" size={24} color={theme === 'Dark' ? '#BB86FC' : '#6200EE'} />
              <Text style={[styles.text, { fontSize: textSize }]}>{t('textSize')} ({textSize}px)</Text>
              <TouchableOpacity onPress={() => setTextSize(prev => Math.min(prev + 2, 24))}><MaterialIcons name="add" size={24} /></TouchableOpacity>
              <TouchableOpacity onPress={() => setTextSize(prev => Math.max(prev - 2, 14))}><MaterialIcons name="remove" size={24} /></TouchableOpacity>
            </View>

            <View style={styles.row}>
              <MaterialIcons name="invert-colors" size={24} color={theme === 'Dark' ? '#BB86FC' : '#6200EE'} />
              <Text style={[styles.text, { fontSize: textSize }]}>{t('highContrast')}</Text>
              <Switch value={highContrast} onValueChange={toggleHighContrast} />
            </View>

            <View style={styles.row}>
              <MaterialIcons name="hearing" size={24} color={theme === 'Dark' ? '#BB86FC' : '#6200EE'} />
              <Text style={[styles.text, { fontSize: textSize }]}>{t('textToSpeech')} ({t(textToSpeech ? 'enable' : 'disable')})</Text>
              <Switch value={textToSpeech} onValueChange={toggleTextToSpeech} />
            </View>

            <TouchableOpacity onPress={resetAccessibility}>
              <Text style={{ color: theme === 'Dark' ? '#BB86FC' : '#6200EE', marginTop: 10 }}>{t('reset')}</Text>
            </TouchableOpacity>
          </View>
        </Collapsible>
      </ScrollView>

      <TouchableOpacity 
        style={[
          styles.signInButton,
          { backgroundColor: theme === 'Dark' ? '#BB86FC' : '#6200EE' }
        ]}
        onPress={() => router.push('/screens/auth')}
      >
        <Text style={[styles.signInText, { fontSize: textSize }]}>{t('signIn')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 60,
    marginHorizontal: 10,
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  text: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  collapsible: {
    paddingLeft: 40,
    paddingTop: 10,
  },
  signInButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  signInText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default SettingsScreen;
