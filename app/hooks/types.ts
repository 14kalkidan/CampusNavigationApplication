export interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string; 
  end_date: string; 
  category: string;
  location: {
    name: string;
  };
}