import axiosInstance from "../../../lib/api/axiosConfig.js";

export async function createDoctor({name, email, contact, specialization, experience, fee, isAvailable}) {
    try {
        const response = await axiosInstance.post("/api/doctors", {name, email, contact, specialization, experience, fee, isAvailable});
        return response;
    } catch (error) {
        throw error.response?.data?.message || "Failed to create doctor";
    }
}

export async function getAllDoctors({ hospitalId }) {
    try {
        const response = await axiosInstance.get(`/api/doctors/hospital/${hospitalId}`);
        return response;
    } catch (error) {
        throw error || "Failed to fetch doctors";
    }
}

export async function getAllDoctorBySpecialization({ specialization }) {
    try {
        const response = await axiosInstance.get(`/api/doctors/specialization/${specialization}`);
        return response;
    } catch (error) {
        throw error || "Failed to fetch doctors of specialization";
    }
}

export async function getDoctor({ doctorId }) {
    try {
        const response = await axiosInstance.get(`/api/doctors/${doctorId}`);
        return response;
    } catch (error) {
        throw error || "Failed to fetch doctor";
    }
}

export async function deleteDoctor( doctorId ) {
    try {
        const response = await axiosInstance.delete(`/api/doctors/${doctorId}`);
        return response;
    } catch (error) {
        throw error || "Failed to delete doctor";
    }
}

export async function updateDoctor( doctorId, {name, email, contact, specialization, experience, fee} ) {
    try {
        const response = await axiosInstance.put(`/api/doctors/${doctorId}`, {name, email, contact, specialization, experience, fee});
        return response;
    } catch (error) {
        throw error.response?.data?.message || "Failed to update doctor";
    }
}
