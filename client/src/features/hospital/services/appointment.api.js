import axios from "axios";

const API = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

export const getAllAppointments = async (hospitalId) => {
    return await API.get(`/appointment/hospital`);
};

export const updateAppointmentStatus = async (appointmentId, status) => {
    return await API.patch(`/appointment/${appointmentId}/status`, { status });
};

export const approveAppointment = async (appointmentId,date,time) => {
    return await API.patch(`/appointment/${appointmentId}/approve`,{date ,time});
};

export const rejectAppointment = async (appointmentId) => {
    return await API.patch(`/appointment/${appointmentId}/reject`);
};

export const deleteAppointment = async (appointmentId) => {
    return await API.delete(`/appointment/${appointmentId}`);
};

export const rescheduleAppointment = async (appointmentId, date, time) => {
    return await API.patch(`/appointment/${appointmentId}/reschedule`, { date, time });
};
