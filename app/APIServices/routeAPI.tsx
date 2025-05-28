import api from './authAPI';

interface Instruction {
  distance: number;
  heading?: number;
  sign: number;
  interval: [number, number];
  text: string;
  time: number;
  street_name: string;
}

interface RouteResponse {
  points: [number, number][]; // [longitude, latitude]
  distance_km: number;
  time_minutes: number;
  instructions: Instruction[];
}

export const fetchRoute = async (
  start: string,
  end: string,
  vehicle: string
): Promise<RouteResponse> => {
  try {
    const response = await api.get('/route/', {
      params: { start, end, vehicle },
    });

    if (
      !response.data ||
      !response.data.points ||
      !Array.isArray(response.data.points)
    ) {
      throw new Error('Invalid route response: missing or invalid points');
    }

    return {
      points: response.data.points,
      distance_km: response.data.distance_km || 0,
      time_minutes: response.data.time_minutes || 0,
      instructions: response.data.instructions || [],
    };
  } catch (error: any) {
    const message = error.response?.data?.error || error.message || 'Failed to fetch route';
    console.error('Route fetch error:', message);
    throw new Error(message);
  }
};