import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { fetchImages } from '../util/api'; // Import API function
import TopNav from '../components/TopNav'; // Import TopNav
import { Colors } from '../styles/global';
import { useAuth } from '../context/AuthContext'; // Import AuthContext

const { width } = Dimensions.get('window');

interface GalleryImage {
  id: number;
  image_url: string;
  place: string;
  comment: string;
}

export default function GalleryScreen() {
  const router = useRouter();
  const { user } = useAuth(); // Get user from AuthContext
  const isSignedIn = !!user; // Determine if user is signed in
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]); // State for fetched images
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch images from Django API
  useEffect(() => {
    const loadImages = async () => {
      try {
        const data = await fetchImages();
        setImages(data);
        setLoading(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to load images from server');
        setLoading(false);
      }
    };
    loadImages();
  }, []);

  const downloadImage = async (imageUrl: string) => {
    try {
      const fileUri = `${FileSystem.documentDirectory}downloadedImage.jpg`;
      await FileSystem.downloadAsync(imageUrl, fileUri);

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need permission to save images to your gallery');
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(fileUri);
      const album = await MediaLibrary.getAlbumAsync('MyAppGallery');
      if (album == null) {
        await MediaLibrary.createAlbumAsync('MyAppGallery', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album.id, false);
      }
      Alert.alert('Download Successful', 'The image has been downloaded to your gallery');
    } catch (error) {
      console.error('Error downloading image:', error);
      Alert.alert('Download Failed', 'Failed to download the image');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <TopNav isSignedIn={isSignedIn} /> {/* Add TopNav */}
      </SafeAreaView>

      {/* Title */}
      <Text style={styles.title}>Gallery</Text>

      {/* Loading State */}
      {loading ? (
        <Text style={styles.loadingText}>Loading images...</Text>
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
              <Image
                source={{ uri: img.image_url }}
                style={styles.image}
                resizeMode="cover"
                defaultSource={require('@/assets/images/1.jpg')} // Optional fallback
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Modal */}
      {selectedImage && (
        <Modal visible={true} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image
                source={{ uri: selectedImage.image_url }}
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
                onPress={() => downloadImage(selectedImage.image_url)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: Colors.textGray,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  imageWrap: {
    width: (width - 48) / 2,
    aspectRatio: 0.8,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: width * 0.85,
  },
  fullImage: {
    width: '100%',
    height: width * 0.85,
    borderRadius: 12,
    marginBottom: 10,
  },
  place: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
    textAlign: 'center',
  },
  comment: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  downloadBtn: {
    marginTop: 0,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
});