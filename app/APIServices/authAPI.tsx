import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authApi = axios.create({
  baseURL: "http://192.168.216.20:8000/api",
  headers: { "Content-Type": "application/json", "Accept": "application/json" },
});

// Request interceptor to attach access token
authApi.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to refresh token
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem("refresh_token");
        if (!refreshToken) return Promise.reject(error);

       
        const res = await axios.post(
          "http://192.168.216.20:8000/api/auth/token/refresh/",
          {
            refresh: refreshToken,
          }
        );

        const newAccess = res.data.access;
        await AsyncStorage.setItem("access_token", newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return authApi(originalRequest);
      } catch (err) {
        await AsyncStorage.multiRemove(["access_token", "refresh_token"]);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default authApi;