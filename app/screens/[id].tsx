import React, { useState } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import TopNav from '../components/TopNav';
import SearchBar from '../components/SearchBar';
import { Colors } from '../styles/global';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock data for different categories
const categoryData = {
  cafe: [
    {
      id: '1',
      name: 'kk',
      location: 'Student Center, Floor 1',
      image: require('../../assets/images/4.jpg'),
      description: 'The perfect spot for your morning brew with artisanal coffee and fresh pastries. Open 7am-9pm daily.',
      hours: '7:00 AM - 9:00 PM',
    },
    {
      id: '2',
      name: 'central',
      location: 'Main Library, Entrance',
      image: require('../../assets/images/4.jpg'),
      description: 'Quiet study spot with specialty teas and light snacks. Power outlets at every table.',
      hours: '8:00 AM - 8:00 PM',
    }
  ],
  office: [
    {
      id: '3',
      name: 'Registrar Office',
      location: 'Administration Building, Room 101',
      image: require('../../assets/images/6.jpg'),
      description: 'Handle all your enrollment, transcripts, and academic records here. Bring your student ID.',
      hours: '9:00 AM - 5:00 PM',
    }
  ],
  // Add other categories...
};

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [animation] = useState(new Animated.Value(0));

  const currentCategory = categoryData[id] || [];
  
  const filteredPlaces = currentCategory.filter(place => 
    place.name.toLowerCase().includes(searchText.toLowerCase()) ||
    place.location.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleCard = (placeId: string) => {
    if (expandedCard === placeId) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setExpandedCard(null));
    } else {
      setExpandedCard(placeId);
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const cardHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 200] // Adjust based on your content
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TopNav />
      
      <View style={styles.searchContainer}>
        <SearchBar 
          value={searchText}
          onChangeText={setSearchText}
          placeholder={`Search ${id}...`}
        />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.categoryTitle}>
          {id.charAt(0).toUpperCase() + id.slice(1)} Spots
        </Text>

        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => (
            <Animated.View 
              key={place.id}
              style={[
                styles.card,
                { height: expandedCard === place.id ? cardHeight : 100 }
              ]}
            >
              <TouchableOpacity 
                style={styles.cardContent}
                activeOpacity={0.9}
                onPress={() => toggleCard(place.id)}
              >
                <Image source={place.image} style={styles.cardImage} />
                
                <View style={styles.textContainer}>
                  <Text style={styles.placeName}>{place.name}</Text>
                  <Text style={styles.placeLocation}>{place.location}</Text>
                  <Text style={styles.placeHours}>{place.hours}</Text>
                </View>
              </TouchableOpacity>

              {expandedCard === place.id && (
                <View style={styles.expandedContent}>
                  <Text style={styles.description}>{place.description}</Text>
                  
                  
                </View>
              )}
            </Animated.View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No {id} found matching your search</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 20,
    marginTop: 10,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: Colors.overlayDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 4,
  },
  placeLocation: {
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 4,
  },
  placeHours: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  expandedContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  description: {
    fontSize: 14,
    color: Colors.textDark,
    lineHeight: 20,
    marginBottom: 12,
  },
  directionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  directionText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: Colors.secondary,
    fontSize: 16,
  },
});