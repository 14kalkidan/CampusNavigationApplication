import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors } from '../styles/global';

interface SettingsItemProps {
  title: string;
  value: string;
  icon: string;
  onPress: () => void;
  theme: string;
  accessibilityLabel: string;
}

export default function SettingsItem({ title, value, icon, onPress, theme, accessibilityLabel }: SettingsItemProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View style={[styles.card, animatedStyle, { backgroundColor: theme === 'Dark' ? '#2C3E50' : '#F5F7FA' }]}>
      <TouchableOpacity
        style={styles.item}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessible
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name={icon}
            size={24}
            color={theme === 'Dark' ? Colors.orange : Colors.primary}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme === 'Dark' ? Colors.white : Colors.textDark }]}>
            {title}
          </Text>
          {value ? (
            <Text style={[styles.value, { color: theme === 'Dark' ? Colors.secondary : Colors.secondary }]}>
              {value}
            </Text>
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.orange} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(77, 144, 254, 0.1)', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    marginTop: 4,
  },
});