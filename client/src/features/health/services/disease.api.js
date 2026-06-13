import axiosInstance from "../../../lib/api/axiosConfig.js";

export const diseaseAPI = {
  // Get all diseases
  getAllDiseases: async (filters = {}) => {
    const response = await axiosInstance.get("/api/health/disease", {
      params: filters,
    });
    console.log("Check Disease api 11", response.data);
    return response.data;
  },

  // Get disease by ID
  getDiseaseById: async (id) => {
    const response = await axiosInstance.get(`/api/health/disease/${id}`);
    return response.data;
  },

  // Create disease
  createDisease: async (formData) => {
    const response = await axiosInstance.post("/api/health/disease", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  // Update disease
  updateDisease: async (id, formData) => {
    const response = await axiosInstance.put(`/api/health/disease/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  // Delete disease
  deleteDisease: async (id) => {
    const response = await axiosInstance.delete(`/api/health/disease/${id}`);
    return response.data;
  },

  // Search diseases
  searchDiseases: async (query) => {
    const response = await axiosInstance.get("/api/health/disease/search", {
      params: { q: query },
    });
    return response.data;
  },
};

export default diseaseAPI;
