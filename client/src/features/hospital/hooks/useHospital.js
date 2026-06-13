import { useDispatch } from "react-redux";
import { useCallback } from "react";

// ------------------------- Import SLICES -------------------------

// doctor slice ---------------------------
import { setDoctors, setLoading as setDoctorLoading, setError as setDoctorError, addDoctor, updateDoctorInState } from "../slice/doctor.slice.js";

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
    // getAllDoctorBySpecialization,
    // getDoctor,
    deleteDoctor,
    updateDoctor
} from "../services/doctor.api.js";

// APPOINTMENT APIS
import {
    getAllAppointments,
    getUserAppointments,
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
    const handleCreateHospital = useCallback(async (formData) => {
        try {
            dispatch(setHospitalLoading(true))
            const response = await createHospital(formData)
            dispatch(setHospital(response.data))
        } catch (error) {
            dispatch(setHospitalError(error.response?.data?.message || "Failed to create hospital"))
        } finally {
            dispatch(setHospitalLoading(false))
        }
    }, [dispatch]);

    const handleResubmitHospital = useCallback(async (formData) => {
        try {
            dispatch(setHospitalLoading(true))
            const response = await resubmitHospital(formData)
            dispatch(setHospital(response.data))
        } catch (error) {
            dispatch(setHospitalError(error.response?.data?.message || "Failed to resubmit hospital"))
        } finally {
            dispatch(setHospitalLoading(false))
        }
    }, [dispatch]);

    const handleGetHospitalAdmin = useCallback(async () => {
        try {
            dispatch(setHospitalLoading(true));
            const response = await getHospitalAdmin();
            dispatch(setHospitalAdmin(response.data?.user));
        } catch (error) {
            dispatch(setHospitalError(error.response?.data?.message || "Failed to get hospital admin"));
        } finally {
            dispatch(setHospitalLoading(false));
        }
    }, [dispatch]);

    const handleGetHospital = useCallback(async () => {
        try {
            dispatch(setHospitalLoading(true));
            const response = await getHospital();
            dispatch(setHospital(response.data));
        } catch (error) {
            dispatch(setHospitalError(error.response?.data?.message || "Failed to get hospital"));
        } finally {
            dispatch(setHospitalLoading(false));
        }
    }, [dispatch]);

    // ── DOCTOR HANDLERS ─────────────────────────────────────────────
    const handleCreateDoctor = useCallback(async (formData) => {
        try {
            dispatch(setDoctorLoading(true));
            const response = await createDoctor(formData);

            if (response.data?.success) {
                dispatch(addDoctor(response.data.data));
            }
        } catch (error) {
            dispatch(setDoctorError(error.response?.data?.message || "Failed to create doctor"));
        } finally {
            dispatch(setDoctorLoading(false));
        }
    }, [dispatch]);

    const handleGetAllDoctors = useCallback(async (hospitalId) => {
        try {
            dispatch(setDoctorLoading(true));
            const response = await getAllDoctors({ hospitalId: hospitalId });
            dispatch(setDoctors(response.data?.data || []));
        } catch (error) {
            dispatch(setDoctorError(error.response?.data?.message || "Failed to get doctors"));
        } finally {
            dispatch(setDoctorLoading(false));
        }
    }, [dispatch]);

    const handleDeleteDoctor = useCallback(async (doctorId) => {
        try {
            dispatch(setDoctorLoading(true));
            await deleteDoctor(doctorId);
        } catch (error) {
            dispatch(setDoctorError(error.response?.data?.message || "Failed to delete doctor"));
        } finally {
            dispatch(setDoctorLoading(false));
        }
    }, [dispatch]);

    // ── APPOINTMENT HANDLERS ────────────────────────────────────────
    const handleGetAllAppointments = useCallback(async (hospitalId) => {
        try {
            dispatch(setAppointmentLoading(true));
            const response = await getAllAppointments(hospitalId);
            dispatch(setAppointments(response.data?.data));
        } catch (error) {
            dispatch(setAppointmentError(error.response?.data?.message || "Failed to fetch appointments"));
        } finally {
            dispatch(setAppointmentLoading(false));
        }
    }, [dispatch]);

    const handleGetUserAppointments = useCallback(async () => {
        try {
            dispatch(setAppointmentLoading(true));
            const response = await getUserAppointments();
            dispatch(setAppointments(response.data?.data));
        } catch (error) {
            dispatch(setAppointmentError(error.response?.data?.message || "Failed to fetch appointments"));
        } finally {
            dispatch(setAppointmentLoading(false));
        }
    }, [dispatch]);

    const handleUpdateAppointmentStatus = useCallback(async (id, status) => {
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
    }, [dispatch]);

    const HandleApproveAppointement = useCallback(async (appointmentId, date, time) => {
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
    }, [dispatch]);

    const HandleRejectAppointement = useCallback(async (appointmentId) => {
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
    }, [dispatch]);

    const handleDeleteAppointment = useCallback(async (id) => {
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
    }, [dispatch]);

    const handleReschedule = useCallback(async (id, date, time) => {
        try {
            dispatch(setAppointmentError(null));
            dispatch(setAppointmentLoading(true));
            await rescheduleAppointment(id, date, time);
            dispatch(updateAppointmentInState({ id, date, time }));
        } catch (error) {
            dispatch(setAppointmentError(error.response?.data?.message || "Failed to reschedule"));
        } finally {
            dispatch(setAppointmentLoading(false));
        }
    }, [dispatch]);

    const handleUpdateDoctor = useCallback(async (doctorId, formData) => {
        try {
            dispatch(setDoctorError(null));
            dispatch(setDoctorLoading(true));
            const response = await updateDoctor(doctorId, formData);
            if (response.data?.success) {
                dispatch(updateDoctorInState(response.data.data));
            }
        } catch (error) {
            dispatch(setDoctorError(error.response?.data?.message || "Failed to update doctor"));
            throw error;
        } finally {
            dispatch(setDoctorLoading(false));
        }
    }, [dispatch]);

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
        handleUpdateDoctor,

        // appointment handlers
        handleGetAllAppointments,
        handleGetUserAppointments,
        handleUpdateAppointmentStatus,
        handleDeleteAppointment,
        handleReschedule,
        HandleApproveAppointement,
        HandleRejectAppointement
    }
}
