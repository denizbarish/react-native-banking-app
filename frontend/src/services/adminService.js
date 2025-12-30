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

  async updateSystemSettings(data) {
    try {
      const response = await apiClient.put('/admin/settings', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ayarlar güncellenemedi');
    }
  },

    // --- Card Applications ---
    async getCardApplications() {
        const response = await apiClient.get('/admin/card-applications');
        return response.data;
    },

    async approveCardApplication(id) {
        const response = await apiClient.put(`/admin/card-applications/${id}/approve`);
        return response.data;
    },

    async rejectCardApplication(id) {
        const response = await apiClient.put(`/admin/card-applications/${id}/reject`);
        return response.data;
    }
};
