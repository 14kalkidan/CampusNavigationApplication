import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
const slides = [
  {
    image: require("../../assets/images/logo.png"),
    text: "AASTUGO",
  },
  {
    image: require("../../assets/images/first.png"),
    text: "Navigate through campus with Ease",
  },
  {
    image: require("../../assets/images/second.png"),
    text: "Find Cafés, Libraries, and Events",
  },
  {
    image: require("../../assets/images/third.png"),
    text: "Start exploring now!",
  },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const slideIndex = Math.round(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
          setIndex(slideIndex);
        }}
        scrollEventThrottle={16}
      >
        {slides.map((slide, i) => (
          <View key={i} style={styles.slide}>
            <Image source={slide.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.text}>{slide.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dotsContainer}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, index === i && styles.activeDot]} />
        ))}
      </View>

      {index === slides.length - 1 && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.signInButton} onPress={() => router.push("/Authentication/signin")}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.guestButton} onPress={() => router.push("/guest/home")}>
            <Text style={styles.guestText}>Guest</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    alignItems: "center",
  },
  slide: {
    width:20,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 30,
  },
  text: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#007bff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    gap: 16,
  },
  signInButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
  },
  guestButton: {
    borderColor: "#000",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
  },
  signInText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  guestText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
})