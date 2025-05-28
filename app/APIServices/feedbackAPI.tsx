import authApi from './authAPI';

const submitFeedback = async (comment: string, rating: number, routeId?: number) => {
  try {
    const payload: any = {
      comment,
      rating,
    };

    if (routeId) {
      payload.route = routeId; 
    }

    const response = await authApi.post('/feedback/', payload);
    alert('Feedback sent successfully!');
    return response.data;
  } catch (error: any) {
    console.error('Feedback error:', error.response?.data || error.message);
    alert('Error submitting feedback. Check comment and rating, or try again later.');
  }
};
