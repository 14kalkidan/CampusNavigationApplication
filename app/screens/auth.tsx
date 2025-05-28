import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../APIServices/authAPI";
import { Colors, GlobalStyles } from "../styles/global";
import { useAuth } from "../context/AuthContext";
import GoBackButton from "../components/GoBackButton";

const AuthScreen = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    setError("");
    if (!formData.username || !formData.password) {
      setError(isLogin ? "Username and password are required" : "All fields are required");
      return false;
    }
    if (!isLogin) {
      if (!formData.email) {
        setError("Email is required");
        return false;
      }
      if (formData.username.length < 3) {
        setError("Username must be at least 3 characters");
        return false;
      }
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters");
        return false;
      }
      if (formData.password !== formData.password_confirm) {
        setError("Passwords don't match");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address");
        return false;
      }
    }
    return true;
  };

  const handleAuth = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const payload = isLogin
        ? {
            username: formData.username.trim(),
            password: formData.password.trim(),
          }
        : {
            username: formData.username.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password.trim(),
            password_confirm: formData.password_confirm.trim(),
          };
      const endpoint = isLogin ? "auth/login/" : "auth/register/";
      const response = await api.post(endpoint, payload);

      const tokens = {
        access: response.data.access,
        refresh: response.data.refresh,
      };
      const userData = {
        username: formData.username,
        email: isLogin ? response.data.email || formData.username : formData.email,
      };

      await login(tokens, userData);
      router.replace("/(tabs)");
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (err: any) => {
    console.error("Auth error details:", err.response?.data || err.message);
    let userMessage = "Something went wrong. Please try again.";

    if (!err.response) {
      userMessage = "Network error. Please check your connection and ensure the server is running at http://192.168.216.20:8000.";
    } else if (err.response.status === 400) {
      const errors = err.response.data?.errors || {};
      if (errors.email) {
        userMessage = `Email: ${errors.email[0]}`;
      } else if (errors.username) {
        userMessage = `Username: ${errors.username[0]}`;
      } else if (errors.password) {
        userMessage = `Password: ${errors.password[0]}`;
      } else if (errors.password_confirm) {
        userMessage = `Password confirmation: ${errors.password_confirm[0]}`;
      } else if (err.response.data?.detail) {
        userMessage = err.response.data.detail;
      } else if (err.response.data?.message) {
        userMessage = err.response.data.message;
      }
    } else if (err.response.status === 401) {
      userMessage = err.response.data?.detail || "Invalid username or password";
    } else if (err.response.status === 404) {
      userMessage = "Authentication endpoint not found. Please check the server configuration.";
    } else if (err.response.status === 403) {
      userMessage = "Account not verified. Please check your email for a verification link.";
    }

    setError(userMessage);
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      password_confirm: "",
    });
    setError("");
  };

  const toggleAuthMode = () => {
    resetForm();
    setIsLogin(!isLogin);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[GlobalStyles.container, { backgroundColor: Colors.white }]}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <GoBackButton />
          <View style={styles.headerCenter}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
            />
            <Text style={styles.title}>AASTU GO</Text>
          </View>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.formTitle}>
          {isLogin ? "Welcome back!" : "Create your account"}
        </Text>

        <TextInput
          placeholder="Username"
          placeholderTextColor={Colors.secondary}
          style={GlobalStyles.input}
          value={formData.username}
          onChangeText={(text) => handleInputChange("username", text)}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {!isLogin && (
          <TextInput
            placeholder="Email"
            placeholderTextColor={Colors.secondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={GlobalStyles.input}
            value={formData.email}
            onChangeText={(text) => handleInputChange("email", text)}
          />
        )}

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor={Colors.secondary}
            secureTextEntry={!showPassword}
            style={GlobalStyles.input}
            value={formData.password}
            onChangeText={(text) => handleInputChange("password", text)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={Colors.secondary}
            />
          </TouchableOpacity>
        </View>

        {!isLogin && (
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor={Colors.secondary}
              secureTextEntry={!showConfirmPassword}
              style={GlobalStyles.input}
              value={formData.password_confirm}
              onChangeText={(text) => handleInputChange("password_confirm", text)}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color={Colors.secondary}
              />
            </TouchableOpacity>
          </View>
        )}

        {error ? (
          <Text style={styles.error} numberOfLines={3} ellipsizeMode="tail">
            {error}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[
            GlobalStyles.button,
            styles.authButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={GlobalStyles.buttonText}>
              {isLogin ? "Log in" : "Sign up"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleAuthMode}>
          <Text style={styles.toggleText}>
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Log in"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textDark,
  },
  form: {
    width: "85%",
    alignItems: "center",
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.textDark,
    marginBottom: 25,
    textAlign: "center",
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 15,
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  error: {
    color: Colors.error,
    marginBottom: 15,
    textAlign: "center",
    maxWidth: "100%",
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  authButton: {
    backgroundColor: Colors.primary,
    marginTop: 10,
    marginBottom: 20,
    width: "100%",
  },
  disabledButton: {
    opacity: 0.7,
  },
  toggleText: {
    color: Colors.secondary,
    textAlign: "center",
    marginTop: 10,
  },
});

export default AuthScreen;