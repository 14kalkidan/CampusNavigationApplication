import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Tts from 'react-native-tts';
import { fetchRoute } from '../APIServices/routeAPI';
import { searchPlaces } from '../APIServices/searchAPI';
import GoBackButton from '../components/GoBackButton';
import PlaceCard from '../components/PlaceCard';
import SearchBar from '../components/SearchBar';

const { width, height } = Dimensions.get('window');

const AASTU_REGION = {
  latitude: 9.0315,
  longitude: 38.7632,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

// Rerouting constants
const REROUTE_DISTANCE_THRESHOLD = 20; // meters
const REROUTE_DEBOUNCE_TIME = 2000; // ms
const MAX_REROUTE_ATTEMPTS = 3;

interface Place {
  id: number;
  name: string;
  category: string;
  description?: string;
  image?: string | null;
  latitude: number;
  longitude: number;
}

interface Instruction {
  text: string;
  distance: number;
  time: number;
}

interface Route {
  coords: { latitude: number; longitude: number }[];
  distance: number;
  duration: number;
  instructions: Instruction[];
}

export default function MapScreen({ navigation }) {
  const mapRef = useRef<MapView>(null);
  const { latitude, longitude, name, category, image } = useLocalSearchParams();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [route, setRoute] = useState<Route | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [travelMode, setTravelMode] = useState<'foot' | 'bike' | 'car'>('foot');
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const [loading, setLoading] = useState(false);
  const [lastRerouteLocation, setLastRerouteLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [rerouteAttempts, setRerouteAttempts] = useState(0);
  const rerouteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [ttsInitialized, setTtsInitialized] = useState(false);

  // Initialize TTS
  useEffect(() => {
    const initTts = async () => {
      try {
        await Tts.getInitStatus(); // Check if TTS is ready
        await Tts.setDefaultLanguage('en-US');
        await Tts.setDefaultRate(0.5);
        await Tts.setDefaultPitch(1.0);
        setTtsInitialized(true);
        console.log('TTS initialized successfully');
        // Test TTS
        Tts.speak('TTS initialized').catch((error) => console.error('TTS test error:', error));
      } catch (error) {
        console.error('TTS initialization error:', error);
        Alert.alert('TTS Error', 'Failed to initialize text-to-speech. Please check device settings.');
      }
    };

    initTts();

    return () => {
      Tts.stop();
    };
  }, []);

  // Speak instructions when route changes and TTS is initialized
  useEffect(() => {
    if (ttsInitialized && route?.instructions?.length > 0) {
      console.log('Preparing to speak instructions:', route.instructions);
      route.instructions.forEach((instruction, index) => {
        if (instruction.text && typeof instruction.text === 'string') {
          setTimeout(() => {
            console.log(`Speaking instruction ${index + 1}: ${instruction.text}`);
            Tts.speak(`${index + 1}. ${instruction.text}`).catch((error) =>
              console.error('TTS speak error:', error)
            );
          }, index * 2500); // Increased delay for clarity
        }
      });
    }
  }, [route, ttsInitialized]);

  useEffect(() => {
    if (latitude && longitude && name && category) {
      const place: Place = {
        id: Date.now(),
        name: name as string,
        category: category as string,
        latitude: parseFloat(latitude as string),
        longitude: parseFloat(longitude as string),
        description: '',
        image: image as string | null,
      };
      setSelectedPlace(place);
      calculateRoute(place);
    }
  }, [latitude, longitude, name, category, image]);

  const getLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(coords);
      setLastRerouteLocation(coords);

      const subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
          timeInterval: 5000,
        },
        (newLocation) => {
          setLocation(newLocation.coords);
          checkForReroute(newLocation.coords);
        }
      );

      return () => {
        if (subscriber) subscriber.remove();
      };
    } catch (error: any) {
      console.error('Location error:', error.message);
      Alert.alert('Error', 'Failed to get location.');
    }
  }, [checkForReroute]);

  const checkForReroute = useCallback(
    (newLocation: { latitude: number; longitude: number }) => {
      if (!selectedPlace || !lastRerouteLocation) return;

      const distance = calculateDistance(
        lastRerouteLocation.latitude,
        lastRerouteLocation.longitude,
        newLocation.latitude,
        newLocation.longitude
      );

      if (distance > REROUTE_DISTANCE_THRESHOLD) {
        if (rerouteTimerRef.current) {
          clearTimeout(rerouteTimerRef.current);
        }

        rerouteTimerRef.current = setTimeout(() => {
          calculateRoute(selectedPlace, true);
          setLastRerouteLocation(newLocation);
          setRerouteAttempts(0);
        }, REROUTE_DEBOUNCE_TIME);
      }
    },
    [selectedPlace, lastRerouteLocation, calculateRoute]
  );

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const calculateRoute = useCallback(
    async (destination: Place, isReroute = false) => {
      if (!location) {
        Alert.alert('Error', 'Current location not available.');
        return;
      }

      if (isReroute && rerouteAttempts >= MAX_REROUTE_ATTEMPTS) {
        console.log('Max reroute attempts reached');
        return;
      }

      try {
        setLoading(true);
        const start = `${location.latitude},${location.longitude}`;
        const end = `${destination.latitude},${destination.longitude}`;
        const response = await fetchRoute(start, end, travelMode);
        console.log('fetchRoute Response:', JSON.stringify(response, null, 2));

        const coords = response.points.map(([lon, lat]: [number, number]) => ({
          latitude: parseFloat(lat.toString()),
          longitude: parseFloat(lon.toString()),
        }));

        const instructions: Instruction[] = response.instructions
          ? response.instructions.map((instr: any) => ({
              text: instr.text || '',
              distance: instr.distance || 0,
              time: instr.time || 0,
            }))
          : [];

        console.log('Processed Instructions:', instructions);

        setRoute({
          coords,
          distance: response.distance_km * 1000,
          duration: response.time_minutes * 60,
          instructions,
        });

        if (isReroute) {
          setRerouteAttempts((prev) => prev + 1);
        }

        const allCoords = [
          { latitude: location.latitude, longitude: location.longitude },
          ...coords,
        ];

        mapRef.current?.fitToCoordinates(allCoords, {
          edgePadding: { top: height * 0.3, right: width * 0.1, bottom: height * 0.3, left: width * 0.1 },
          animated: true,
        });
      } catch (error: any) {
        console.error('Routing error:', error.message);
        if (isReroute) {
          console.log('Reroute failed:', error.message);
        } else {
          Alert.alert('Routing Error', error.message || 'Failed to calculate route.');
        }
      } finally {
        setLoading(false);
      }
    },
    [location, travelMode, rerouteAttempts]
  );

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSelectedPlace(null);
      setRoute(null);
      setLastRerouteLocation(null);
      setRerouteAttempts(0);
      return;
    }

    try {
      setLoading(true);
      const places = await searchPlaces(query);

      if (places.length > 0 && places[0].latitude && places[0].longitude) {
        setSelectedPlace(places[0]);
        setRoute(null);
        setLastRerouteLocation(null);
        setRerouteAttempts(0);

        mapRef.current?.animateToRegion(
          {
            latitude: places[0].latitude,
            longitude: places[0].longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          500
        );
      } else {
        Alert.alert('Not Found', 'No matching place found.');
      }
    } catch (error: any) {
      console.error('Search error:', error.message);
      Alert.alert('Search Error', error.message || 'Failed to fetch place.');
    } finally {
      setLoading(false);
    }
  }, []);

  const zoomToLocation = () => {
    if (location) {
      mapRef.current?.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        500
      );
    } else {
      Alert.alert('Error', 'Current location not available.');
    }
  };

  const toggleMapType = () => {
    setMapType((prev) => (prev === 'standard' ? 'satellite' : 'standard'));
  };

  useEffect(() => {
    getLocation();

    return () => {
      if (rerouteTimerRef.current) {
        clearTimeout(rerouteTimerRef.current);
      }
    };
  }, [getLocation]);

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, searchFocused && styles.searchFocused]}>
        <GoBackButton style={styles.backButton} navigation={navigation} />
        <SearchBar
          onSearch={handleSearch}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={styles.searchBar}
        />
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={AASTU_REGION}
        mapType={mapType}
        showsUserLocation
        showsMyLocationButton
        showsBuildings
        zoomEnabled
        zoomTapEnabled
        minZoomLevel={10}
        maxZoomLevel={20}
        showsTraffic={Platform.OS === 'android'}
      >
        {selectedPlace && (
          <Marker
            coordinate={{ latitude: selectedPlace.latitude, longitude: selectedPlace.longitude }}
            title={selectedPlace.name}
            description={selectedPlace.category}
            pinColor="#DB4437"
          />
        )}
        {route?.coords && (
          <Polyline
            coordinates={route.coords}
            strokeColor="#4D90FE"
            strokeWidth={5}
            lineDashPattern={travelMode === 'foot' ? [10, 10] : undefined}
          />
        )}
      </MapView>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.locationButton} onPress={zoomToLocation}>
          <MaterialIcons name="my-location" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.mapTypeButton} onPress={toggleMapType}>
          <MaterialIcons
            name={mapType === 'standard' ? 'satellite' : 'map'}
            size={24}
            color="#000"
          />
        </TouchableOpacity>

        <View style={styles.modeSelectorColumn}>
          {['foot', 'bike', 'car'].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[styles.modeButton, travelMode === mode && styles.activeMode]}
              onPress={() => {
                setTravelMode(mode as 'foot' | 'bike' | 'car');
                if (selectedPlace) {
                  setLastRerouteLocation(location);
                  calculateRoute(selectedPlace);
                }
              }}
            >
              <FontAwesome5
                name={mode === 'foot' ? 'walking' : mode === 'bike' ? 'bicycle' : 'car'}
                size={18}
                color={travelMode === mode ? '#fff' : '#000'}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {selectedPlace && (
        <PlaceCard
          place={selectedPlace}
          onNavigate={() => {
            setLastRerouteLocation(location);
            calculateRoute(selectedPlace);
          }}
          distance={route?.distance}
          duration={route?.duration}
          instructions={route?.instructions}
        />
      )}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4D90FE" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 15,
    right: 15,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  searchFocused: {
    top: Platform.OS === 'ios' ? 40 : 20,
  },
  backButton: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    right: 15,
    bottom: 150,
    zIndex: 10,
    alignItems: 'center',
  },
  locationButton: {
    backgroundColor: 'white',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 10,
  },
  mapTypeButton: {
    backgroundColor: 'white',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 10,
  },
  modeSelectorColumn: {
    backgroundColor: 'white',
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  modeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  activeMode: {
    backgroundColor: '#4D90FE',
    borderRadius: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  loadingText: {
    marginTop: 10,
    color: '#333',
  },
});