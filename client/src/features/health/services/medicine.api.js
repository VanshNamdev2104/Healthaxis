import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const medicineAPI = {
  // Get all medicines
  getAllMedicines: async (filters = {}) => {
    const response = await axios.get(`${API_URL}/api/health/medicine`, {
      params: filters,
    });
    return response.data;
  },

  // Get medicine by ID
  getMedicineById: async (id) => {
    const response = await axios.get(`${API_URL}/api/health/medicine/${id}`);
    return response.data;
  },

  // Create medicine
  createMedicine: async (formData) => {
    const response = await axios.post(`${API_URL}/api/health/medicine`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true
    });
    return response.data;
  },

  // Update medicine
  updateMedicine: async (id, formData) => {
    const response = await axios.put(`${API_URL}/api/health/medicine/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true
    });
    return response.data;
  },

  // Delete medicine
  deleteMedicine: async (id) => {
    const response = await axios.delete(`${API_URL}/api/health/medicine/${id}`, {
      withCredentials: true
    });
    return response.data;
  },

  // Search medicines
  searchMedicines: async (query) => {
    const response = await axios.get(`${API_URL}/api/health/medicine/search`, {
      params: { q: query },
    });
    return response.data;
  },

  // Get medicines by disease
  getMedicinesByDisease: async (diseaseId) => {
    const response = await axios.get(`${API_URL}/api/health/medicine/disease/${diseaseId}`);
    return response.data;
  },
};

export default medicineAPI;
