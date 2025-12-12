import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (tcNo, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        tcNo,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Giriş yapılamadı'
      );
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Kayıt oluşturulamadı'
      );
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Çıkış yapılamadı'
      );
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', {
        email,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'İstek gönderilemedi'
      );
    }
  },
};

export const accountService = {
  getAccounts: async () => {
    try {
      const response = await apiClient.get('/accounts');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Hesaplar getirilemedi'
      );
    }
  },

  getAccountById: async (accountId) => {
    try {
      const response = await apiClient.get(`/accounts/${accountId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Hesap detayı getirilemedi'
      );
    }
  },

  createAccount: async (accountData) => {
    try {
      const response = await apiClient.post('/accounts', accountData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Hesap oluşturulamadı'
      );
    }
  },
};

export const transactionService = {
  getTransactions: async (accountId) => {
    try {
      const response = await apiClient.get('/transactions', {
        params: { accountId },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'İşlemler getirilemedi'
      );
    }
  },

  getTransactionById: async (transactionId) => {
    try {
      const response = await apiClient.get(`/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'İşlem detayı getirilemedi'
      );
    }
  },

  createTransaction: async (transactionData) => {
    try {
      const response = await apiClient.post('/transactions', transactionData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'İşlem gerçekleştirilemedi'
      );
    }
  },
};

export default apiClient;
