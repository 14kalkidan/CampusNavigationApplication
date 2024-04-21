import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors, GlobalStyles } from "../styles/global";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const AuthScreen = () => {
  const router = useRouter();
  const { setIsSignedIn } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Auto-login regardless of input
    setIsSignedIn(true);
    router.replace("/(tabs)");
    Alert.alert("Success", "Logged in successfully!");
    
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[GlobalStyles.container, { backgroundColor: Colors.white }]}
    >
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>AASTU GO</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.formTitle}>
          {isLogin ? "Login to your Account" : "Create your Account"}
        </Text>

        {!isLogin && (
          <TextInput
            placeholder="User Name"
            placeholderTextColor={Colors.secondary}
            style={GlobalStyles.input}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}

        <TextInput
          placeholder="Email (Optional)"
          placeholderTextColor={Colors.secondary}
          keyboardType="email-address"
          autoCapitalize="none"
          style={GlobalStyles.input}
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password (Optional)"
            placeholderTextColor={Colors.secondary}
            secureTextEntry={!showPassword}
            style={GlobalStyles.input}
            value={password}
            onChangeText={setPassword}
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

        <TouchableOpacity
          style={[GlobalStyles.button, styles.authButton]}
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

        <TouchableOpacity
          onPress={() => setIsLogin(!isLogin)}
          style={styles.toggleButton}
        >
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
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textDark,
  },
  form: {
    width: "80%",
    alignItems: "center",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textDark,
    marginBottom: 20,
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
  authButton: {
    backgroundColor: Colors.primary,
    marginTop: 10,
    marginBottom: 20,
  },
  toggleButton: {
    marginTop: 10,
  },
  toggleText: {
    color: Colors.primary,
    textAlign: "center",
    fontWeight: "500",
  },
});

export default AuthScreen;