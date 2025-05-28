import authApi from './authAPI';

export interface Event {
  id: number;
  title: string;
  location_name: string;
  coordinates: { latitude: number; longitude: number };
  start_date: string;
  end_date: string;
  description: string;
  image: string | null;
  category?: string;
}

const BASE_URL = 'http://your-domain.com'; 

const fetchEventsByType = async (type: 'upcoming' | 'ongoing' | 'completed', retries = 3): Promise<Event[]> => {
  try {
    const response = await authApi.get<Event[]>(`/events/${type}/`);
    console.log(`Fetched ${type} events:`, response.data); 
    return response.data.map(event => ({
      ...event,
      image: event.image ? `${BASE_URL}${event.image}` : null,
    }));
  } catch (error: any) {
    if (retries > 0 && error.code === 'ECONNABORTED') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchEventsByType(type, retries - 1);
    }
    const message = error.response?.status === 404
      ? `No ${type} events found`
      : `Failed to fetch ${type} events`;
    console.error(`Error fetching ${type} events:`, error);
    throw new Error(message);
  }
};

export const fetchUpcomingEvents = () => fetchEventsByType('upcoming');
export const fetchOngoingEvents = () => fetchEventsByType('ongoing');
export const fetchCompletedEvents = () => fetchEventsByType('completed');