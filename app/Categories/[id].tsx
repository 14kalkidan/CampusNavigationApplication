import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

const categoryData = {
    cafe: [
      {
        id: 1,
        name: 'Central Café',
        location: 'In front of old graduation hall',
        image: require('@/assets/images/a.jpeg'),
        lat: 8.9806,
        lon: 38.7578,
        details: 'SPECIALS: Coffee, Pastries\nSERVICES: Seating, Takeout\nBUSY HOURS: 9AM–12PM',
      },
      {
        id: 2,
        name: 'KK Yellow Café',
        location: 'Building 2',
        image: require('@/assets/images/b.jpeg'),
        lat: 8.9811,
        lon: 38.7582,
        details: 'SPECIALS: Sandwiches, Smoothies\nSERVICES: Wi-Fi, Charging\nBUSY HOURS: 11AM–1PM',
      },
    ],
    ClassRooms: [
      {
        id: 1,
        name: 'Classroom Block A',
        location: 'Main Campus',
        image: require('@/assets/images/h.jpeg'),
        lat: 8.9790,
        lon: 38.7550,
        details: 'CAPACITY: 50\nSERVICES: Projector, Whiteboard\nBUSY HOURS: Mornings',
      },
      {
        id: 2,
        name: 'Classroom Block B',
        location: 'Science Building',
        image: require('@/assets/images/i.jpeg'),
        lat: 8.9795,
        lon: 38.7545,
        details: 'CAPACITY: 60\nSERVICES: Air-conditioned\nBUSY HOURS: Midday',
      },
    ],
    LectureHall: [
      {
        id: 1,
        name: 'Main Lecture Hall',
        location: 'Central Area',
        image: require('@/assets/images/h.jpeg'),
        lat: 8.9790,
        lon: 38.7550,
        details: 'CAPACITY: 200\nSERVICES: Microphones, Screens\nBUSY HOURS: Afternoons',
      },
      {
        id: 2,
        name: 'Science Lecture Hall',
        location: 'Science Block',
        image: require('@/assets/images/i.jpeg'),
        lat: 8.9795,
        lon: 38.7545,
        details: 'CAPACITY: 150\nSERVICES: Lecture Recording\nBUSY HOURS: Evenings',
      },
    ],
    Library: [
      {
        id: 1,
        name: 'Engineering Library',
        location: 'Building A, Block 1',
        image: require('@/assets/images/a.jpeg'),
        lat: 8.9821,
        lon: 38.7591,
        details: 'SPECIALS: Engineering Texts\nSERVICES: Reading Space\nBUSY HOURS: 10AM–3PM',
      },
      {
        id: 2,
        name: 'Mechanical Library',
        location: 'Building B, Block 2',
        image: require('@/assets/images/b.jpeg'),
        lat: 8.9815,
        lon: 38.7564,
        details: 'SPECIALS: Mechanics\nSERVICES: Group Study Rooms\nBUSY HOURS: 1PM–4PM',
      },
    ],
    Dormitory: [
      {
        id: 1,
        name: 'Block 2 Dorm',
        location: 'North Complex',
        image: require('@/assets/images/h.jpeg'),
        lat: 8.9790,
        lon: 38.7550,
        details: 'CAPACITY: 120\nSERVICES: Laundry, Wi-Fi\nBUSY HOURS: Evenings',
      },
      {
        id: 2,
        name: 'Block 4 Dorm',
        location: 'South Complex',
        image: require('@/assets/images/i.jpeg'),
        lat: 8.9795,
        lon: 38.7545,
        details: 'CAPACITY: 90\nSERVICES: Kitchen, Lounge\nBUSY HOURS: Night',
      },
    ],
  Lab: [
    {
      id: 1,
      name: 'Engineering Library',
      location: 'Building A, Block 1',
      image: require('@/assets/images/a.jpeg'),
      lat: 8.9821,
      lon: 38.7591,
      details: 'SPECIALS: Engineering Texts\nSERVICES: Reading Space\nBUSY HOURS: 10AM–3PM',
    },
    {
      id: 2,
      name: 'Mechanical Library',
      location: 'Building B, Block 2',
      image: require('@/assets/images/b.jpeg'),
      lat: 8.9815,
      lon: 38.7564,
      details: 'SPECIALS: Mechanics\nSERVICES: Group Study Rooms\nBUSY HOURS: 1PM–4PM',
    },
  ],
  Clinic: [
    {
      id: 1,
      name: 'Engineering Library',
      location: 'Building A, Block 1',
      image: require('@/assets/images/a.jpeg'),
      lat: 8.9821,
      lon: 38.7591,
      details: 'SPECIALS: Engineering Texts\nSERVICES: Reading Space\nBUSY HOURS: 10AM–3PM',
    },
    {
      id: 2,
      name: 'Mechanical Library',
      location: 'Building B, Block 2',
      image: require('@/assets/images/b.jpeg'),
      lat: 8.9815,
      lon: 38.7564,
      details: 'SPECIALS: Mechanics\nSERVICES: Group Study Rooms\nBUSY HOURS: 1PM–4PM',
    },
  ],
  Shop: [
    {
      id: 1,
      name: 'Engineering Library',
      location: 'Building A, Block 1',
      image: require('@/assets/images/a.jpeg'),
      lat: 8.9821,
      lon: 38.7591,
      details: 'SPECIALS: Engineering Texts\nSERVICES: Reading Space\nBUSY HOURS: 10AM–3PM',
    },
    {
      id: 2,
      name: 'Mechanical Library',
      location: 'Building B, Block 2',
      image: require('@/assets/images/b.jpeg'),
      lat: 8.9815,
      lon: 38.7564,
      details: 'SPECIALS: Mechanics\nSERVICES: Group Study Rooms\nBUSY HOURS: 1PM–4PM',
    },
  ],
  Collage: [
    {
      id: 1,
      name: 'Engineering Library',
      location: 'Building A, Block 1',
      image: require('@/assets/images/a.jpeg'),
      lat: 8.9821,
      lon: 38.7591,
      details: 'SPECIALS: Engineering Texts\nSERVICES: Reading Space\nBUSY HOURS: 10AM–3PM',
    },
    {
      id: 2,
      name: 'Mechanical Library',
      location: 'Building B, Block 2',
      image: require('@/assets/images/b.jpeg'),
      lat: 8.9815,
      lon: 38.7564,
      details: 'SPECIALS: Mechanics\nSERVICES: Group Study Rooms\nBUSY HOURS: 1PM–4PM',
    },
  ],
  Offices: [
    {
      id: 1,
      name: 'Engineering Library',
      location: 'Building A, Block 1',
      image: require('@/assets/images/a.jpeg'),
      lat: 8.9821,
      lon: 38.7591,
      details: 'SPECIALS: Engineering Texts\nSERVICES: Reading Space\nBUSY HOURS: 10AM–3PM',
    },
    {
      id: 2,
      name: 'Mechanical Library',
      location: 'Building B, Block 2',
      image: require('@/assets/images/b.jpeg'),
      lat: 8.9815,
      lon: 38.7564,
      details: 'SPECIALS: Mechanics\nSERVICES: Group Study Rooms\nBUSY HOURS: 1PM–4PM',
    },
  ],
  Parking: [
    {
      id: 1,
      name: 'Engineering Library',
      location: 'Building A, Block 1',
      image: require('@/assets/images/a.jpeg'),
      lat: 8.9821,
      lon: 38.7591,
      details: 'SPECIALS: Engineering Texts\nSERVICES: Reading Space\nBUSY HOURS: 10AM–3PM',
    },
    {
      id: 2,
      name: 'Mechanical Library',
      location: 'Building B, Block 2',
      image: require('@/assets/images/b.jpeg'),
      lat: 8.9815,
      lon: 38.7564,
      details: 'SPECIALS: Mechanics\nSERVICES: Group Study Rooms\nBUSY HOURS: 1PM–4PM',
    },
  ],
 Event: [
    {
      id: 1,
      name: 'Engineering Library',
      location: 'Building A, Block 1',
      image: require('@/assets/images/a.jpeg'),
      lat: 8.9821,
      lon: 38.7591,
      details: 'SPECIALS: Engineering Texts\nSERVICES: Reading Space\nBUSY HOURS: 10AM–3PM',
    },
    {
      id: 2,
      name: 'Mechanical Library',
      location: 'Building B, Block 2',
      image: require('@/assets/images/b.jpeg'),
      lat: 8.9815,
      lon: 38.7564,
      details: 'SPECIALS: Mechanics\nSERVICES: Group Study Rooms\nBUSY HOURS: 1PM–4PM',
    },
  ],
  GameZone: [
    {
      id: 1,
      name: 'Engineering Library',
      location: 'Building A, Block 1',
      image: require('@/assets/images/a.jpeg'),
      lat: 8.9821,
      lon: 38.7591,
      details: 'SPECIALS: Engineering Texts\nSERVICES: Reading Space\nBUSY HOURS: 10AM–3PM',
    },
    {
      id: 2,
      name: 'Mechanical Library',
      location: 'Building B, Block 2',
      image: require('@/assets/images/b.jpeg'),
      lat: 8.9815,
      lon: 38.7564,
      details: 'SPECIALS: Mechanics\nSERVICES: Group Study Rooms\nBUSY HOURS: 1PM–4PM',
    },
  ],
  Sports: [
    {
      id: 1,
      name: 'Engineering Library',
      location: 'Building A, Block 1',
      image: require('@/assets/images/a.jpeg'),
      lat: 8.9821,
      lon: 38.7591,
      details: 'SPECIALS: Engineering Texts\nSERVICES: Reading Space\nBUSY HOURS: 10AM–3PM',
    },
    {
      id: 2,
      name: 'Mechanical Library',
      location: 'Building B, Block 2',
      image: require('@/assets/images/b.jpeg'),
      lat: 8.9815,
      lon: 38.7564,
      details: 'SPECIALS: Mechanics\nSERVICES: Group Study Rooms\nBUSY HOURS: 1PM–4PM',
    },
  ],
  Clubs: [
    {
      id: 1,
      name: 'Engineering Library',
      location: 'Building A, Block 1',
      image: require('@/assets/images/a.jpeg'),
      lat: 8.9821,
      lon: 38.7591,
      details: 'SPECIALS: Engineering Texts\nSERVICES: Reading Space\nBUSY HOURS: 10AM–3PM',
    },
    {
      id: 2,
      name: 'Mechanical Library',
      location: 'Building B, Block 2',
      image: require('@/assets/images/b.jpeg'),
      lat: 8.9815,
      lon: 38.7564,
      details: 'SPECIALS: Mechanics\nSERVICES: Group Study Rooms\nBUSY HOURS: 1PM–4PM',
    },
  ],
};


export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const category = id?.toString();
  const data = categoryData[category] || [];
  const [searchText, setSearchText] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleDetails = (id: number) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#555" />
        <TextInput
          placeholder={`Search in ${category}`}
          placeholderTextColor="#555"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>

      {filteredData.map(item => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardRow}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.location}>{item.location}</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: '/(tabs)/map',
                      params: {
                        latitude: item.lat,
                        longitude: item.lon,
                        place_id: 'place_' + item.id,
                        name: item.name,
                        description: item.details,
                        image: Image.resolveAssetSource(item.image).uri,
                      },
                    })
                  }
                >
                  <Ionicons name="location-outline" size={20} color="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleDetails(item.id)}>
                  <Ionicons
                    name={expandedItems.includes(item.id) ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
              {expandedItems.includes(item.id) && (
                <Text style={styles.details}>{item.details}</Text>
              )}
            </View>
          </View>
        </View>
      ))}

      {filteredData.length === 0 && (
        <Text style={styles.noResults}>No results found for "{searchText}"</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'orange',
  },
  location: {
    fontSize: 13,
    color: '#777',
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    marginBottom: 6,
  },
  details: {
    fontSize: 13,
    color: '#333',
    whiteSpace: 'pre-line',
  },
  noResults: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});

