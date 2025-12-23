import axios from 'axios';




const API_BASE_URL = 'http://172.20.10.3:3001/api';

console.log('🌐 API Base URL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    console.log('📤 İstek gönderiliyor:', config.method?.toUpperCase(), config.url);
    console.log('📦 Data:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ İstek hatası:', error);
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

  submitApplication: async (applicationData) => {
    try {
      
      const productMap = {
        'vadeSiz': 'Vadesiz Hesap',
        'vadeli': 'Vadeli Hesap',
        'yatirim': 'Yatırım / Döviz Hesabı',
        'krediKarti': 'Kredi Kartı'
      };

      const wealthMap = {
        'maas': 'Maaş',
        'kira': 'Kira',
        'arac': 'Araç',
        'miras': 'Miras'
      };

      
      let formattedPhone = applicationData.phone || '';
      
      if (formattedPhone.startsWith('+90')) {
          formattedPhone = '0' + formattedPhone.substring(3);
      }
      
      formattedPhone = formattedPhone.replace(/\s/g, '');

      const backendData = {
        tc_kimlik: applicationData.tcNo,
        ad: 'Misafir', 
        soyad: 'Kullanıcı', 
        telefon: formattedPhone,
        hesap_turu: applicationData.selectedProducts.map(p => productMap[p] || p),
        aylik_gelir: applicationData.income,
        mal_varlik: applicationData.wealthSource.map(w => wealthMap[w] || w),
        islem_hacmi: applicationData.transactionVolume,
        egitim_durumu: applicationData.education,
        calisma_durumu: applicationData.employmentStatus,
        calisma_sektoru: applicationData.sector || 'Diğer',
      };
      
      
      if (applicationData.name) {
          backendData.ad = applicationData.name; 
      }
      if (applicationData.surname) {
          backendData.soyad = applicationData.surname;
      }

      
      
      const response = await apiClient.post('/accounts/register', backendData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Başvuru gönderilemedi'
      );
    }
  },

  sendSMS: async (phone) => {
    
    return { success: true, message: 'SMS gönderildi' };
  },

  verifySMS: async (phone, code) => {
    
    if (code === '123456') {
      return { success: true };
    } else {
      throw new Error('SMS doğrulaması başarısız: Kod yanlış');
    }
  },

  verifyFace: async (faceData) => {
    try {
      const response = await apiClient.post('/auth/verify-face', faceData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Yüz doğrulaması başarısız'
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
