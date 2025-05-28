import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchOngoingEvents, fetchUpcomingEvents, fetchCompletedEvents, Event } from '../APIServices/eventAPI';
import EventCard from '../components/EventCard';
import TopNav from '../components/TopNav';
import GoBackButton from '../components/GoBackButton';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../styles/global';

const { width } = Dimensions.get('window');

export default function EventScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const isSignedIn = !!user;
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'ongoing' | 'completed'>('upcoming');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async (tab: 'upcoming' | 'ongoing' | 'completed') => {
    setLoading(true);
    setError(null);
    try {
      let fetchedEvents: Event[] = [];
      if (tab === 'upcoming') {
        fetchedEvents = await fetchUpcomingEvents();
      } else if (tab === 'ongoing') {
        fetchedEvents = await fetchOngoingEvents();
      } else {
        fetchedEvents = await fetchCompletedEvents();
      }
      setEvents(fetchedEvents);
    } catch (err: any) {
      setError(err.message || `Failed to load ${tab} events`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log({ fetchUpcomingEvents, fetchOngoingEvents, fetchCompletedEvents }); // Debug imports
    fetchEvents(selectedTab);
  }, [selectedTab]);

  const handleLocationPress = (coordinates: { latitude: number; longitude: number }) => {
    console.log('Location pressed:', coordinates); // Placeholder for map navigation
  };

  const handleEventPress = (event: Event) => {
    router.push({
      pathname: '/search',
      params: {
        latitude: event.latitude,
        longitude: event.longitude,
        name: event.name,
        category: event.category || 'Event',
        image: event.image || null, // Pass image if available, else null
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <TopNav isSignedIn={isSignedIn} />
      <View style={styles.header}>
        <GoBackButton />
        <Text style={styles.sectionTitle}>
          {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Events
        </Text>
      </View>

      <View style={[styles.tabsContainer, { backgroundColor: Colors.white }]}>
        {['upcoming', 'ongoing', 'completed'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab as 'upcoming' | 'ongoing' | 'completed')}
            style={[
              styles.tabButton,
              { borderColor: Colors.primary, backgroundColor: Colors.background },
              selectedTab === tab && {
                backgroundColor: Colors.primary,
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 6,
              },
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

      <ScrollView
        style={styles.eventsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.eventsContainer}
      >
        {loading ? (
          <Text style={[styles.noEvents, { color: Colors.secondary }]}>Loading events...</Text>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.noEvents, { color: Colors.error }]}>{error}</Text>
            <TouchableOpacity onPress={() => fetchEvents(selectedTab)} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : events.length === 0 ? (
          <Text style={[styles.noEvents, { color: Colors.secondary }]}>
            No {selectedTab} events found.
          </Text>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onLocationPress={handleLocationPress}
              onPress={() => handleEventPress(event)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  sectionTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  eventsList: {
    flex: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  eventsContainer: {
    paddingBottom: 30,
  },
  noEvents: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    width: width - 40,
    alignSelf: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
});