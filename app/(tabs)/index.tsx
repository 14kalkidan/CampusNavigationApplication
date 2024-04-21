import React, { useState } from 'react';
import { View, ScrollView, ImageBackground, StyleSheet, SafeAreaView } from 'react-native';
import TopNav from '../components/TopNav';
import CategoryScroll from '../components/CategoryScroll';
import EventCard from '../components/EventCard';
import SectionHeader from '../components/SectionHeader';
import SearchBar from '../components/SearchBar';
import { Colors, GlobalStyles } from '../styles/global'; // Remove useColors import
import { useAuth } from '../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const mockEvents = [
  {
    id: '1',
    title: 'Campus Movie Night',
    location: 'Blue Carpet Auditorium',
    date: 'June 5 - 7:00 PM',
    description: 'Enjoy a classic movie under the stars with free popcorn!',
    image: require('../../assets/images/2.jpg'),
  },
  {
    id: '2',
    title: 'Coding Hackathon',
    location: 'Lab Building 3',
    date: 'June 10 - 10:00 AM',
    description: 'Compete in teams to build innovative apps in 24 hours.',
    image: require('../../assets/images/1.jpg'),
  },
];

const styles = StyleSheet.create({
  heroContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heroSection: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  heroImage: {
    borderRadius: 20,
  },
  scrollContent: {
    paddingBottom: 80,
  },
});

export default function Home() {
  const { user } = useAuth();
  const isSignedIn = !!user;
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}> {/* Use Colors directly */}
      <TopNav isSignedIn={isSignedIn} />
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.heroContainer}>
          <ImageBackground
            source={require('../../assets/images/2.jpg')}
            imageStyle={styles.heroImage}
            style={styles.heroSection}
          >
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search events..."
            />
          </ImageBackground>
        </View>

        <CategoryScroll />

        <SectionHeader title="Upcoming Events" />
        {mockEvents
          .filter((event) => event != null && event.title != null)
          .map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}