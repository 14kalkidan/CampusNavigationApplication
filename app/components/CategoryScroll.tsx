import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../styles/global';

const categories = [
  { name: 'Cafe', icon: 'cafe' },
  { name: 'Library', icon: 'book' }, 
  { name: 'Office', icon: 'briefcase' },
  { name: 'Dorm', icon: 'bed'},
  { name: 'Shops', icon: 'cart' },
  { name: 'Laboratory', icon: 'flask' },
  { name: 'Classroom', icon: 'school' },
  { name: 'other', icon: 'car' },
  { name: 'Fun and games', icon: 'game-controller' },
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
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20, 
    marginRight: 10,
    width: 80, 
    height: 80, 
  },
  icon: {
    marginBottom: 4, 
  },
  text: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 12, 
    textAlign: 'center',
  },
});