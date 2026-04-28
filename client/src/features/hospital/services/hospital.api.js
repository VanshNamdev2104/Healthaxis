import axios from "axios"

const api = axios.create({
    baseURL : "/api/hospital",
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
