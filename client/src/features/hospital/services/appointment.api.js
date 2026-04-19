import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api/v1/hospital", // Adjust based on server config if needed
    withCredentials: true,
});

export const getAllAppointments = async (hospitalId) => {
    return await API.get(`/appointments/${hospitalId}`);
};

export const updateAppointmentStatus = async (appointmentId, status) => {
    return await API.patch(`/appointments/${appointmentId}/status`, { status });
};

export const deleteAppointment = async (appointmentId) => {
    return await API.delete(`/appointments/${appointmentId}`);
};

export const rescheduleAppointment = async (appointmentId, date, time) => {
    return await API.patch(`/appointments/${appointmentId}/reschedule`, { date, time });
};
