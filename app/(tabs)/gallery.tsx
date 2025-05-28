// app/screens/GalleryScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TopNav from "../components/TopNav";
import { useAuth } from "../context/AuthContext";
import { Colors } from "../styles/global";

const { width } = Dimensions.get("window");

interface GalleryImage {
  id: number;
  image: string;
  place: string;
  comment: string;
}

export default function GalleryScreen() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        const data: GalleryImage[] = [
          {
            id: 1,
            image: Image.resolveAssetSource(require("../../assets/images/3.jpg")).uri,
            place: "Library",
            comment: "The central hub for quiet study and resources.",
          },
          {
            id: 2,
            image: Image.resolveAssetSource(require("../../assets/images/4.jpg")).uri,
            place: "Cafeteria",
            comment: "Where students gather for meals and hangouts.",
          },
          {
            id: 3,
            image: Image.resolveAssetSource(require("../../assets/images/5.jpg")).uri,
            place: "Dormitory",
            comment: "A peaceful home for students on campus.",
          },
          {
            id: 4,
            image: Image.resolveAssetSource(require("../../assets/images/6.jpg")).uri,
            place: "Sports Field",
            comment: "Perfect spot for games and afternoon jogs.",
          },
        ];
        setImages(data);
        setError(null);
      } catch (err: any) {
        setError("Failed to load sample gallery images");
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  const downloadImage = async (imageUrl: string) => {
    try {
      const fileUri = `${FileSystem.documentDirectory}downloadedImage.jpg`;
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "We need permission to save images to your gallery");
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync("MyAppGallery");
      if (album == null) {
        await MediaLibrary.createAlbumAsync("MyAppGallery", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album.id, false);
      }
      Alert.alert("Download Successful", "The image has been downloaded to your gallery");
    } catch (error) {
      console.error("Error downloading image:", error);
      Alert.alert("Download Failed", "Failed to download the image");
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <TopNav isSignedIn={isSignedIn} />
      </SafeAreaView>

      <Text style={styles.title}>Gallery</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading images...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : images.length === 0 ? (
        <Text style={styles.loadingText}>No images available</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.grid}>
          {images.map((img) => (
            <TouchableOpacity
              key={img.id}
              onPress={() => setSelectedImage(img)}
              style={styles.imageWrap}
              accessible
              accessibilityLabel={`View ${img.place} image`}
              accessibilityRole="imagebutton"
            >
              <Image source={{ uri: img.image }} style={styles.image} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {selectedImage && (
        <Modal visible={true} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image
                source={{ uri: selectedImage.image }}
                style={styles.fullImage}
                resizeMode="contain"
              />
              <Text style={styles.place}>{selectedImage.place}</Text>
              <Text style={styles.comment}>{selectedImage.comment}</Text>
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
                style={styles.closeBtn}
                accessible
                accessibilityLabel="Close modal"
                accessibilityRole="button"
              >
                <Ionicons name="close" size={28} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => downloadImage(selectedImage.image)}
                style={styles.downloadBtn}
                accessible
                accessibilityLabel={`Download ${selectedImage.place} image`}
                accessibilityRole="button"
              >
                <Ionicons name="download" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Floating Upload Icon */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => {
          if (isSignedIn) {
            router.push("../screens/UploadImage");
          } else {
            router.push("../screens/auth");
          }
        }}
        accessible
        accessibilityLabel="Upload new image"
        accessibilityHint="Navigate to upload screen or login if not signed in"
      >
        <Ionicons name="cloud-upload-outline" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 16,
    color: Colors.textDark,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: Colors.textGray,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: Colors.error,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  imageWrap: {
    width: (width - 48) / 2,
    aspectRatio: 0.8,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: width * 0.85,
  },
  fullImage: {
    width: "100%",
    height: width * 0.85,
    borderRadius: 12,
    marginBottom: 10,
  },
  place: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
    textAlign: "center",
    color: Colors.textDark,
  },
  comment: {
    fontSize: 14,
    color: Colors.textGray,
    textAlign: "center",
    marginBottom: 10,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  downloadBtn: {
    marginTop: 0,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  fabButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    padding: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 10,
  },
});
