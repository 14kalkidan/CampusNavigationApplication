import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Updated Color palette (same as HomeScreen)
const colors = {
  darkBlue: '#021024',
  deepBlue: '#052659',
  teal: '#548383',
  lightBlue: '#7DA0C4',
  paleBlue: '#C1E8FF',
  white: '#FFFFFF',
  black: '#000000',
};

export default function ProfileScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('Totally Spies');
  const [avatar, setAvatar] = useState(require('../../assets/images/404.jpg'));
  const [modalVisible, setModalVisible] = useState(false);

  // Load saved settings when the app starts
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedDarkMode = await AsyncStorage.getItem('darkMode');
        const savedLanguage = await AsyncStorage.getItem('language');
        const savedUsername = await AsyncStorage.getItem('username');
        
        if (savedDarkMode !== null) setIsDarkMode(savedDarkMode === 'true');
        if (savedLanguage !== null) {
          setLanguage(savedLanguage);
          i18n.changeLanguage(savedLanguage);
        }
        if (savedUsername !== null) setNewUsername(savedUsername);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  // Save settings when they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem('darkMode', isDarkMode.toString());
        await AsyncStorage.setItem('language', language);
        await AsyncStorage.setItem('username', newUsername);
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    };
    
    saveSettings();
  }, [isDarkMode, language, newUsername]);

  const handleSignOut = () => {
    Alert.alert(
      t('confirmSignOut'),
      t('areYouSureSignOut'),
      [
        {
          text: t('cancel'),
          style: "cancel",
        },
        {
          text: t('yes'),
          onPress: () => {
            router.push('/Authentication/signin');
          },
        },
      ]
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar({ uri: result.assets[0].uri });
      // Here you would upload to your Django backend
      // For now we just save it locally
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would send the new username to your backend
  };

  return (
    <ScrollView style={[styles.container, { 
      backgroundColor: isDarkMode ? colors.darkBlue : colors.white 
    }]}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={20} color={isDarkMode ? colors.white : colors.darkBlue} />
        </TouchableOpacity>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
        <View style={{ width: 20 }} /> {/* Spacer for alignment */}
      </View>

      <Text style={[styles.title, { color: isDarkMode ? colors.white : colors.darkBlue }]}>
        {t('profile')}
      </Text>

      {/* Profile Info */}
      <View style={styles.profileRow}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={avatar}
            style={styles.avatar}
          />
          {isEditing && (
            <View style={styles.editIconOverlay}>
              <Feather name="edit" size={20} color={colors.white} />
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.infoColumn}>
          {isEditing ? (
            <TextInput
              style={[styles.nameInput, { color: isDarkMode ? colors.white : colors.darkBlue }]}
              value={newUsername}
              onChangeText={setNewUsername}
              autoFocus
            />
          ) : (
            <Text style={[styles.name, { color: isDarkMode ? colors.white : colors.darkBlue }]}>
              {newUsername}
            </Text>
          )}
          <Text style={[styles.joined, { color: colors.teal }]}>
            {t('joined')}: Jan 2024
          </Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            <Feather 
              name={isEditing ? "check" : "edit"} 
              size={20} 
              color={isDarkMode ? colors.lightBlue : colors.deepBlue} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.settingsContainer}>
        {/* Language Selector */}
        <View style={styles.settingRow}>
          <FontAwesome5 name="language" size={20} color={isDarkMode ? colors.lightBlue : colors.deepBlue} />
          <Text style={[styles.settingText, { color: isDarkMode ? colors.white : colors.darkBlue }]}>
            {t('language')}
          </Text>
          <Picker
            selectedValue={language}
            style={[styles.picker, { 
              color: isDarkMode ? colors.white : colors.darkBlue,
              backgroundColor: isDarkMode ? colors.deepBlue : colors.paleBlue,
            }]}
            onValueChange={handleLanguageChange}
            dropdownIconColor={isDarkMode ? colors.white : colors.deepBlue}
          >
            <Picker.Item label={t('english')} value="en" />
            <Picker.Item label={t('amharic')} value="am" />
          </Picker>
        </View>

        {/* Theme Toggle */}
        <View style={styles.settingRow}>
          <FontAwesome5 name="adjust" size={20} color={isDarkMode ? colors.lightBlue : colors.deepBlue} />
          <Text style={[styles.settingText, { color: isDarkMode ? colors.white : colors.darkBlue }]}>
            {t('darkMode')}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            thumbColor={isDarkMode ? colors.deepBlue : colors.lightBlue}
            trackColor={{ false: colors.lightBlue, true: colors.paleBlue }}
          />
        </View>

        {/* Links */}
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => router.push('/profile/accessibility')}
        >
          <FontAwesome5 name="eye" size={20} color={isDarkMode ? colors.lightBlue : colors.deepBlue} />
          <Text style={[styles.linkText, { color: isDarkMode ? colors.white : colors.darkBlue }]}>
            {t('accessibility')}
          </Text>
          <FontAwesome5 name="chevron-right" size={14} color={colors.teal} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => router.push('/profile/feedback')}
        >
          <FontAwesome5 name="comment-alt" size={20} color={isDarkMode ? colors.lightBlue : colors.deepBlue} />
          <Text style={[styles.linkText, { color: isDarkMode ? colors.white : colors.darkBlue }]}>
            {t('feedback')}
          </Text>
          <FontAwesome5 name="chevron-right" size={14} color={colors.teal} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => router.push('/profile/upload')}
        >
          <FontAwesome5 name="cloud-upload-alt" size={20} color={isDarkMode ? colors.lightBlue : colors.deepBlue} />
          <Text style={[styles.linkText, { color: isDarkMode ? colors.white : colors.darkBlue }]}>
            {t('uploadImage')}
          </Text>
          <FontAwesome5 name="chevron-right" size={14} color={colors.teal} />
        </TouchableOpacity>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[styles.linkRow, { marginTop: 20 }]}
          onPress={handleSignOut}
        >
          <FontAwesome5 name="sign-out-alt" size={20} color="#e53935" />
          <Text style={[styles.linkText, { color: '#e53935' }]}>{t('signOut')}</Text>
        </TouchableOpacity>
      </View>

      {/* Image Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: isDarkMode ? colors.deepBlue : colors.white }]}>
            <Text style={[styles.modalText, { color: isDarkMode ? colors.white : colors.black }]}>
              {t('changeProfilePicture')}
            </Text>
            <Pressable
              style={[styles.modalButton, { backgroundColor: colors.teal }]}
              onPress={pickImage}
            >
              <Text style={styles.modalButtonText}>{t('chooseFromGallery')}</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, { backgroundColor: colors.deepBlue }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>{t('cancel')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    alignSelf: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 16,
    paddingHorizontal: 20,
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.paleBlue,
  },
  editIconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.deepBlue,
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoColumn: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  nameInput: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.teal,
    paddingVertical: 4,
  },
  joined: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  editButton: {
    alignSelf: 'flex-start',
    padding: 4,
  },
  settingsContainer: {
    paddingHorizontal: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  picker: {
    width: 120,
    height: 30,
    borderRadius: 5,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.paleBlue,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButton: {
    borderRadius: 10,
    padding: 12,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});