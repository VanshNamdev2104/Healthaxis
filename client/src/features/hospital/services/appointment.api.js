import axiosInstance from "../../../lib/api/axiosConfig.js";

export const createAppointment = async (doctorId, formData) => {
    return await axiosInstance.post(`/api/appointments/${doctorId}`, formData);
};

export const getUserAppointments = async () => {
    return await axiosInstance.get(`/api/appointments/user`);
};

export const getAllAppointments = async () => {
    return await axiosInstance.get(`/api/appointments/hospital`);
};

export const updateAppointmentStatus = async (appointmentId, status) => {
    return await axiosInstance.patch(`/api/appointments/${appointmentId}/status`, { status });
};

export const approveAppointment = async (appointmentId, date, time) => {
    return await axiosInstance.patch(`/api/appointments/${appointmentId}/approve`, { date, time });
};

export const rejectAppointment = async (appointmentId) => {
    return await axiosInstance.patch(`/api/appointments/${appointmentId}/reject`);
};

export const deleteAppointment = async (appointmentId) => {
    return await axiosInstance.delete(`/api/appointments/${appointmentId}`);
};

export const rescheduleAppointment = async (appointmentId, date, time) => {
    return await axiosInstance.patch(`/api/appointments/${appointmentId}/reschedule`, { date, time });
};
