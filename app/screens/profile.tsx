import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { UserContext, ThemeContext, LanguageContext } from '../context/Contexts';

const Colors = {
  darkBlue: '#021024',
  deepBlue: '#052659',
  teal: '#548383',
  lightBlue: '#7DA0C4',
  paleBlue: '#C1E8FF',
  white: '#FFFFFF',
  black: '#000000',
  errorRed: '#e53935',
};

export default function ProfileScreen() {
  const { name, profileImage, updateName, updateProfileImage } = useContext(UserContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const { language, t } = useContext(LanguageContext);
  const [newName, setNewName] = useState(name);
  const [imageLoading, setImageLoading] = useState(false);
  const [nameEditing, setNameEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setNewName(name);
  }, [name]);

  const pickImage = async () => {
    try {
      setImageLoading(true);
      setModalVisible(false);

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('permissionRequired'), t('photoLibraryAccess'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        updateProfileImage(result.assets[0].uri, true); // Upload to Django
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert(t('error'), t('failedToSelectImage'));
    } finally {
      setImageLoading(false);
    }
  };

  const handleNameUpdate = () => {
    const trimmedName = newName.trim();
    if (!trimmedName) {
      Alert.alert(t('invalidName'), t('invalidNameMessage'));
      setNewName(name || 'User');
      return;
    }

    updateName(trimmedName);
    setNameEditing(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'Dark' ? 'Light' : 'Dark';
    Alert.alert(
      t('darkMode'),
      `Switch to ${newTheme} mode?`,
      [
        { text: t('cancel'), style: 'cancel' },
        { text: 'Confirm', onPress: () => setTheme(newTheme) },
      ]
    );
  };

  const handleLanguageChange = (lang: 'en' | 'am') => {
    setLanguage(lang);
  };

  const handleSignOut = () => {
    Alert.alert(
      t('signOut'),
      'Are you sure you want to sign out?',
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('signOut'), onPress: () => router.push('./landing') },
      ]
    );
  };

  const dynamicStyles = {
    container: {
      backgroundColor: theme === 'Dark' ? Colors.darkBlue : Colors.white,
    },
    text: {
      color: theme === 'Dark' ? Colors.white : Colors.black,
    },
    card: {
      backgroundColor: theme === 'Dark' ? Colors.deepBlue : Colors.paleBlue,
    },
  };

  return (
    <ScrollView
      style={[styles.container, dynamicStyles.container]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme === 'Dark' ? Colors.white : Colors.black}
          />
        </TouchableOpacity>
        <Text style={[styles.title, dynamicStyles.text]}>{t('profile')}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Profile Section */}
      <View style={[styles.profileCard, dynamicStyles.card]}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          {imageLoading ? (
            <ActivityIndicator size="large" color={Colors.teal} />
          ) : (
            <>
              <Image
                source={profileImage ? { uri: profileImage } : require('../../assets/images/1.jpg')}
                style={styles.avatar}
                onError={() => {
                  console.log('Image load error');
                  updateProfileImage(null);
                }}
              />
              <View style={styles.editIcon}>
                <Feather name="edit" size={18} color={Colors.white} />
              </View>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.nameContainer}>
          {nameEditing ? (
            <TextInput
              style={[styles.nameInput, dynamicStyles.text]}
              value={newName}
              onChangeText={setNewName}
              onSubmitEditing={handleNameUpdate}
              onBlur={handleNameUpdate}
              autoFocus
              maxLength={30}
            />
          ) : (
            <TouchableOpacity
              onPress={() => setNameEditing(true)}
              style={styles.nameDisplay}
            >
              <Text style={[styles.nameText, dynamicStyles.text]}>{newName}</Text>
              <Feather
                name="edit"
                size={16}
                color={theme === 'Dark' ? Colors.lightBlue : Colors.deepBlue}
              />
            </TouchableOpacity>
          )}
          <Text style={[styles.joinedText, { color: Colors.teal }]}>{t('joined')}</Text>
        </View>
      </View>

      {/* Settings Section */}
      <View style={[styles.settingsCard, dynamicStyles.card]}>
        <View style={styles.settingRow}>
          <FontAwesome5 name="language" size={20} color={Colors.teal} />
          <Text style={[styles.settingLabel, dynamicStyles.text]}>{t('language')}</Text>
          <Picker
            selectedValue={language}
            style={[styles.picker, dynamicStyles.text, { backgroundColor: theme === 'Dark' ? Colors.deepBlue : Colors.paleBlue }]}
            onValueChange={handleLanguageChange}
            dropdownIconColor={theme === 'Dark' ? Colors.white : Colors.black}
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Amharic" value="am" />
          </Picker>
        </View>

        <View style={styles.settingRow}>
          <FontAwesome5 name="adjust" size={20} color={Colors.teal} />
          <Text style={[styles.settingLabel, dynamicStyles.text]}>{t('darkMode')}</Text>
          <Switch
            value={theme === 'Dark'}
            onValueChange={toggleTheme}
            thumbColor={theme === 'Dark' ? Colors.deepBlue : Colors.lightBlue}
            trackColor={{ false: Colors.lightBlue, true: Colors.paleBlue }}
          />
        </View>
      </View>

      {/* Navigation Section */}
      <View style={[styles.navCard, dynamicStyles.card]}>
        <NavItem
          icon="accessibility"
          title={t('accessibilitySettings')}
          onPress={() => router.push('./accessibility')}
          theme={theme}
        />
        <NavItem
          icon="chatbubbles"
          title={t('feedback')}
          onPress={() => router.push('./feedback')}
          theme={theme}
        />
        <NavItem
          icon="cloud-upload"
          title={t('uploadImage')}
          onPress={() => router.push('./uploadImage')}
          theme={theme}
        />
      </View>

      {/* Sign Out */}
      <TouchableOpacity
        style={[styles.signOutButton, { borderColor: Colors.errorRed }]}
        onPress={handleSignOut}
      >
        <FontAwesome5 name="sign-out-alt" size={20} color={Colors.errorRed} />
        <Text style={[styles.signOutText, { color: Colors.errorRed }]}>{t('signOut')}</Text>
      </TouchableOpacity>

      {/* Image Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, dynamicStyles.card]}>
            <Text style={[styles.modalTitle, dynamicStyles.text]}>{t('changeProfilePicture')}</Text>
            <Pressable
              style={[styles.modalButton, { backgroundColor: Colors.teal }]}
              onPress={pickImage}
            >
              <Text style={styles.modalButtonText}>{t('chooseFromGallery')}</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, { backgroundColor: Colors.deepBlue }]}
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

type NavItemProps = {
  icon: string;
  title: string;
  onPress: () => void;
  theme: 'Light' | 'Dark';
};

const NavItem = ({ icon, title, onPress, theme }: NavItemProps) => (
  <TouchableOpacity onPress={onPress} style={styles.navItem}>
    <Ionicons
      name={icon}
      size={22}
      color={theme === 'Dark' ? Colors.lightBlue : Colors.deepBlue}
    />
    <Text
      style={[
        styles.navItemText,
        { color: theme === 'Dark' ? Colors.white : Colors.black },
      ]}
    >
      {title}
    </Text>
    <Ionicons
      name="chevron-forward"
      size={18}
      color={theme === 'Dark' ? Colors.lightBlue : Colors.deepBlue}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileCard: {
    borderRadius: 12,
    padding: 20,
    margin: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.lightBlue,
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: Colors.teal,
    borderRadius: 15,
    padding: 5,
  },
  nameContainer: {
    flex: 1,
    marginLeft: 20,
  },
  nameDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '600',
    marginRight: 8,
  },
  nameInput: {
    fontSize: 20,
    fontWeight: '600',
    borderBottomWidth: 1,
    borderBottomColor: Colors.teal,
    paddingVertical: 4,
    width: '100%',
  },
  joinedText: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingsCard: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  picker: {
    width: 120,
    height: 40,
  },
  navCard: {
    borderRadius: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  navItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    width: '100%',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 6,
  },
  modalButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});