// utils/api.tsx

/**
 * Types for our mapping application
 */
export interface Place {
  id: number;
  name: string;
  latitude: number | string;
  longitude: number | string;
  description?: string;
  image?: string | null;
}

export interface RouteData {
  points: [number, number][]; // [longitude, latitude] pairs
  distance_km: number;
  time_minutes: number;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  profileImage?: string;
}

// Base API configuration
const BASE_URL = 'http://192.168.107.20:8000/api'; // Use your Django server URL

/**
 * API Service for Places/Navigation
 */
export const PlacesAPI = {
  /**
   * Search for places by query
   */
  async search(query: string): Promise<Place[]> {
    try {
      const response = await fetch(`${BASE_URL}/places/?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Failed to search places');
    }
  },

  /**
   * Get route between two points
   */
  async getRoute(
    start: { latitude: number; longitude: number },
    end: { latitude: number; longitude: number },
    vehicle: 'foot' | 'bike' | 'car'
  ): Promise<RouteData> {
    try {
      const params = new URLSearchParams({
        start: `${start.latitude},${start.longitude}`,
        end: `${end.latitude},${end.longitude}`,
        vehicle
      });

      const response = await fetch(`${BASE_URL}/navigation/?${params.toString()}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Routing error:', error);
      throw new Error('Failed to fetch route');
    }
  }
};

/**
 * API Service for Authentication
 */
export const AuthAPI = {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<UserProfile> {
    try {
      const response = await fetch(`${BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  },

  /**
   * Register new user
   */
  async register(name: string, email: string, password: string): Promise<UserProfile> {
    try {
      const response = await fetch(`${BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed');
    }
  },

  /**
   * Fetch user profile (requires authentication)
   */
  async fetchProfile(token: string): Promise<UserProfile> {
    try {
      const response = await fetch(`${BASE_URL}/auth/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw new Error('Failed to fetch profile');
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(
    token: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
    try {
      const response = await fetch(`${BASE_URL}/auth/profile/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile');
    }
  }
};

/**
 * Helper functions
 */
export const coordToString = (coord: { latitude: number; longitude: number }) => {
  return `${coord.latitude},${coord.longitude}`;
};

/**
 * Convert Django API [lon,lat] points to [lat,lon] for React Native Maps
 */
export const convertRoutePoints = (points: [number, number][]) => {
  return points.map(point => ({
    latitude: point[1],
    longitude: point[0]
  }));
};