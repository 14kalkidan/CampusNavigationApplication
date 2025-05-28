import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../APIServices/authAPI';

type User = {
  username: string;
  email: string;
} | null;

type AuthContextType = {
  isSignedIn: boolean;
  isGuest: boolean;
  user: User;
  login: (tokens: { access: string; refresh: string }, user: User) => Promise<void>;
  logout: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [user, setUser] = useState<User>(null);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        const response = await api.get('auth/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setIsSignedIn(true);
        setIsGuest(false);
      } else {
        setIsSignedIn(false);
        setUser(null);
      }
    } catch (err) {
      console.error('Fetch user profile error:', err);
      setIsSignedIn(false);
      setUser(null);
      setIsGuest(false);
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
    }
  };

  const login = async (tokens: { access: string; refresh: string }, userData: User) => {
    try {
      await AsyncStorage.multiSet([
        ['access_token', tokens.access],
        ['refresh_token', tokens.refresh],
      ]);
      setUser(userData);
      setIsSignedIn(true);
      setIsGuest(false);
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setIsSignedIn(false);
      setIsGuest(false);
      setUser(null);
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const signInAsGuest = async () => {
    try {
      setIsSignedIn(false);
      setIsGuest(true);
      setUser(null);
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      await AsyncStorage.setItem('isGuest', 'true');
    } catch (err) {
      console.error('Guest sign-in error:', err);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const guestMode = await AsyncStorage.getItem('isGuest');
      if (guestMode === 'true') {
        setIsGuest(true);
      } else {
        fetchUserProfile();
      }
    };
    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isSignedIn, isGuest, user, login, logout, signInAsGuest, fetchUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};