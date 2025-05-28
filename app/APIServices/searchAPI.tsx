import api from './authAPI';

interface Place {
  id: number;
  name: string;
  category: string;
  description?: string;
  image?: string | null;
  latitude: number;
  longitude: number;
}

export const searchPlaces = async (query: string): Promise<Place[]> => {
  try {
    const response = await api.get(`/places/?search=${encodeURIComponent(query)}`);
    const data = Array.isArray(response.data) ? response.data : [response.data];

    if (data.length === 0) {
      console.log('No places found for query:', query);
      return [];
    }

    const places = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category || 'Unknown',
      description: item.description || '',
      image: item.image || null,
      latitude: parseFloat(item.latitude),
      longitude: parseFloat(item.longitude),
    }));

    console.log('Search results:', places);
    return places;
  } catch (error: any) {
    const message = error.response?.data?.error || error.message || 'Failed to search places';
    console.error('Search error:', message);
    throw new Error(message);
  }
};

export const fetchCategoryByName = async (name: string): Promise<Place | null> => {
  try {
    const places = await searchPlaces(name);
    return places.length > 0 ? places[0] : null;
  } catch (error: any) {
    console.error('Category fetch error:', error.message);
    throw error;
  }
};