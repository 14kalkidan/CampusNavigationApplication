import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../styles/global';

const categories = [
  { name: 'Cafe', icon: 'cafe' },
  { name: 'Library', icon: 'book' },
  { name: 'Office', icon: 'briefcase' },
  { name: 'Shops', icon: 'cart' },
  { name: 'Laboratory', icon: 'flask' },
  { name: 'Classrooms', icon: 'school' },
  { name: 'Parking', icon: 'car' },
  { name: 'Games', icon: 'game-controller' },
];

export default function CategoryScroll() {
  const router = useRouter();

  return (
    <View style={{ marginTop: 20 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={styles.categoryPill}
            onPress={() => router.push(`/screens/${category.name.toLowerCase()}`)}
            accessible
            accessibilityLabel={`Go to ${category.name}`}
            accessibilityRole="button"
          >
            <Ionicons name={category.icon} size={24} color={Colors.white} style={styles.icon} />
            <Text style={styles.text}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  categoryPill: {
    flexDirection: 'column', // Stack icon and text vertically
    alignItems: 'center', // Center items horizontally
    justifyContent: 'center', // Center items vertically
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20, // Slightly smaller radius for compact look
    marginRight: 10,
    width: 80, // Fixed width for consistency
    height: 80, // Fixed height to accommodate stacked layout
  },
  icon: {
    marginBottom: 4, // Space between icon and text
  },
  text: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 12, // Smaller font for compact layout
    textAlign: 'center',
  },
});