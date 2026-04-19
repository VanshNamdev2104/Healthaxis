import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true
});

export async function createDoctor({name, email, contect, specialization, experience, fee, isAvailable}) {
    try {
        const response = await api.post("/doctor", {name, email, contect, specialization, experience, fee, isAvailable});
        return response
    } catch (error) {
        throw error.response?.data?.message || "Failed to create doctor";
    }
}

export async function getAllDoctors({ hospitalId }) {
    try {
        const response = await api.get(`/doctor/hospital/${hospitalId}`);
        return response
    } catch (error) {
        throw error || "Failed to fetch doctors";
    }
}

export async function getAllDoctorBySpecialization({ specialization }) {
    try {
        const response = await api.get(`/doctor/specialization/${specialization}`);
        return response
    } catch (error) {
        throw error || "Failed to fetch doctors of specialization";
    }
}

export async function getDoctor({ doctorId }) {
    try {
        const response = await api.get(`/doctor/${doctorId}`);
        return response
    } catch (error) {
        throw error || "Failed to fetch doctor";
    }
}

export async function deleteDoctor({ doctorId }) {
    try {
        const response = await api.delete(`/doctor/${doctorId}`);
        return response
    } catch (error) {
        throw error || "Failed to delete doctor";
    }
}
