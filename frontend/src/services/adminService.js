import apiClient from './authService';

export const adminService = {
  getApplications: async () => {
    try {
      const response = await apiClient.get('/admin/applications');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Başvurular getirilemedi');
    }
  },

  updateApplicationStatus: async (id, status) => {
    try {
      const response = await apiClient.put(`/admin/applications/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Durum güncellenemedi');
    }
  },

  getSystemSettings: async () => {
    try {
      const response = await apiClient.get('/admin/settings');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ayarlar getirilemedi');
    }
  },

  updateSystemSettings: async (settings) => {
    try {
      const response = await apiClient.put('/admin/settings', settings);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ayarlar güncellenemedi');
    }
  }
};
