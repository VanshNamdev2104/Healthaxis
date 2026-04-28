import { useDispatch, useSelector } from "react-redux";

// ------------------------- Import SLICES -------------------------

// doctor slice ---------------------------
import { setDoctors, setLoading as setDoctorLoading, setError as setDoctorError, addDoctor } from "../slice/doctor.slice.js";

// appointment slice ---------------------------
import { 
    setAppointments, setLoading as setAppointmentLoading, setError as setAppointmentError, updateAppointmentInState, removeAppointmentFromState
} from "../slice/appointment.slice.js";

// hospital slice ---------------------------
import { setHospitalAdmin, setHospital, setLoading as setHospitalLoading, setError as setHospitalError } from "../slice/hospital.slice.js";

// -------------------------------Import APIs ------------------------ 

// DOCTORS APIS
import {
    createDoctor,
    getAllDoctors,
    getAllDoctorBySpecialization,
    getDoctor,
    deleteDoctor
} from "../services/doctor.api.js";

// APPOINTMENT APIS
import {
    getAllAppointments,
    updateAppointmentStatus,
    deleteAppointment,
    rescheduleAppointment,
    approveAppointment,
    rejectAppointment
} from "../services/appointment.api.js";

// HOSPITAL APIS
import {
    createHospital,
    getHospitalAdmin,
    getHospital,
    resubmitHospital
} from "../services/hospital.api.js"


export const useHospital = () => {
    const dispatch = useDispatch();


    // ── HOSPITAL HANDLERS ─────────────────────────────────────────────
    async function handleCreateHospital(formData) {
        try {
            dispatch(setHospitalLoading(true))
            const response = await createHospital(formData)
            dispatch(setHospital(response.data))
        } catch (error) {
            dispatch(setHospitalError(error.response?.data?.message || "Failed to create hospital"))
        } finally {
            dispatch(setHospitalLoading(false))
        }
    }

    async function handleResubmitHospital(formData) {
        try {
            dispatch(setHospitalLoading(true))
            const response = await resubmitHospital(formData)
            dispatch(setHospital(response.data))
        } catch (error) {
            dispatch(setHospitalError(error.response?.data?.message || "Failed to resubmit hospital"))
        } finally {
            dispatch(setHospitalLoading(false))
        }
    }

    async function handleGetHospitalAdmin() {
        try {
            dispatch(setHospitalLoading(true));
            const response = await getHospitalAdmin();
            dispatch(setHospitalAdmin(response.data?.user));
        } catch (error) {
            dispatch(setHospitalError(error.response?.data?.message || "Failed to get hospital admin"));
        } finally {
            dispatch(setHospitalLoading(false));
        }
    }

    async function handleGetHospital() {
        try {
            dispatch(setHospitalLoading(true));
            const response = await getHospital();
            dispatch(setHospital(response.data));
        } catch (error) {
            dispatch(setHospitalError(error.response?.data?.message || "Failed to get hospital"));
        } finally {
            dispatch(setHospitalLoading(false));
        }
    }

    // ── DOCTOR HANDLERS ─────────────────────────────────────────────
    async function handleCreateDoctor(formData) {
        try {
            dispatch(setDoctorLoading(true));
            const response = await createDoctor(formData);
            // console.log("check", response);

            if (response.data?.success) {
                dispatch(addDoctor(response.data.data));
            }
        } catch (error) {
            dispatch(setDoctorError(error.response?.data?.message || "Failed to create doctor"));
        } finally {
            dispatch(setDoctorLoading(false));
        }
    }

    async function handleGetAllDoctors(hospitalId) {
        try {
            dispatch(setDoctorLoading(true));
            const response = await getAllDoctors({ hospitalId: hospitalId });
            dispatch(setDoctors(response.data?.data || []));
        } catch (error) {
            dispatch(setDoctorError(error.response?.data?.message || "Failed to get doctors"));
        } finally {
            dispatch(setDoctorLoading(false));
        }
    }

    async function handleDeleteDoctor(doctorId) {
        // console.log("check",doctorId)
        try {
            dispatch(setDoctorLoading(true));
            await deleteDoctor(doctorId);
        } catch (error) {
            dispatch(setDoctorError(error.response?.data?.message || "Failed to delete doctor"));
        } finally {
            dispatch(setDoctorLoading(false));
        }
    }

    // ── APPOINTMENT HANDLERS ────────────────────────────────────────
    async function handleGetAllAppointments(hospitalId) {
        try {
            // console.log("check useHospital.js 128",hospitalId);
            dispatch(setAppointmentLoading(true));
            const response = await getAllAppointments(hospitalId);

            // console.log("check useHospital.js 128",response);

            dispatch(setAppointments(response.data?.data));
        } catch (error) {
            dispatch(setAppointmentError(error.response?.data?.message || "Failed to fetch appointments"));
        } finally {
            dispatch(setAppointmentLoading(false));
        }
    }

    async function handleUpdateAppointmentStatus(id, status) {
        try {
            dispatch(setAppointmentError(null));
            dispatch(setAppointmentLoading(true));
            await updateAppointmentStatus(id, status);
            dispatch(updateAppointmentInState({ id, status }));
        } catch (error) {
            dispatch(setAppointmentError(error.response?.data?.message || "Failed to update status"));
        } finally {
            dispatch(setAppointmentLoading(false));
        }
    }

    async function HandleApproveAppointement(appointmentId, date, time) {
        try {
            dispatch(setAppointmentError(null));
            dispatch(setAppointmentLoading(true));
            await approveAppointment(appointmentId, date, time);
            dispatch(updateAppointmentInState({ id: appointmentId, status: 'approved', date, time }));
        } catch (error) {
            dispatch(setAppointmentError(error.response?.data?.message || "Failed to approve appointment"));
        } finally {
            dispatch(setAppointmentLoading(false));
        }
    }

    async function HandleRejectAppointement(appointmentId) {
        try {
            dispatch(setAppointmentError(null));
            dispatch(setAppointmentLoading(true));
            await rejectAppointment(appointmentId);
            dispatch(updateAppointmentInState({ id: appointmentId, status: 'rejected' }));
        } catch (error) {
            dispatch(setAppointmentError(error.response?.data?.message || "Failed to reject appointment"));
        } finally {
            dispatch(setAppointmentLoading(false));
        }
    }

    async function handleDeleteAppointment(id) {
        try {
            dispatch(setAppointmentError(null));
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
        // hospital admin handlers
        handleGetHospitalAdmin,
        handleGetHospital,
        handleCreateHospital,
        handleResubmitHospital,

        // doctor handlers
        handleCreateDoctor,
        handleGetAllDoctors,
        handleDeleteDoctor,

        // appointment handlers
        handleGetAllAppointments,
        handleUpdateAppointmentStatus,
        handleDeleteAppointment,
        handleReschedule,
        HandleApproveAppointement,
        HandleRejectAppointement
    }
}
