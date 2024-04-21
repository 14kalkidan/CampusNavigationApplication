import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#364CB4',
        tabBarInactiveTintColor: '#95B8EE',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
  name="search"  // ✅ Matches search.tsx
  options={{ 
    title: 'Search',  // Add a title or keep empty
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="search-outline" size={size} color={color} />
    ),
  }}
/>
  
      
      
      <Tabs.Screen
        name="event"
        options={{
          title: 'Event',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Gallery',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="image-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}