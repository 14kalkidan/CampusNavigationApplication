import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import Tts from 'react-native-tts';

interface Place {
  id: number;
  name: string;
  category: string;
  description?: string;
  image?: string | null;
  latitude: number;
  longitude: number;
  hours?: string;
}

interface Instruction {
  text: string;
  distance: number;
  time: number;
}

interface Props {
  place: Place;
  distance?: number;
  duration?: number;
  instructions?: Instruction[];
  onNavigate: () => void;
}

export default function PlaceCard({ place, distance, duration, instructions, onNavigate }: Props) {
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const heightAnim = useRef(new Animated.Value(0)).current; 
  const contentOpacity = useRef(new Animated.Value(0)).current; 

  const COLLAPSED_HEIGHT = 100;
  const EXPANDED_HEIGHT = 450; 

  const toggleCollapse = () => {
    if (!isCollapsed && isTtsEnabled) {
      Tts.stop(); 
    }

    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: isCollapsed ? 1 : 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
      Animated.timing(contentOpacity, {
        toValue: isCollapsed ? 1 : 0,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();

    setIsCollapsed(!isCollapsed);

    // Resume TTS if expanding and enabled
    if (isCollapsed && isTtsEnabled && instructions && instructions.length > 0) {
      instructions.forEach((instruction, index) => {
        if (instruction.text && typeof instruction.text === 'string') {
          setTimeout(() => {
            Tts.speak(`${index + 1}. ${instruction.text}`).catch((error) =>
              console.error('TTS speak error in PlaceCard:', error)
            );
          }, index * 2000);
        }
      });
    }
  };

  const cardHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLLAPSED_HEIGHT, EXPANDED_HEIGHT],
  });

  const toggleTts = () => {
    setIsTtsEnabled((prev) => {
      if (!prev && instructions && instructions.length > 0 && !isCollapsed) {
        instructions.forEach((instruction, index) => {
          if (instruction.text && typeof instruction.text === 'string') {
            setTimeout(() => {
              Tts.speak(`${index + 1}. ${instruction.text}`).catch((error) =>
                console.error('TTS speak error in PlaceCard:', error)
              );
            }, index * 2000);
          }
        });
      } else {
        Tts.stop();
      }
      return !prev;
    });
  };

  return (
    <Animated.View style={[styles.card, { height: cardHeight }]}>
      <TouchableOpacity
        style={styles.collapseButton}
        onPress={toggleCollapse}
        accessible
        accessibilityLabel={isCollapsed ? 'Expand place details' : 'Collapse place details'}
        accessibilityRole="button"
      >
        <MaterialIcons
          name={isCollapsed ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color="#666"
        />
      </TouchableOpacity>

      {place.image && <Image source={{ uri: place.image }} style={styles.image} />}

      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={isCollapsed ? 1 : 2} ellipsizeMode="tail">
          {place.name}
        </Text>
        {place.hours && (
          <Text style={styles.hours}>
            <MaterialIcons name="access-time" size={14} /> {place.hours}
          </Text>
        )}
      </View>

      {!isCollapsed && (
        <Animated.View style={[styles.content, { opacity: contentOpacity }]}>
          <ScrollView style={styles.details} scrollEnabled={!isCollapsed}>
            {place.description && <Text style={styles.description}>{place.description}</Text>}
            {distance !== undefined && duration !== undefined && (
              <View style={styles.routeInfo}>
                <Text style={styles.routeText}>
                  <FontAwesome5 name="road" size={12} /> {Math.round(distance)} meters
                </Text>
                <Text style={styles.routeText}>
                  <FontAwesome5 name="clock" size={12} /> {Math.round(duration / 60)} mins
                </Text>
              </View>
            )}

            <View style={styles.instructionsContainer}>
              <View style={styles.instructionsHeader}>
                <Text style={styles.instructionsTitle}>
                  Turn-by-Turn Instructions ({instructions?.length || 0})
                </Text>
                <TouchableOpacity
                  onPress={toggleTts}
                  style={styles.ttsButton}
                  accessible
                  accessibilityLabel={isTtsEnabled ? 'Disable TTS' : 'Enable TTS'}
                  accessibilityRole="button"
                >
                  <MaterialIcons
                    name={isTtsEnabled ? 'volume-up' : 'volume-off'}
                    size={24}
                    color={isTtsEnabled ? '#4D90FE' : '#888'}
                  />
                </TouchableOpacity>
              </View>
              {instructions && instructions.length > 0 ? (
                instructions.map((instruction, index) => (
                  <View key={index} style={styles.instructionItem}>
                    <Text style={styles.instructionText}>
                      {index + 1}. {instruction.text} ({Math.round(instruction.distance)}m)
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.instructionText}>
                  No instructions available. Try navigating again.
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.navigateButton}
              onPress={onNavigate}
              accessible
              accessibilityLabel="Start navigation"
              accessibilityRole="button"
            >
              <Text style={styles.navigateText}>
                <FontAwesome5 name="location-arrow" size={14} /> Navigate
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden',
  },
  collapseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 4,
  },
  image: {
    width: '100%',
    height: 120,
  },
  header: {
    padding: 12,
    paddingTop: 40, 
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  hours: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  details: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  description: {
    fontSize: 14,
    marginTop: 6,
    color: '#444',
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  routeText: {
    fontSize: 13,
    color: '#333',
  },
  instructionsContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#f5f7fa',
    borderRadius: 8,
  },
  instructionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  instructionItem: {
    marginBottom: 6,
  },
  instructionText: {
    fontSize: 13,
    color: '#444',
  },
  ttsButton: {
    padding: 6,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  navigateButton: {
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: '#4D90FE',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  navigateText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});