import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../hooks/useTheme';

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  accessibilityHint?: string;
};

export const Button = ({ 
  title, 
  onPress, 
  disabled, 
  loading,
  accessibilityHint 
}: ButtonProps) => {
  const { colors, typography } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { 
          backgroundColor: disabled ? colors.border : colors.primary,
          opacity: disabled ? 0.5 : 1,
        }
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={[styles.text, { fontSize: typography.body.fontSize }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});