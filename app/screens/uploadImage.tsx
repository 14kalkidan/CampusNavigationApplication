import React, { useState } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Colors } from '../styles/global';

export default function UploadScreen() {
  const [image, setImage] = useState(null);
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.cancelled) setImage(result.uri);
  };

  const uploadImage = () => {
    if (!image) return;
    // handle upload logic here (e.g., Firebase, server)
    alert('Image uploaded!');
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Upload an Image</Text>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Pick Image" onPress={pickImage} color={Colors.primary} />
      {image && <Button title="Upload" onPress={uploadImage} color={Colors.secondary} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20 },
  label: { fontSize: 18, marginBottom: 20 },
  image: { width: 200, height: 200, borderRadius: 10, marginVertical: 20 },
});
