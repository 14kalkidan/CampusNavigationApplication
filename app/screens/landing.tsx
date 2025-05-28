import { useRouter } from "expo-router";
import React from "react";
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, GlobalStyles } from "../styles/global";
import { useAuth } from "../context/AuthContext"; 
const Landing = () => {
  const router = useRouter();
  const { signInAsGuest } = useAuth(); 
  return (
    <ImageBackground 
      source={require("../../assets/images/1.jpg")} 
      style={GlobalStyles.imageBackground}
    >
      <View style={styles.overlay} />
      
      <View style={styles.content}>
        <Image 
          source={require("../../assets/images/logo.png")} 
          style={styles.logo} 
        />
        <Text style={styles.title}>Navigate through campus with ease</Text>
        
        <TouchableOpacity 
          style={styles.mainButton} 
          onPress={() => router.push("/screens/auth")}
        >
          <Text style={styles.mainButtonText}>Sign In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => {
            signInAsGuest(); 
            router.replace("/(tabs)");
          }}
        >
          <Text style={styles.linkText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlayDark,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    color: Colors.white,
    fontWeight: "600",
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 36,
  },
  mainButton: {
    backgroundColor: Colors.green,
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: Colors.overlayDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  mainButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  linkText: {
    color: Colors.white,
    fontSize: 16,
    textDecorationLine: "underline",
    opacity: 0.9,
  },
});

export default Landing;
