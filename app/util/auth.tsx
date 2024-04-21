// util/auth.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkIfLoggedIn = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  } catch (error) {
    console.error("Error checking login status:", error);
    return true;
  }
};

export const setAuthToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error("Error setting auth token:", error);
  }
};

export const clearAuthToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error("Error clearing auth token:", error);
  }
};
