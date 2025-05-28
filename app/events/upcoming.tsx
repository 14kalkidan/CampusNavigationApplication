import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const events = [
  {
    id: 1,
    title: 'Tech Symposium',
    location: 'Main Auditorium',
    time: 'May 15 • 2:00 PM',
    image: require('@/assets/images/c.jpeg'),
    details: {
      guests: 'Developers from Brana Software Solutions',
      food: 'Bring your own. Drinks provided (water only)',
      bring: 'Your laptop',
      avoid: 'Low self-esteem or expectations of free food',
    },
  },
  {
    id: 2,
    title: 'Campus Tour',
    location: 'Admissions Office',
    time: 'May 16 • 10:00 AM',
    image: require('@/assets/images/f.jpeg'),
    details: {
      guests: 'Local Bands & Choir',
      food: 'Snacks at entrance',
      bring: 'Your voice',
      avoid: 'Big bags',
    },
  },
  {
    id: 3,
    title: 'Pajama Night',
    location: 'Student Gallery',
    time: 'May 18 • 8:00 PM',
    image: require('@/assets/images/k.jpeg'),
    details: {
      guests: 'Visual artists & designers',
      food: 'Refreshments provided',
      bring: 'Sketchbook',
      avoid: 'Loud music',
    },
  },
];

export default function UpcomingEvents() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const router = useRouter();

  const toggleDetails = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#364CB4" />
        </TouchableOpacity>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#364CB4" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Ionicons name="person-circle-outline" size={26} color="#364CB4" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Event Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => router.push('/(tabs)/event')}
        >
          <Text style={styles.tabText}>Ongoing</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => router.push('/events/completed')}
        >
          <Text style={styles.tabText}>Completed</Text>
        </TouchableOpacity>
      </View>

      {/* Page Title */}
      <Text style={styles.pageTitle}>Upcoming Events</Text>

      {/* Events List */}
      {events.map((event) => (
        <View key={event.id} style={styles.eventCard}>
          {/* Event Header */}
          <TouchableOpacity
            style={styles.eventHeader}
            onPress={() => router.push('/map')}
          >
            <Image source={event.image} style={styles.eventImage} />
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.eventMeta}>
                <Ionicons name="location-outline" size={14} color="#95B8EE" />
                <Text style={styles.eventLocation}> {event.location}</Text>
              </View>
              <View style={styles.eventMeta}>
                <Ionicons name="time-outline" size={14} color="#95B8EE" />
                <Text style={styles.eventTime}> {event.time}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Expandable Details */}
          <TouchableOpacity 
            style={styles.detailsToggle} 
            onPress={() => toggleDetails(event.id)}
          >
            <Ionicons 
              name={expandedId === event.id ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#364CB4" 
            />
          </TouchableOpacity>

          {expandedId === event.id && (
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Guests:</Text>
                <Text style={styles.detailValue}>{event.details.guests}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Food:</Text>
                <Text style={styles.detailValue}>{event.details.food}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bring:</Text>
                <Text style={styles.detailValue}>{event.details.bring}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Avoid:</Text>
                <Text style={styles.detailValue}>{event.details.avoid}</Text>
              </View>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 24,
  },
  logo: {
    width: 48,
    height: 48,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#E7F1AB',
  },
  tabText: {
    fontSize: 14,
    color: '#95B8EE',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#364CB4',
    fontWeight: '600',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#364CB4',
    marginBottom: 16,
  },
  eventCard: {
    backgroundColor: '#F8FAFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  eventHeader: {
    flexDirection: 'row',
    padding: 16,
  },
  eventImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  eventInfo: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#364CB4',
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#95B8EE',
  },
  eventTime: {
    fontSize: 14,
    color: '#95B8EE',
  },
  detailsToggle: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E7F1AB',
    alignItems: 'center',
  },
  detailsContainer: {
    padding: 16,
    paddingTop: 0,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: 80,
    fontSize: 14,
    color: '#364CB4',
    fontWeight: '600',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#95B8EE',
  },
});