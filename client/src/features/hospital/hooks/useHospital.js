import { useDispatch, useSelector } from "react-redux";
import { setDoctors, setLoading as setDoctorLoading, setError as setDoctorError } from "../slice/doctor.slice.js";
import { 
    setAppointments, 
    setLoading as setAppointmentLoading, 
    setError as setAppointmentError,
    updateAppointmentStatusInState,
    removeAppointmentFromState
} from "../slice/appointment.slice.js";
import { 
    createDoctor, 
    getAllDoctors, 
    getAllDoctorBySpecialization, 
    getDoctor, 
    deleteDoctor 
} from "../services/doctor.api.js";
import { 
    getAllAppointments, 
    updateAppointmentStatus, 
    deleteAppointment, 
    rescheduleAppointment 
} from "../services/appointment.api.js";

export const useHospital = () => {
    const dispatch = useDispatch();

    // ── DOCTOR HANDLERS ─────────────────────────────────────────────
    async function handleCreateDoctor(formData) {
        try {
            dispatch(setDoctorLoading(true));
            const response = await createDoctor(formData);
            dispatch(setDoctors(prev => [...prev, response.data]));
        } catch (error) {
            dispatch(setDoctorError(error.response?.data?.message || "Failed to create doctor"));
        } finally {
            dispatch(setDoctorLoading(false));
        }
    }

    async function handleGetAllDoctors(hospitalId) {
        try {
            dispatch(setDoctorLoading(true));
            const response = await getAllDoctors(hospitalId);
            dispatch(setDoctors(response.data));
        } catch (error) {
            dispatch(setDoctorError(error.response?.data?.message || "Failed to get doctors"));
        } finally {
            dispatch(setDoctorLoading(false));
        }
    }

    async function handleDeleteDoctor(doctorId) {
        try {
            dispatch(setDoctorLoading(true));
            await deleteDoctor(doctorId);
            dispatch(setDoctors((prev) => (prev.filter((doctor) => doctor._id !== doctorId))))
        } catch (error) {
            dispatch(setDoctorError(error.response?.data?.message || "Failed to delete doctor"));
        } finally {
            dispatch(setDoctorLoading(false));
        }
    }

    // ── APPOINTMENT HANDLERS ────────────────────────────────────────
    async function handleGetAllAppointments(hospitalId) {
        try {
            dispatch(setAppointmentLoading(true));
            const response = await getAllAppointments(hospitalId);
            dispatch(setAppointments(response.data));
        } catch (error) {
            dispatch(setAppointmentError(error.response?.data?.message || "Failed to fetch appointments"));
        } finally {
            dispatch(setAppointmentLoading(false));
        }
    }

    async function handleUpdateAppointmentStatus(id, status) {
        try {
            dispatch(setAppointmentLoading(true));
            await updateAppointmentStatus(id, status);
            dispatch(updateAppointmentStatusInState({ id, status }));
        } catch (error) {
            dispatch(setAppointmentError(error.response?.data?.message || "Failed to update status"));
        } finally {
            dispatch(setAppointmentLoading(false));
        }
    }

    async function handleDeleteAppointment(id) {
        try {
            dispatch(setAppointmentLoading(true));
            await deleteAppointment(id);
            dispatch(removeAppointmentFromState(id));
        } catch (error) {
            dispatch(setAppointmentError(error.response?.data?.message || "Failed to delete appointment"));
        } finally {
            dispatch(setAppointmentLoading(false));
        }
    }

    async function handleReschedule(id, date, time) {
        try {
            dispatch(setAppointmentLoading(true));
            await rescheduleAppointment(id, date, time);
            // Refreshing all appointments for simplicity or update state if needed
            // For now, let's assume we fetch again or update specifically
        } catch (error) {
            dispatch(setAppointmentError(error.response?.data?.message || "Failed to reschedule"));
        } finally {
            dispatch(setAppointmentLoading(false));
        }
    }

    return {
        handleCreateDoctor,
        handleGetAllDoctors,
        handleDeleteDoctor,
        handleGetAllAppointments,
        handleUpdateAppointmentStatus,
        handleDeleteAppointment,
        handleReschedule
    }
}
