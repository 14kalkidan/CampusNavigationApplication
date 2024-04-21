import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as Location from 'expo-location';

type Coordinate = {
  latitude: number;
  longitude: number;
};

type Route = {
  points: Coordinate[];
  distance: string;
  duration: string;
  instructions: string[];
};

type MapContextType = {
  currentLocation: Coordinate | null;
  destination: Coordinate | null;
  route: Route | null;
  travelMode: 'car' | 'bike' | 'foot';
  loading: boolean;
  error: string | null;
  setDestination: (coord: Coordinate | null) => void;
  setTravelMode: (mode: 'car' | 'bike' | 'foot') => void;
  calculateRoute: () => Promise<void>;
  refreshLocation: () => Promise<void>;
};

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);
  const [destination, setDestination] = useState<Coordinate | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [travelMode, setTravelMode] = useState<'car' | 'bike' | 'foot'>('car');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial location
  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    } catch (err) {
      setError('Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  // Refresh location manually
  const refreshLocation = async () => {
    setLoading(true);
    await getLocation();
    if (destination) await calculateRoute();
  };

  // Calculate route between points
  const calculateRoute = async () => {
    if (!currentLocation || !destination) return;
    
    setLoading(true);
    try {
      /* TODO: Replace with your Django API call
      const response = await fetch(`YOUR_API/route?start=${currentLocation.latitude},${currentLocation.longitude}&end=${destination.latitude},${destination.longitude}&mode=${travelMode}`);
      const data = await response.json();
      setRoute(data);
      */

      // Mock response - DELETE when using real API
      const mockRoute: Route = {
        points: [
          currentLocation,
          {
            latitude: (currentLocation.latitude + destination.latitude) / 2,
            longitude: (currentLocation.longitude + destination.longitude) / 2
          },
          destination
        ],
        distance: '5.2 km',
        duration: '15 mins',
        instructions: [
          'Head northeast on Bole Road',
          'Turn right onto Cameroon Street',
          'Destination will be on your left'
        ]
      };
      setRoute(mockRoute);
    } catch (err) {
      setError('Failed to calculate route');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MapContext.Provider
      value={{
        currentLocation,
        destination,
        route,
        travelMode,
        loading,
        error,
        setDestination,
        setTravelMode,
        calculateRoute,
        refreshLocation
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};