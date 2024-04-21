import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext"; //  Use the auth hook?
import { Colors } from "../styles/global";

export default function TopNav() {
  const router = useRouter();
  const { isSignedIn } = useAuth(); // <- Get sign-in status from context

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
      <View style={styles.icons}>
        {isSignedIn ? (
          <>
            <TouchableOpacity onPress={() => router.push("../screens/profile")}>
              <Ionicons name="person-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("../screens/notification")}>
              <Ionicons name="notifications-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={() => router.push("../screens/setting")}>
            <Ionicons name="settings-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  logo: {
    width: 80,
    height: 80,
  },
  icons: {
    flexDirection: "row",
    gap: 16,
  },
});
