import axiosInstance from "../../../lib/api/axiosConfig.js";

export async function getHospitalAdmin() {
    try {
       const response = await axiosInstance.get("/api/hospital/admin"); 
       return response;
    } catch (error) {
        throw error.response?.data?.message || "Failed to get Hospital Admin";
    }
}

export async function getHospital() {
    try {
       const response = await axiosInstance.get("/api/hospital/me"); 
       return response;
    } catch (error) {
        throw error.response?.data?.message || "Failed to get Hospital";
    }
}

export async function createHospital(formData) {
    try {
        const response = await axiosInstance.post("/api/hospital/", formData);
        return response;
    } catch (error) {
        throw error.response?.data?.message || "Failed to create new Hospital";
    }
}

export async function getAllHospitals() {
    try {
        const response = await axiosInstance.get("/api/hospital/");
        return response;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch hospitals";
    }
}

export async function resubmitHospital(formData) {
    try {
        const response = await axiosInstance.put("/api/hospital/resubmit", formData);
        return response;
    } catch (error) {
        throw error.response?.data?.message || "Failed to resubmit Hospital";
    }
}
