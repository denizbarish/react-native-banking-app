import apiClient from './authService';

export const cardService = {
  getCards: async (tc) => {
    try {
      const response = await apiClient.get('/cards', { params: { tc } });
      return response.data;
    } catch (error) {

       return [];
    }
  },

  getApplications: async (tc) => {
    try {
        const response = await apiClient.get('/cards/applications', { params: { tc } });
        return response.data;
    } catch (error) {

        return [];
    }
  },

  applyForCard: async (data) => {
    try {
      const response = await apiClient.post('/cards/apply', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Kart başvurusu yapılamadı');
    }
  },

  getCardDetail: async (id) => {
    try {
      const response = await apiClient.get(`/cards/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Kart detayı alınamadı');
    }
  }
};
