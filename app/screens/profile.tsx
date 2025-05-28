import React, { useContext, useEffect, useState } from 'react';
import { 
  View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView, LayoutAnimation, 
  UIManager, Platform, Image, TextInput, Alert 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';
import { useRouter } from 'expo-router';
import { ThemeContext, LanguageContext, AccessibilityContext } from '../context/SettingContext';
import GoBackButton from '../components/GoBackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';

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

  const [isAccessibilityCollapsed, setIsAccessibilityCollapsed] = useState(true);
  const [username, setUsername] = useState('Guest');
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedImage = await AsyncStorage.getItem('profileImage');
        
        if (storedUsername) setUsername(storedUsername);
        if (storedImage) setProfileImage(storedImage);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, []);

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

  const startEditing = () => {
    setTempUsername(username);
    setIsEditing(true);
  };

  const saveUsername = async () => {
    if (tempUsername.trim() === '') {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }
    
    setUsername(tempUsername);
    setIsEditing(false);
    await AsyncStorage.setItem('username', tempUsername);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your photos to change your profile picture');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      await AsyncStorage.setItem('profileImage', result.assets[0].uri);
    }
  };

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('userToken'); 
    router.replace('./landing'); 
  };

  const translations = {
    en: {
      settings: 'Settings', theme: 'Theme', language: 'Language', accessibility: 'Accessibility',
      textSize: 'Text Size', highContrast: 'High Contrast', textToSpeech: 'Text to Speech',
      light: 'Light', dark: 'Dark', english: 'English', amharic: 'Amharic',
      enlarge: 'Enlarge Text', enable: 'Enable', disable: 'Disable', signIn: 'Sign In', 
      reset: 'Reset Accessibility', feedback: 'Feedback', uploadImage: 'Upload Image',
      signOut: 'Sign Out', edit: 'Edit', save: 'Save', cancel: 'Cancel'
    },
    am: {
      settings: 'ቅንብሮች', theme: 'ገጽታ', language: 'ቋንቋ', accessibility: 'ተገቢነት',
      textSize: 'የጽሑፍ መጠን', highContrast: 'ከፍተኛ መልክ', textToSpeech: 'ጽሑፍ ወደ ድምፅ',
      light: 'ቀላል', dark: 'ጨለማ', english: 'እንግሊዝኛ', amharic: 'አማርኛ',
      enlarge: 'ጨምር ጽሑፍ', enable: 'አንቃ', disable: 'ተግባር', signIn: 'ግባ', 
      reset: 'ተገቢነትን ወደ መነሻ መልስ', feedback: 'ግብረመልስ', uploadImage: 'ምስል ጫን',
      signOut: 'ውጣ', edit: 'አርም', save: 'አስቀምጥ', cancel: 'ሰርዝ'
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
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={pickImage}>
            <Image 
              source={profileImage ? { uri: profileImage } : require('../../assets/images/logo.png')} 
              style={styles.profileImage}
            />
            <Text style={[styles.uploadText, { color: theme === 'Dark' ? '#BB86FC' : '#6200EE' }]}>
              {t('uploadImage')}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.usernameContainer}>
            {isEditing ? (
              <View style={styles.editContainer}>
                <TextInput
                  value={tempUsername}
                  onChangeText={setTempUsername}
                  style={[styles.usernameInput, { 
                    color: highContrast ? '#FFFFFF' : theme === 'Dark' ? '#E0E0E0' : '#333333',
                    fontSize: textSize
                  }]}
                  autoFocus
                />
                <TouchableOpacity onPress={saveUsername} style={styles.editButton}>
                  <MaterialIcons name="check" size={20} color="green" />
                </TouchableOpacity>
                <TouchableOpacity onPress={cancelEditing} style={styles.editButton}>
                  <MaterialIcons name="close" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.editContainer}>
                <Text style={[styles.usernameText, { fontSize: textSize }]}>{username}</Text>
                <TouchableOpacity onPress={startEditing} style={styles.editButton}>
                  <MaterialIcons name="edit" size={20} color={theme === 'Dark' ? '#BB86FC' : '#6200EE'} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

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
              <TouchableOpacity onPress={() => setTextSize(prev => Math.min(prev + 2, 24))}>
                <MaterialIcons name="add" size={24} color={theme === 'Dark' ? '#BB86FC' : '#6200EE'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTextSize(prev => Math.max(prev - 2, 14))}>
                <MaterialIcons name="remove" size={24} color={theme === 'Dark' ? '#BB86FC' : '#6200EE'} />
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <MaterialIcons name="invert-colors" size={24} color={theme === 'Dark' ? '#BB86FC' : '#6200EE'} />
              <Text style={[styles.text, { fontSize: textSize }]}>{t('highContrast')}</Text>
              <Switch 
                value={highContrast} 
                onValueChange={toggleHighContrast}
                thumbColor={theme === 'Dark' ? '#BB86FC' : '#6200EE'}
              />
            </View>

            <View style={styles.row}>
              <MaterialIcons name="hearing" size={24} color={theme === 'Dark' ? '#BB86FC' : '#6200EE'} />
              <Text style={[styles.text, { fontSize: textSize }]}>{t('textToSpeech')} ({t(textToSpeech ? 'enable' : 'disable')})</Text>
              <Switch 
                value={textToSpeech} 
                onValueChange={toggleTextToSpeech}
                thumbColor={theme === 'Dark' ? '#BB86FC' : '#6200EE'}
              />
            </View>

            <TouchableOpacity onPress={resetAccessibility}>
              <Text style={{ 
                color: theme === 'Dark' ? '#BB86FC' : '#6200EE', 
                marginTop: 10,
                fontSize: textSize
              }}>
                {t('reset')}
              </Text>
            </TouchableOpacity>
          </View>
        </Collapsible>

        {/* Feedback Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.row} 
            onPress={() => router.push('./feedback')}
            accessibilityLabel={t('feedback')}
          >
            <MaterialIcons name="feedback" size={24} color={theme === 'Dark' ? '#BB86FC' : '#6200EE'} />
            <Text style={[styles.text, { fontSize: textSize, color: highContrast ? '#FFFFFF' : theme === 'Dark' ? '#E0E0E0' : '#333333' }]}>
              {t('feedback')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity 
          style={[
            styles.signOutButton,
            { backgroundColor: theme === 'Dark' ? '#BB86FC' : '#6200EE' }
          ]}
          onPress={handleSignOut}
        >
          <Text style={[styles.signOutText, { fontSize: textSize }]}>{t('signOut')}</Text>
        </TouchableOpacity>
      </ScrollView>
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  uploadText: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 14,
  },
  usernameContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  usernameText: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  usernameInput: {
    borderBottomWidth: 1,
    padding: 5,
    minWidth: 150,
    textAlign: 'center',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  editButton: {
    marginLeft: 10,
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
  signOutButton: {
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  signOutText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default SettingsScreen;