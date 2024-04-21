import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../styles/global';

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  image: any; // Supports require() or string for Django
}

export default function EventCard({ event }: { event?: Event }) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  // Return null if event is undefined or null
  if (!event) {
    console.warn('EventCard received undefined event prop');
    return null;
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(animation, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const detailsHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80], // Reduced height due to fewer details
  });

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.card}
        onPress={toggleExpand}
        accessible
        accessibilityLabel={`Toggle details for ${event.title || 'event'}`}
        accessibilityRole="button"
      >
        <View style={styles.imageContainer}>
          <Image
            source={
              typeof event.image === 'string'
                ? { uri: event.image }
                : event.image || require('../../assets/images/3.jpg')
            }
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent']}
            style={styles.imageGradient}
          />
        </View>
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{event.title || 'Untitled Event'}</Text>
            <Text style={styles.subtext}>
              <Ionicons name="location-outline" size={14} color={Colors.textGray} />{' '}
              {event.location || 'Unknown Location'}
            </Text>
            <Text style={styles.subtext}>
              <Ionicons name="calendar-outline" size={14} color={Colors.textGray} />{' '}
              {event.date || 'TBD'}
            </Text>
          </View>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={Colors.primary}
            style={styles.expandIcon}
          />
        </View>
      </TouchableOpacity>
      <Animated.View style={[styles.details, { height: detailsHeight }]}>
        {isExpanded && (
          <View style={styles.detailsContent}>
            <Text style={styles.detailText}>
              <Ionicons name="information-circle-outline" size={14} color={Colors.textGray} />{' '}
              {event.description || 'No description available'}
            </Text>
          
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 15,
    backgroundColor: Colors.white,
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 4,
  },
  subtext: {
    fontSize: 13,
    color: Colors.textGray,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandIcon: {
    marginLeft: 8,
  },
  details: {
    backgroundColor: Colors.card,
    overflow: 'hidden',
  },
  detailsContent: {
    padding: 12,
  },
  detailText: {
    fontSize: 13,
    color: Colors.textGray,
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsButton: {
    marginTop: 12,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  viewDetailsText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});