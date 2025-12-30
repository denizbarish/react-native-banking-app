import apiClient from './authService';

export const exchangeService = {
  getRates: async () => {
    try {
      const response = await apiClient.get('/exchange');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Döviz kurları alınamadı'
      );
    }
  },

  buyCurrency: async (tcNo, currency, amount) => {
    try {
      const response = await apiClient.post('/exchange/buy', { tcNo, currency, amount });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Alış işlemi başarısız');
    }
  },

  sellCurrency: async (tcNo, currency, amount) => {
    try {
      const response = await apiClient.post('/exchange/sell', { tcNo, currency, amount });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Satış işlemi başarısız');
    }
  }
};
