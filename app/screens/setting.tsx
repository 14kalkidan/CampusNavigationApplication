import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../styles/global';
import { LanguageContext, ThemeContext } from '../context/SettingContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'am', name: 'አማርኛ' },

];

const themes = ['Light', 'Dark'];

export default function SettingsScreen() {
  const router = useRouter();
  const { language, setLanguage } = useContext(LanguageContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  const handleLanguageSelect = async (code: string) => {
    try {
      await AsyncStorage.setItem('language', code);
      setLanguage(code);
      setLanguageModalVisible(false);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const handleThemeSelect = async (selectedTheme: string) => {
    try {
      await AsyncStorage.setItem('theme', selectedTheme);
      setTheme(selectedTheme);
      setThemeModalVisible(false);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme === 'Dark' ? '#1C2526' : Colors.white }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push('../(tabs)')}
          style={styles.backButton}
          accessible
          accessibilityLabel="Go back to home"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={theme === 'Dark' ? Colors.white : Colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme === 'Dark' ? Colors.white : Colors.text }]}>Settings</Text>
      </View>

      <View style={styles.settingsList}>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => setLanguageModalVisible(true)}
          accessible
          accessibilityLabel="Change language"
        >
          <Text style={[styles.settingText, { color: theme === 'Dark' ? Colors.white : Colors.text }]}>
            Language: {languages.find((lang) => lang.code === language)?.name || 'English'}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.orange} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => setThemeModalVisible(true)}
          accessible
          accessibilityLabel="Change theme"
        >
          <Text style={[styles.settingText, { color: theme === 'Dark' ? Colors.white : Colors.text }]}>
            Theme: {theme}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.orange} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => router.push('./accessibility')}
          accessible
          accessibilityLabel="Accessibility settings"
        >
          <Text style={[styles.settingText, { color: theme === 'Dark' ? Colors.white : Colors.text }]}>
            Accessibility
          </Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.orange} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => router.push('./auth')}
          accessible
          accessibilityLabel="Sign up"
        >
          <Text style={[styles.settingText, { color: theme === 'Dark' ? Colors.white : Colors.text }]}>
            Sign Up
          </Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.orange} />
        </TouchableOpacity>
      </View>

      {/* Language Modal */}
      <Modal
        visible={languageModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme === 'Dark' ? '#2C3E50' : Colors.white }]}>
            <Text style={[styles.modalTitle, { color: theme === 'Dark' ? Colors.white : Colors.text }]}>
              Select Language
            </Text>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={styles.modalItem}
                onPress={() => handleLanguageSelect(lang.code)}
                accessible
                accessibilityLabel={`Select ${lang.name}`}
              >
                <Text style={[styles.modalItemText, { color: theme === 'Dark' ? Colors.white : Colors.text }]}>
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setLanguageModalVisible(false)}
              accessible
              accessibilityLabel="Close language modal"
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Theme Modal */}
      <Modal
        visible={themeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme === 'Dark' ? '#2C3E50' : Colors.white }]}>
            <Text style={[styles.modalTitle, { color: theme === 'Dark' ? Colors.white : Colors.text }]}>
              Select Theme
            </Text>
            {themes.map((themeOption) => (
              <TouchableOpacity
                key={themeOption}
                style={styles.modalItem}
                onPress={() => handleThemeSelect(themeOption)}
                accessible
                accessibilityLabel={`Select ${themeOption} theme`}
              >
                <Text style={[styles.modalItemText, { color: theme === 'Dark' ? Colors.white : Colors.text }]}>
                  {themeOption}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setThemeModalVisible(false)}
              accessible
              accessibilityLabel="Close theme modal"
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  settingsList: {
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalItemText: {
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 8,
  },
  modalCloseText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});