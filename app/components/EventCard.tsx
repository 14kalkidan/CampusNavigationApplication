import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Event } from '../APIServices/eventAPI';
import { Colors } from '../styles/global';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

const COLLAPSED_HEIGHT = 130;
const EXPANDED_HEIGHT = 400;

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  const toggleCollapse = () => {
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: isCollapsed ? 1 : 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
      Animated.timing(contentOpacity, {
        toValue: isCollapsed ? 1 : 0,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();

    setIsCollapsed(!isCollapsed);
  };

  const handleLocationPress = () => {
    if (event.coordinates) {
      router.push({
        pathname: '/screens/Search',
        params: {
          lat: event.coordinates.latitude.toString(),
          lng: event.coordinates.longitude.toString(),
        },
      });
    }
  };

  const cardHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLLAPSED_HEIGHT, EXPANDED_HEIGHT],
  });

  return (
    <Animated.View style={[styles.card, { height: cardHeight }]}>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleCollapse}>
        <MaterialIcons
          name={isCollapsed ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color="#666"
        />
      </TouchableOpacity>

      {event.image && <Image source={{ uri: event.image }} style={styles.image} />}

      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>

        <TouchableOpacity onPress={handleLocationPress}>
          <Text style={styles.location}>
            <MaterialIcons name="place" size={14} color={Colors.primary} /> {event.location_name}
          </Text>
        </TouchableOpacity>

        <Text style={styles.date}>
          <MaterialIcons name="calendar-today" size={14} color={Colors.secondary} />{' '}
          {new Date(event.start_date).toLocaleDateString()} -{' '}
          {new Date(event.end_date).toLocaleDateString()}
        </Text>

        {!isCollapsed && (
          <Animated.View style={{ opacity: contentOpacity }}>
            <ScrollView style={styles.extraContent}>
              {event.description && (
                <Text style={styles.description}>{event.description}</Text>
              )}
              {event.category && (
                <Text style={styles.category}>
                  <FontAwesome5 name="tag" size={13} /> Category: {event.category}
                </Text>
              )}

              <TouchableOpacity onPress={onPress} style={styles.button}>
                <Text style={styles.buttonText}>More Info</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
  },
  toggleButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: 4,
  },
  image: {
    width: '100%',
    height: 100,
  },
  content: {
    padding: 12,
    paddingTop: 30,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 4,
    textDecorationLine: 'underline',
  },
  date: {
    fontSize: 13,
    color: Colors.secondary,
    marginBottom: 6,
  },
  extraContent: {
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 6,
  },
  category: {
    fontSize: 13,
    color: Colors.secondary,
    marginBottom: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EventCard;
