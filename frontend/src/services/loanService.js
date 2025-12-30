import apiClient from './authService';

export const loanService = {
  getLoanInfo: async (tcNo) => {
    try {
      const response = await apiClient.get(`/loan/info/${tcNo}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Kredi bilgileri alınamadı';
    }
  },

  calculateScore: async (tc) => {
      try {
          const response = await apiClient.post('/loan/score', { tc });
          return response.data;
      } catch (error) {
           throw error.response?.data?.message || 'Skor hesaplanamadı';
      }
  },

  takeLoan: async (tc, amount) => {
    try {
      const response = await apiClient.post('/loan/take', { tc, amount });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Kredi çekilemedi';
    }
  },

  payLoan: async (tc, amount) => {
    try {
      const response = await apiClient.post('/loan/pay', { tc, amount });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Ödeme yapılamadı';
    }
  }
};
