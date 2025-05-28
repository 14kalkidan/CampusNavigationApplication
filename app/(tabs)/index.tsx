import React, { useEffect, useState, useCallback } from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { fetchUpcomingEvents } from "../APIServices/eventAPI";
import CategoryScroll from "../components/CategoryScroll";
import EventCard from "../components/EventCard";
import SearchBar from "../components/SearchBar";
import SectionHeader from "../components/SectionHeader";
import TopNav from "../components/TopNav";
import { useAuth } from "../context/AuthContext";
import { Colors } from "../styles/global";
import { searchPlaces } from "../APIServices/searchAPI";
import { FontAwesome5 } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Voice from '@react-native-voice/voice';

interface Place {
  id: number;
  name: string;
  category: string;
  description?: string;
  image?: string | null;
  latitude: number;
  longitude: number;
}

export interface Event {
  id: number;
  title: string;
  location_name: string;
  coordinates: { latitude: number; longitude: number };
  start_date: string;
  end_date: string;
  description: string;
  image: string | null;
  category?: string;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function Home() {
  const { user, isSignedIn } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isVoiceAvailable, setIsVoiceAvailable] = useState(false);

  const micScale = useSharedValue(1);
  const cardScale = useSharedValue(1);

  // Initialize voice recognition
  useEffect(() => {
    const setupVoice = async () => {
      try {
        if (Voice) {
          setIsVoiceAvailable(true);
          Voice.onSpeechStart = () => {
            console.log('Speech started');
            setIsVoiceActive(true);
          };
          Voice.onSpeechEnd = () => {
            console.log('Speech ended');
            setIsVoiceActive(false);
          };
          Voice.onSpeechResults = (e: any) => {
            console.log('Speech results:', e);
            if (e.value && e.value.length > 0) {
              const query = e.value[0];
              setSearchText(query);
              handleSearch(query);
            }
            setIsVoiceActive(false);
          };
          Voice.onSpeechError = (e: any) => {
            console.error('Voice error:', e);
            Alert.alert('Voice Error', 'Failed to recognize speech. Please check microphone permissions or try again.');
            setIsVoiceActive(false);
          };
        } else {
          console.warn('Voice module not available');
          setIsVoiceAvailable(false);
        }
      } catch (error) {
        console.error('Voice setup error:', error);
        setIsVoiceAvailable(false);
      }
    };

    setupVoice();

    return () => {
      if (Voice) {
        Voice.destroy().then(Voice.removeAllListeners).catch((err) => console.error('Voice cleanup error:', err));
      }
    };
  }, []);

