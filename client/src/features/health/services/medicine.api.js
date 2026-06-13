import axiosInstance from "../../../lib/api/axiosConfig.js";

export const medicineAPI = {
  // Get all medicines
  getAllMedicines: async (filters = {}) => {
    const response = await axiosInstance.get("/api/health/medicine", {
      params: filters,
    });
    return response.data;
  },

  // Get medicine by ID
  getMedicineById: async (id) => {
    const response = await axiosInstance.get(`/api/health/medicine/${id}`);
    return response.data;
  },

  // Create medicine
  createMedicine: async (formData) => {
    const response = await axiosInstance.post("/api/health/medicine", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  // Update medicine
  updateMedicine: async (id, formData) => {
    const response = await axiosInstance.put(`/api/health/medicine/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  // Delete medicine
  deleteMedicine: async (id) => {
    const response = await axiosInstance.delete(`/api/health/medicine/${id}`);
    return response.data;
  },

  // Search medicines
  searchMedicines: async (query) => {
    const response = await axiosInstance.get("/api/health/medicine/search", {
      params: { q: query },
    });
    return response.data;
  },

  // Get medicines by disease
  getMedicinesByDisease: async (diseaseId) => {
    const response = await axiosInstance.get(`/api/health/medicine/disease/${diseaseId}`);
    return response.data;
  },
};

export default medicineAPI;
