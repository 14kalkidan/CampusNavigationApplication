import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  PanResponder,
  TextInput,
  Alert
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRoute } from '@react-navigation/native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

const API_BASE_URL = 'http://192.168.107.20:8000'; // Replace with your actual backend URL
const SEARCH_API_URL = `${API_BASE_URL}/api/places/`;
const ROUTE_API_URL = `${API_BASE_URL}/api/navigation/`;

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [vehicleType, setVehicleType] = useState('foot');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [destination, setDestination] = useState(null);

  // Initialize with route params if available
  const route = useRoute();
  useEffect(() => {
    if (route.params?.place) {
      const { latitude, longitude, name, description, image } = route.params.place;
      setDestination({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        name: name || 'Selected Location',
        description: description || '',
        image: image || null
      });
    }
  }, [route.params]);

  // Fetch and track user location
  useEffect(() => {
    let locationSubscription;
    
    (async () => {
      // Request permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        setLoading(false);
        return;
      }

      // Get current position
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      
      const { latitude, longitude } = currentLocation.coords;
      setLocation(currentLocation.coords);
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      setLoading(false);

      // Subscribe to location updates
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10, // Update every 10 meters
        },
        (newLocation) => {
          setLocation(newLocation.coords);
        }
      );
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // Fetch route when destination or vehicle changes
  useEffect(() => {
    if (location && destination) {
      fetchRoute();
    }
  }, [destination, vehicleType]);

  const fetchRoute = async () => {
    try {
      setLoading(true);
      const start = `${location.latitude},${location.longitude}`;
      const end = `${destination.latitude},${destination.longitude}`;
      
      const response = await fetch(
        `${ROUTE_API_URL}?start=${start}&end=${end}&vehicle=${vehicleType}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (!data.points) {
        throw new Error("No route points returned");
      }

      // Convert [lon,lat] to [lat,lon] for MapView
      const coords = data.points.map(point => ({
        latitude: point[1],
        longitude: point[0]
      }));

      setRouteCoords(coords);
      setDistance(data.distance_km);
      setDuration(data.time_minutes);
      
      // Update map view to show both locations
      if (location && destination) {
        setRegion({
          latitude: (location.latitude + destination.latitude) / 2,
          longitude: (location.longitude + destination.longitude) / 2,
          latitudeDelta: Math.abs(location.latitude - destination.latitude) * 1.5,
          longitudeDelta: Math.abs(location.longitude - destination.longitude) * 1.5,
        });
      }
      
    } catch (error) {
      console.error('Routing error:', error);
      Alert.alert('Error', 'Could not fetch route. Showing straight line.');
      if (location && destination) {
        setRouteCoords([
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: destination.latitude, longitude: destination.longitude }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setShowResults(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${SEARCH_API_URL}?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const results = await response.json();
      setSearchResults(results);
      setShowResults(true);
      
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectPlace = (place) => {
    setDestination({
      latitude: parseFloat(place.latitude),
      longitude: parseFloat(place.longitude),
      name: place.name,
      description: place.description || '',
      image: place.image || null
    });
    setShowResults(false);
    setSearchQuery(place.name);
  };

  const handleRouteRefresh = () => {
    if (location && destination) {
      fetchRoute();
    }
  };

  const [panelHeight] = useState(new Animated.Value(height * 0.15));

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 20,
    onPanResponderMove: (_, gestureState) => {
      const newHeight = height * 0.45 - gestureState.dy;
      panelHeight.setValue(Math.max(height * 0.15, Math.min(newHeight, height * 0.45)));
    },
    onPanResponderRelease: (_, gestureState) => {
      Animated.timing(panelHeight, {
        toValue: gestureState.dy > 50 ? height * 0.15 : height * 0.45,
        duration: 200,
        useNativeDriver: false,
      }).start();
    },
  });

  if (loading && !location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {region ? (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation
          showsMyLocationButton
          followsUserLocation
          loadingEnabled
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Your Location"
              pinColor="blue"
            />
          )}
          
          {destination && (
            <Marker
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
              title={destination.name}
            />
          )}
          
          {routeCoords.length > 0 && (
            <Polyline
              coordinates={routeCoords}
              strokeColor="#007aff"
              strokeWidth={4}
            />
          )}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search for places..."
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          onFocus={() => setShowResults(false)}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <FontAwesome5 name="search" size={16} color="#fff" />
        </TouchableOpacity>
        
        {showResults && searchResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <ScrollView style={styles.resultsList}>
              {searchResults.map((result, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.resultItem}
                  onPress={() => selectPlace(result)}
                >
                  <Text style={styles.resultText}>{result.name}</Text>
                  {result.description && (
                    <Text style={styles.resultDescription}>{result.description}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Vehicle Selector */}
      <View style={styles.selector}>
        {['foot', 'bike', 'car'].map((type) => (
          <TouchableOpacity 
            key={type} 
            onPress={() => setVehicleType(type)}
            style={[
              styles.vehicleButton,
              vehicleType === type && styles.selectedVehicle
            ]}
          >
            <FontAwesome5
              name={type === 'foot' ? 'walking' : type === 'bike' ? 'bicycle' : 'car'}
              size={22}
              color={vehicleType === type ? '#fff' : '#aaa'}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Route Info */}
      {distance && duration && (
        <View style={styles.routeInfo}>
          <Text style={styles.routeText}>Distance: {distance} km</Text>
          <Text style={styles.routeText}>Time: {duration} mins</Text>
        </View>
      )}

      {/* Bottom Panel */}
      {destination && (
        <Animated.View style={[styles.bottomPanel, { height: panelHeight }]} {...panResponder.panHandlers}>
          <View style={styles.panelHandle} />
          <ScrollView>
            <View style={styles.imageTextRow}>
              {destination.image ? (
                <Image source={{ uri: destination.image }} style={styles.infoImage} />
              ) : (
                <View style={[styles.infoImage, styles.noImage]}>
                  <FontAwesome5 name="map-marker-alt" size={40} color="#007aff" />
                </View>
              )}
              <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={styles.title}>{destination.name}</Text>
                {destination.description && (
                  <Text style={styles.description}>{destination.description}</Text>
                )}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.iconRow}>
              <TouchableOpacity style={styles.iconBtn} onPress={handleRouteRefresh}>
                <MaterialIcons name="directions" size={24} color="#007aff" />
                <Text style={styles.iconText}>Route</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => Alert.alert('Save', 'Feature coming soon!')}>
                <MaterialIcons name="bookmark-border" size={24} color="#007aff" />
                <Text style={styles.iconText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => Alert.alert('Share', 'Feature coming soon!')}>
                <MaterialIcons name="share" size={24} color="#007aff" />
                <Text style={styles.iconText}>Share</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#333',
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  searchInput: {
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    backgroundColor: '#007aff',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 10,
    marginTop: 5,
    maxHeight: 200,
    elevation: 3,
  },
  resultsList: {
    padding: 10,
  },
  resultItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
  resultDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingVertical: 8,
    borderRadius: 12,
    elevation: 3,
    marginHorizontal: 60,
  },
  vehicleButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  selectedVehicle: {
    backgroundColor: '#007aff',
  },
  routeInfo: {
    position: 'absolute',
    bottom: 160,
    left: 60,
    right: 60,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
    zIndex: 10,
  },
  routeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    elevation: 8,
  },
  panelHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 4,
    alignSelf: 'center',
    marginBottom: 10,
  },
  imageTextRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  iconBtn: {
    alignItems: 'center',
    padding: 10,
  },
  iconText: {
    fontSize: 12,
    marginTop: 2,
    color: '#007aff',
  },
});