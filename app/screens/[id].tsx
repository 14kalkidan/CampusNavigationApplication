import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchPlacesByCategory } from '../APIServices/placeAPI';
import { Colors } from '../styles/global';
import SearchBar from '../components/SearchBar';
import GoBackButton from '../components/GoBackButton';
import TopNav from '../components/TopNav';

interface Place {
  id: number;
  name: string;
  location: string;
  description: string;
  hours: string;
  image: string | null;
  latitude: number;
  longitude: number;
  category?: string; 
}

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [animation] = useState(new Animated.Value(0));
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const categoryId = typeof id === 'string' ? id : id[0]; 
        const data = await fetchPlacesByCategory(categoryId.toLowerCase());
        const enrichedPlaces = data.map(place => ({
          ...place,
          latitude: place.latitude || 9.0315, 
          longitude: place.longitude || 38.7632, 
        }));
        setPlaces(enrichedPlaces);
      } catch (err: any) {
        setError(err.message || 'Failed to load places');
      } finally {
        setLoading(false);
      }
    };
    loadPlaces();
  }, [id]);

  const filteredPlaces = places.filter(
    (place) =>
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
    outputRange: [100, 200],
  });

  const getImageSource = (image: string | null) => {
    return image ? { uri: image } : require('../../assets/images/1.jpg');
  };

  const handleImagePress = (place: Place) => {
    router.push({
      pathname: '/(tabs)/search',
      params: {
        latitude: place.latitude.toString(),
        longitude: place.longitude.toString(),
        name: place.name,
        category: place.category || 'Unknown',
        image: place.image || '', 
      },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TopNav />
      <View style={styles.header}>
        <GoBackButton />
        <Text style={styles.categoryTitle}>
          {typeof id === 'string' ? id.charAt(0).toUpperCase() + id.slice(1) : id[0]} Spots
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder={`Search ${typeof id === 'string' ? id : id[0]}...`}
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Text style={styles.loadingText}>Loading places...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => (
            <Animated.View
              key={place.id}
              style={[
                styles.card,
                { height: expandedCard === place.id.toString() ? cardHeight : 100 },
              ]}
            >
              <TouchableOpacity
                style={styles.cardContent}
                activeOpacity={0.9}
                onPress={() => toggleCard(place.id.toString())}
              >
                <TouchableOpacity onPress={() => handleImagePress(place)}>
                  <Image source={getImageSource(place.image)} style={styles.cardImage} />
                </TouchableOpacity>

                <View style={styles.textContainer}>
                  <Text style={styles.placeName}>{place.name}</Text>
                  <Text style={styles.placeLocation}>{place.location}</Text>
                  <Text style={styles.placeHours}>{place.hours}</Text>
                </View>
              </TouchableOpacity>

              {expandedCard === place.id.toString() && (
                <View style={styles.expandedContent}>
                  <Text style={styles.description}>{place.description}</Text>
                </View>
              )}
            </Animated.View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No {typeof id === 'string' ? id : id[0]} found matching your search
            </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textDark,
    textAlign: 'center',
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: Colors.secondary,
    fontSize: 16,
  },
  loadingText: {
    color: Colors.secondary,
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
  },
  errorText: {
    color: Colors.error || '#FF4D4F',
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
  },
});