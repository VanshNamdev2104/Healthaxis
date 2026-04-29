import axios from "axios"

const api = axios.create({
    baseURL : `${import.meta.env.VITE_API_URL || "https://healthaxis-14r9.onrender.com"}/api/hospital`,
    withCredentials: true
})

export async function getHospitalAdmin() {
    try {
       const response = await api.get("/admin", {
        withCredentials: true
       }) 
       return response;
    } catch (error) {
        throw error.response?.data?.message || "Failed to get Hospital Admin";
    }
}

export async function getHospital() {
    try {
       const response = await api.get("/me", {
        withCredentials: true
       }) 
       return response;
    } catch (error) {
        throw error.response?.data?.message || "Failed to get Hospital";
    }
}

export async function createHospital(formData) {
    try {
        const response = await api.post("/", formData, {
            withCredentials: true
        })
        return response;
    } catch (error) {
        throw error.response?.data?.message || "Failed to create new Hospital";
    }
}
export async function getAllHospitals() {
    try {
        const response = await api.get("/", {
            withCredentials: true
        });
        return response;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch hospitals";
    }
}

export async function resubmitHospital(formData) {
    try {
        const response = await api.put("/resubmit", formData, {
            withCredentials: true
        })
        return response;
    } catch (error) {
        throw error.response?.data?.message || "Failed to resubmit Hospital";
    }
}
