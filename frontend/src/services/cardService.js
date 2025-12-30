import apiClient from './authService';

export const cardService = {
  // Get all cards for a specific TC
  getCards: async (tc) => {
    try {
      const response = await apiClient.get('/cards', { params: { tc } });
      return response.data;
    } catch (error) {
       console.error(error);
       return [];
    }
  },

  // Get card applications
  getApplications: async (tc) => {
    try {
        const response = await apiClient.get('/cards/applications', { params: { tc } });
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
  },

  // Apply for a new card
  applyForCard: async (data) => {
    try {
      const response = await apiClient.post('/cards/apply', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Kart başvurusu yapılamadı');
    }
  },

  // Get card details
  getCardDetail: async (id) => {
    try {
      const response = await apiClient.get(`/cards/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Kart detayı alınamadı');
    }
  }
};