  // Load events
  useEffect(() => {
    const loadUpcomingEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const events = await fetchUpcomingEvents();
        setUpcomingEvents(events);
      } catch (err: any) {
        setError(err.message || "Failed to load upcoming events");
      } finally {
        setLoading(false);
      }
    };
    loadUpcomingEvents();
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setSearchText(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      let places = await searchPlaces(query);

      if (!places || places.length === 0) {
        places = await fetchGraphHopperPlaces(query);
      }

      if (places.length > 0) {
        setSearchResults(places);
      }
    } catch (error: any) {
      console.error('Search error:', error.message);
      Alert.alert('Search Error', error.message || 'Failed to fetch places.');
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const toggleVoiceSearch = async () => {
    if (!isVoiceAvailable || !Voice) {
      Alert.alert('Voice Unavailable', 'Voice recognition is not supported on this device or in Expo Go. Please use a development build.');
      return;
    }

    if (isVoiceActive) {
      try {
        await Voice.stop();
        console.log('Voice stopped');
        setIsVoiceActive(false);
      } catch (error) {
        console.error('Error stopping voice:', error);
        Alert.alert('Voice Error', 'Failed to stop voice recognition.');
      }
    } else {
      try {
        await Voice.start('en-US', { RECOGNIZER_ENGINE: 'GOOGLE', EXTRA_PARTIAL_RESULTS: true });
        console.log('Voice started');
      } catch (error) {
        console.error('Error starting voice:', error);
        Alert.alert('Voice Error', 'Failed to start voice recognition. Please check microphone permissions.');
        setIsVoiceActive(false);
      }
    }
  };

  const handlePlacePress = (place: Place) => {
    router.push({
      pathname: "/screens/map",
      params: {
        latitude: place.latitude.toString(),
        longitude: place.longitude.toString(),
        name: place.name,
        category: place.category,
        image: place.image || undefined,
      },
    });
  };

  const handleEventPress = (event: Event) => {
    router.push({
      pathname: "/screens/map",
      params: {
        latitude: event.coordinates.latitude.toString(),
        longitude: event.coordinates.longitude.toString(),
        name: event.title,
        category: event.category || 'Event',
        image: event.image || undefined,
      },
    });
  };

  const retryFetchEvents = () => {
    setLoading(true);
    setError(null);
    const loadEvents = async () => {
      try {
        const events = await fetchUpcomingEvents();
        setUpcomingEvents(events);
      } catch (err: any) {
        setError(err.message || "Failed to load upcoming events");
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  };

  const animatedMicStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micScale.value }],
  }));

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const handleMicPressIn = () => {
    micScale.value = withTiming(0.9, { duration: 100 });
  };

  const handleMicPressOut = () => {
    micScale.value = withTiming(1, { duration: 100 });
  };

  const handleCardPressIn = () => {
    cardScale.value = withTiming(0.98, { duration: 100 });
  };

  const handleCardPressOut = () => {
    cardScale.value = withTiming(1, { duration: 100 });
  };

  const filteredEvents = upcomingEvents.filter(
    (event) =>
      event.title.toLowerCase().includes(searchText.toLowerCase()) ||
      event.location_name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]}>
      <TopNav isSignedIn={isSignedIn} />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        <View style={styles.heroContainer}>
          <ImageBackground
            source={require("../../assets/images/2.jpg")}
            imageStyle={styles.heroImage}
            style={styles.heroSection}
            resizeMode="cover"
          >
            <View style={styles.searchContainer}>
              <SearchBar 
                onSearch={handleSearch} 
                placeholder="Search places or events..." 
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={styles.searchBar}
                value={searchText}
                onChangeText={setSearchText}
              />
              <AnimatedTouchable
                style={[styles.micButton, animatedMicStyle]}
                onPress={toggleVoiceSearch}
                onPressIn={handleMicPressIn}
                onPressOut={handleMicPressOut}
              >
                <FontAwesome5 
                  name="microphone" 
                  size={20} 
                  color={isVoiceActive ? '#FF6F61' : Colors.primary} 
                />
              </AnimatedTouchable>
            </View>
          </ImageBackground>
        </View>

        {searchLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        )}

        {searchResults.length > 0 && (
          <View style={styles.searchResultsContainer}>
            <SectionHeader title="Search Results" />
            {searchResults.map((place) => (
              <AnimatedTouchable
                key={place.id}
                style={[styles.placeCard, animatedCardStyle]}
                onPress={() => handlePlacePress(place)}
                onPressIn={handleCardPressIn}
                onPressOut={handleCardPressOut}
              >
                <FontAwesome5 
                  name={place.category.toLowerCase() === 'building' ? 'building' : 
                        place.category.toLowerCase() === 'park' ? 'tree' : 'map-marker-alt'} 
                  size={24} 
                  color={Colors.primary} 
                  style={styles.placeIcon}
                />
                <View style={styles.placeInfo}>
                  <Text style={styles.placeName}>{place.name}</Text>
                  <Text style={styles.placeCategory}>{place.category}</Text>
                </View>
              </AnimatedTouchable>
            ))}
          </View>
        )}

        {searchResults.length === 0 && (
          <>
            <CategoryScroll />
            <SectionHeader title="Upcoming Events" />
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading events...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={retryFetchEvents}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : filteredEvents.length === 0 ? (
              <Text style={styles.noEventsText}>No upcoming events found.</Text>
            ) : (
              filteredEvents.map((event) => (
                <AnimatedTouchable
                  key={event.id}
                  style={[styles.eventCard, animatedCardStyle]}
                  onPress={() => handleEventPress(event)}
                  onPressIn={handleCardPressIn}
                  onPressOut={handleCardPressOut}
                >
                  <EventCard
                    event={{
                      ...event,
                      date: event.start_date,
                      location: event.location_name,
                    }}
                    onLocationPress={() => handleEventPress(event)}
                  />
                </AnimatedTouchable>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  heroContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
  },
  heroSection: {
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  heroImage: {
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FF6F61',
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  micButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#7A7A7A',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: Colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  noEventsText: {
    color: '#7A7A7A',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  searchResultsContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  placeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: 'blue',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  eventCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  placeIcon: {
    marginRight: 12,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  placeCategory: {
    fontSize: 14,
    color: '#7A7A7A',
    marginTop: 4,
    textTransform: 'capitalize',
  },
});