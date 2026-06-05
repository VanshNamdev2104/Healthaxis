import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "https://healthaxis-14r9.onrender.com"}/api`,
    withCredentials: true
});

export const createAppointment = async (doctorId, formData) => {
    return await api.post(`/appointments/${doctorId}`, formData);
};

export const getUserAppointments = async () => {
    return await api.get(`/appointments/user`);
};

export const getAllAppointments = async (hospitalId) => {
    return await api.get(`/appointments/hospital`);
};

export const updateAppointmentStatus = async (appointmentId, status) => {
    return await api.patch(`/appointments/${appointmentId}/status`, { status });
};

export const approveAppointment = async (appointmentId, date, time) => {
    return await api.patch(`/appointments/${appointmentId}/approve`, { date, time });
};

export const rejectAppointment = async (appointmentId) => {
    return await api.patch(`/appointments/${appointmentId}/reject`);
};

export const deleteAppointment = async (appointmentId) => {
    return await api.delete(`/appointments/${appointmentId}`);
};

export const rescheduleAppointment = async (appointmentId, date, time) => {
    return await api.patch(`/appointments/${appointmentId}/reschedule`, { date, time });
};
