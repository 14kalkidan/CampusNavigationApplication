import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../styles/global';

interface SettingsModalProps {
  visible: boolean;
  title: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  onClose: () => void;
  theme: string;
}

export default function SettingsModal({ visible, title, options, onSelect, onClose, theme }: SettingsModalProps) {
  const renderItem = ({ item }: { item: { label: string; value: string } }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        Haptics.selectionAsync();
        onSelect(item.value);
      }}
      accessible
      accessibilityLabel={`Select ${item.label}`}
      accessibilityRole="button"
    >
      <Text style={[styles.modalItemText, { color: theme === 'Dark' ? Colors.white : Colors.textDark }]}>
        {item.label}
      </Text>
      <Ionicons
        name="checkmark-circle"
        size={24}
        color={theme === 'Dark' ? Colors.orange : Colors.primary}
        style={styles.checkIcon}
      />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        Haptics.selectionAsync();
        onClose();
      }}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient
          colors={theme === 'Dark' ? ['#2C3E50', '#1C2526'] : ['#F5F7FA', '#E8ECEF']}
          style={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme === 'Dark' ? Colors.white : Colors.textDark }]}>
              {title}
            </Text>
            <TouchableOpacity
              onPress={() => {
                Haptics.selectionAsync();
                onClose();
              }}
              accessible
              accessibilityLabel={`Close ${title.toLowerCase()} modal`}
              accessibilityRole="button"
            >
              <Ionicons
                name="close"
                size={24}
                color={theme === 'Dark' ? Colors.orange : Colors.primary}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={options}
            renderItem={renderItem}
            keyExtractor={(item) => item.value}
            style={styles.modalList}
          />
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '50%',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalList: {
    flexGrow: 0,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  checkIcon: {
    opacity: 0.7,
  },
});