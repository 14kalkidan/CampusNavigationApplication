import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Django API endpoint for GraphHopper routing
const API_URL = 'http://your-django-api.com/route';

type Coordinate = {
  latitude: number;
  longitude: number;
};

type RouteData = {
  distance: string; // e.g., "5.2 km"
  duration: string; // e.g., "15 mins"
  points: Coordinate[]; // Array of coordinates for polyline
  instructions: string[]; // Turn-by-turn instructions
};

export default function MapScreen() {
  const [location, setLocation] = useState<Coordinate | null>(null);
  const [destination, setDestination] = useState<Coordinate | null>(null);
  const [route, setRoute] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [travelMode, setTravelMode] = useState<'car' | 'bike' | 'foot'>('car');
  const mapRef = useRef<MapView>(null);
  const router = useRouter();

  // Sample destination in Addis Ababa
  const sampleDestination = {
    latitude: 9.005401,
    longitude: 38.763611,
    name: 'Sample Destination',
    address: '123 Main St, Addis Ababa',
  };

  // Fetch user location using GPS
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied. Please enable location services.');
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch location. Please try again.');
        setLoading(false);
      }
    })();
  }, []);

  // Calculate route when destination or travel mode changes
  useEffect(() => {
    if (location && destination) {
      calculateRoute();
    }
  }, [location, destination, travelMode]);

  const calculateRoute = async () => {
    if (!location || !destination) {
      setError('Current location or destination is not available.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Call Django/GraphHopper API
      const response = await fetch(
        `${API_URL}?start=${location.latitude},${location.longitude}&end=${destination.latitude},${destination.longitude}&vehicle=${travelMode}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // Prevent hanging
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Expected GraphHopper response format (customized by your Django API)
      const data = await response.json();
      const routeData: RouteData = {
        distance: `${(data.paths[0].distance / 1000).toFixed(1)} km`, // Convert meters to km
        duration: `${Math.round(data.paths[0].time / 60000)} mins`, // Convert ms to mins
        points: data.paths[0].points.coordinates.map(([lng, lat]: [number, number]) => ({
          latitude: lat,
          longitude: lng,
        })),
        instructions: data.paths[0].instructions.map((instr: any) => instr.text),
      };

      setRoute(routeData);

      // Fit map to route
      if (routeData.points.length > 1) {
        mapRef.current?.fitToCoordinates(routeData.points, {
          edgePadding: { top: 100, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    } catch (err) {
      // Mock data for fallback (remove in production if API is reliable)
      const mockRoute: RouteData = {
        distance: travelMode === 'car' ? '5.2 km' : travelMode === 'bike' ? '5.0 km' : '4.8 km',
        duration: travelMode === 'car' ? '15 mins' : travelMode === 'bike' ? '20 mins' : '30 mins',
        points: [
          location,
          {
            latitude: (location.latitude + destination.latitude) / 2,
            longitude: (location.longitude + destination.longitude) / 2,
          },
          destination,
        ],
        instructions: [
          `Head northeast on Main St by ${travelMode}`,
          `Turn right onto Bole Rd by ${travelMode}`,
          `Destination will be on your left`,
        ],
      };
      setRoute(mockRoute);

      if (mockRoute.points.length > 1) {
        mapRef.current?.fitToCoordinates(mockRoute.points, {
          edgePadding: { top: 100, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }

      setError(`Failed to fetch route: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDestinationSelect = () => {
    setDestination(sampleDestination);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location?.latitude ?? 9.005401,
              longitude: location?.longitude ?? 38.763611,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation
            showsMyLocationButton
          >
            {destination && (
              <Marker
                coordinate={destination}
                title={sampleDestination.name}
                description={sampleDestination.address}
              />
            )}
            {route?.points?.length > 0 && (
              <Polyline
                coordinates={route.points}
                strokeColor="#3498db"
                strokeWidth={5}
              />
            )}
          </MapView>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.searchButton} onPress={handleDestinationSelect}>
              <Ionicons name="search" size={24} color="white" />
              <Text style={styles.searchText}>Use Sample Destination</Text>
            </TouchableOpacity>

            <View style={styles.modeSelector}>
              {(['car', 'bike', 'foot'] as const).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[styles.modeButton, travelMode === mode && styles.activeMode]}
                  onPress={() => setTravelMode(mode)}
                >
                  <Ionicons
                    name={mode === 'car' ? 'car-sport' : mode === 'bike' ? 'bicycle' : 'walk'}
                    size={24}
                    color={travelMode === mode ? 'white' : '#3498db'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {route && (
              <View style={styles.routeInfo}>
                <Text style={styles.routeText}>Distance: {route.distance}</Text>
                <Text style={styles.routeText}>Time: {route.duration}</Text>
                <TouchableOpacity
                  style={styles.directionsButton}
                  onPress={() =>
                    router.push({
                      pathname: '/directions',
                      params: { instructions: JSON.stringify(route.instructions) },
                    })
                  }
                >
                  <Text style={styles.directionsText}>View Turn-by-Turn</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loader: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  searchButton: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  searchText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  modeButton: {
    padding: 10,
    borderRadius: 20,
  },
  activeMode: {
    backgroundColor: '#3498db',
  },
  routeInfo: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  routeText: {
    fontSize: 16,
    marginBottom: 5,
  },
  directionsButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  directionsText: {
    color: 'white',
    textAlign: 'center',
  },
});