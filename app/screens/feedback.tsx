
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../styles/global';

export default function FeedbackScreen() {
  const [feedback, setFeedback] = useState('');
  const router = useRouter();

  const submitFeedback = () => {
    if (feedback.trim().length === 0) return Alert.alert('Please enter your feedback.');
    Alert.alert('Feedback submitted!', 'Thank you for your input.');
    setFeedback('');
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>We value your feedback</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your feedback here..."
        multiline
        numberOfLines={5}
        value={feedback}
        onChangeText={setFeedback}
      />
      <Button title="Submit" onPress={submitFeedback} color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 18, marginBottom: 10 },
  input: {
    borderColor: Colors.grey,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
});
