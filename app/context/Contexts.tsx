import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import * as i18n from 'i18n-js';

// Translation files
const translations = {
  en: {
    profile: 'Profile',
    language: 'Language',
    darkMode: 'Dark Mode',
    accessibilitySettings: 'Accessibility Settings',
    feedback: 'Feedback',
    uploadImage: 'Upload Image',
    signOut: 'Sign Out',
    changeProfilePicture: 'Change Profile Picture',
    chooseFromGallery: 'Choose from Gallery',
    cancel: 'Cancel',
    joined: 'Joined: January 2024',
    invalidName: 'Invalid Name',
    invalidNameMessage: 'Please enter a valid name',
    permissionRequired: 'Permission required',
    photoLibraryAccess: 'Please enable photo library access in settings',
    error: 'Error',
    failedToSelectImage: 'Failed to select image',
    failedToUploadImage: 'Failed to upload image',
    failedToSaveSettings: 'Failed to load settings. Using defaults.',
  },
  am: {
    profile: 'መገለጫ',
    language: 'ቋንቋ',
    darkMode: 'ጨለማ ሁነታ',
    accessibilitySettings: 'ተደራሽነት ቅንብሮች',
    feedback: 'አስተያየት',
    uploadImage: 'ምስል ስቀል',
    signOut: 'ውጣ',
    changeProfilePicture: 'የመገለጫ ምስል ቀይር',
    chooseFromGallery: 'ከጋለሪ ምረጥ',
    cancel: 'ይሰርዙ',
    joined: 'ተቀላቅሏል: ጃንዋሪ 2024',
    invalidName: 'የማይሰራ ስም',
    invalidNameMessage: 'እባክዎ ተገቢ ስም ያስገቡ',
    permissionRequired: 'ፍቃድ ያስፈልጋል',
    photoLibraryAccess: 'እባክዎ በቅንብሮች ውስጥ የፎቶ ቤተ-መጽሐፍት መዳረሻን ያንቁ',
    error: 'ስህተት',
    failedToSelectImage: 'ምስል መምረጥ አልተሳካም',
    failedToUploadImage: 'ምስል መስቀል አልተሳካም',
    failedToSaveSettings: 'ቅንብሮችን መጫን አልተሳካም። ነባሪዎችን በመጠቀም ላይ።',
  },
};

// Initialize i18n
i18n.translations = translations;
i18n.fallbacks = true;

type UserContextType = {
  name: string;
  profileImage: string | null;
  updateName: (name: string) => void;
  updateProfileImage: (uri: string | null, uploadToDjango?: boolean) => void;
};

type ThemeContextType = {
  theme: 'Light' | 'Dark';
  setTheme: (theme: 'Light' | 'Dark') => void;
};

type LanguageContextType = {
  language: 'en' | 'am';
  setLanguage: (language: 'en' | 'am') => void;
  t: (key: string) => string;
};

export const UserContext = createContext<UserContextType>({
  name: 'User',
  profileImage: null,
  updateName: () => {},
  updateProfileImage: () => {},
});

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'Light',
  setTheme: () => {},
});

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [name, setName] = useState<string>('User');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [theme, setTheme] = useState<'Light' | 'Dark'>('Light');
  const [language, setLanguage] = useState<'en' | 'am'>('en');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedName = await AsyncStorage.getItem('username');
        if (savedName) setName(savedName);

        const savedImage = await AsyncStorage.getItem('profileImage');
        if (savedImage) setProfileImage(savedImage);

        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme === 'Light' || savedTheme === 'Dark') setTheme(savedTheme);

        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage === 'en' || savedLanguage === 'am') {
          setLanguage(savedLanguage);
          i18n.locale = savedLanguage;
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        Alert.alert(i18n.t('error'), i18n.t('failedToSaveSettings'));
      }
    };

    loadSettings();
  }, []);

  const updateName = async (newName: string) => {
    const trimmedName = newName.trim();
    if (!trimmedName) {
      Alert.alert(i18n.t('invalidName'), i18n.t('invalidNameMessage'));
      setName('User');
      await AsyncStorage.setItem('username', 'User');
      return;
    }
    setName(trimmedName);
    try {
      await AsyncStorage.setItem('username', trimmedName);
    } catch (error) {
      console.error('Error saving name:', error);
      Alert.alert(i18n.t('error'), 'Failed to save name');
    }
  };

  const updateProfileImage = async (uri: string | null, uploadToDjango: boolean = false) => {
    if (uploadToDjango && uri) {
      try {
        const formData = new FormData();
        formData.append('image', {
          uri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        } as any);

        const response = await fetch('http://your-django-api.com/upload-profile-image', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const imageUrl = data.url; // Assume Django returns { url: 'https://...' }
        setProfileImage(imageUrl);
        try {
          await AsyncStorage.setItem('profileImage', imageUrl);
        } catch (error) {
          console.error('Error saving profile image URL:', error);
          Alert.alert(i18n.t('error'), i18n.t('failedToUploadImage'));
        }
      } catch (error) {
        console.error('Image upload error:', error);
        Alert.alert(i18n.t('error'), i18n.t('failedToUploadImage'));
        setProfileImage(null);
        await AsyncStorage.removeItem('profileImage');
      }
    } else {
      setProfileImage(uri);
      try {
        if (uri) {
          await AsyncStorage.setItem('profileImage', uri);
        } else {
          await AsyncStorage.removeItem('profileImage');
        }
      } catch (error) {
        console.error('Error saving profile image:', error);
        Alert.alert(i18n.t('error'), i18n.t('failedToUploadImage'));
      }
    }
  };

  const handleSetTheme = async (newTheme: 'Light' | 'Dark') => {
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
      Alert.alert(i18n.t('error'), 'Failed to save theme');
    }
  };

  const handleSetLanguage = async (newLanguage: 'en' | 'am') => {
    setLanguage(newLanguage);
    i18n.locale = newLanguage;
    try {
      await AsyncStorage.setItem('language', newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
      Alert.alert(i18n.t('error'), 'Failed to save language');
    }
  };

  return (
    <UserContext.Provider value={{ name, profileImage, updateName, updateProfileImage }}>
      <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: i18n.t }}>
          {children}
        </LanguageContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
};