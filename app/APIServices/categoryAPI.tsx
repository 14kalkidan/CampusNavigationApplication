import authApi from './authAPI';

interface Category {
  id: number;
  name: string;
  icon: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await authApi.get('/categories/');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error || error.message || 'Failed to fetch categories';
    console.error('Fetch categories error:', message);
    throw new Error(message);
  }
};