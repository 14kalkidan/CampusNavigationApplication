import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const FeedbackScreen = () => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = async () => {
    if (!comment.trim() || comment.trim().length < 5) {
      Alert.alert('Validation Error', 'Comment must be at least 5 characters long');
      return;
    }

    if (rating < 1 || rating > 5) {
      Alert.alert('Validation Error', 'Please select a rating between 1 and 5');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        'http://192.168.216.20:8000/api/feedback/',
        {
          comment: comment.trim(),
          rating: rating
        }
      );

      Alert.alert('Success', response.data.message || 'Thank you for your feedback!');
      setComment('');
      setRating(0);
      
    } catch (error) {
      let errorMessage = 'Failed to submit feedback. Please try again later.';
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          // Handle Django validation errors
          errorMessage = Object.values(error.response.data.errors || {})
                            .flat()
                            .join('\n');
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      Alert.alert('Submission Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity 
        key={star} 
        onPress={() => setRating(star)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={rating >= star ? 'star' : 'star-outline'}
          size={32}
          color={rating >= star ? '#FFD700' : '#ccc'}
          style={styles.star}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share Your Feedback</Text>
      
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>Rating:</Text>
        <View style={styles.starsContainer}>
          {renderStars()}
        </View>
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Your comments (minimum 5 characters)"
        placeholderTextColor="#888"
        multiline
        numberOfLines={5}
        value={comment}
        onChangeText={setComment}
      />
      
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.disabledButton]}
        onPress={submitFeedback}
        disabled={isSubmitting}
        activeOpacity={0.8}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Submit Feedback</Text>
            <Ionicons name="send" size={20} color="white" style={styles.icon} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333'
  },
  ratingContainer: {
    marginBottom: 25
  },
  ratingLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
    fontWeight: '500'
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignSelf: 'center'
  },
  star: {
    marginHorizontal: 3
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
    minHeight: 160,
    textAlignVertical: 'top',
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3
  },
  disabledButton: {
    opacity: 0.7
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 10
  },
  icon: {
    marginLeft: 5
  }
});

export default FeedbackScreen;