import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "https://healthaxis-14r9.onrender.com"}/api`,
    withCredentials: true
});

export async function createDoctor({name, email, contact, specialization, experience, fee, isAvailable}) {
    try {
        const response = await api.post("/doctors", {name, email, contact, specialization, experience, fee, isAvailable});
        return response
    } catch (error) {
        throw error.response?.data?.message || "Failed to create doctor";
    }
}

export async function getAllDoctors({ hospitalId }) {
    try {
        const response = await api.get(`/doctors/hospital/${hospitalId}`)
        return response
    } catch (error) {
        throw error || "Failed to fetch doctors";
    }
}

export async function getAllDoctorBySpecialization({ specialization }) {
    try {
        const response = await api.get(`/doctors/specialization/${specialization}`);
        return response
    } catch (error) {
        throw error || "Failed to fetch doctors of specialization";
    }
}

export async function getDoctor({ doctorId }) {
    try {
        const response = await api.get(`/doctors/${doctorId}`);
        return response
    } catch (error) {
        throw error || "Failed to fetch doctor";
    }
}

export async function deleteDoctor( doctorId ) {
    try {
        const response = await api.delete(`/doctors/${doctorId}`);
        return response
    } catch (error) {
        throw error || "Failed to delete doctor";
    }
}
