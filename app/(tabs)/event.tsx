import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import TopNav from '../components/TopNav';
import SearchBar from '../components/SearchBar';
import EventCard from '../components/EventCard';
import { Colors } from '../styles/global'; // Removed useColors import
import { mockEvents } from './index';

const eventsData = {
  upcoming: mockEvents,
  ongoing: [
    {
      id: '3',
      title: 'Ongoing Event 1',
      location: 'Blue Carpet',
      date: 'Today, 4 PM',
      description: 'An ongoing event with live performances.',
      image: require('../../assets/images/3.jpg'),
    },
  ],
  completed: [
    {
      id: '4',
      title: 'Completed Event 1',
      location: 'Library',
      date: 'May 10',
      description: 'A past event in the library.',
      image: require('../../assets/images/4.jpg'),
    },
    {
      id: '5',
      title: 'Completed Event 2',
      location: 'Sports Ground',
      date: 'May 15',
      description: 'A past sports event.',
      image: require('../../assets/images/5.jpg'),
    },
  ],
};

export default function EventScreen() {
  const { user } = useAuth();
  const isSignedIn = !!user;
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'ongoing' | 'completed'>('upcoming');

  const renderEvents = () => {
    const list = eventsData[selectedTab];
    if (list.length === 0) {
      return <Text style={[styles.noEvents, { color: Colors.secondary }]}>No events found.</Text>;
    }

    return list.map((event) => <EventCard key={event.id} event={event} />);
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <TopNav isSignedIn={isSignedIn} />
      <SearchBar />

      <View style={[styles.tabsContainer, { backgroundColor: Colors.white }]}>
        {['upcoming', 'ongoing', 'completed'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab as any)}
            style={[
              styles.tabButton,
              { 
                borderColor: Colors.primary, 
                backgroundColor: Colors.background 
              },
              selectedTab === tab && { backgroundColor: Colors.primary },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: Colors.primary },
                selectedTab === tab && { color: Colors.white },
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
        {renderEvents()}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 6,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  tabText: {
    fontWeight: '600',
    fontSize: 14,
  },
  eventsList: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  noEvents: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});