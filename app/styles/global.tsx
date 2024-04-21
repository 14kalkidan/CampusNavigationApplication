import { StyleSheet } from "react-native";

export const Colors = {
  primary: "#f97316",       // Orange-500 (for buttons)
  secondary: "#6b7280",     // Gray-500
  green: "#3ab795",         // Custom green
  error: "#ef4444",         // Red-500
  background: "#f8fafc",    // Gray-50
  white: "#ffffff",
  border: "#d1d5db",        // Gray-300
  textDark: "#1f2937",      // Gray-800
  overlayDark: "rgba(0, 0, 0, 0.5)",
};

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  input: {
    width: '100%',
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 16,
    color: Colors.textDark,
  },
  button: {
    width: '100%',
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});