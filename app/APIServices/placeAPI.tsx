import authApi from './authAPI';

interface Place {
  id: number;
  name: string;
  location: string;
  description: string;
  hours: string;
  image: string | null;
}

export const fetchPlacesByCategory = async (category: string): Promise<Place[]> => {
  try {
    const response = await authApi.get('/places/', {
      params: { category },
    });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error || error.message || 'Failed to fetch places';
    console.error('Fetch places error:', message);
    throw new Error(message);
  }
};