import { useDispatch, useSelector } from "react-redux";
import {setDoctors, setLoading, setError} from "../slice/hospital.slice.js"
import {createDoctor, getAllDoctors, getAllDoctorBySpecialization, getDoctor, deleteDoctor} from "../services/hospital.api.js"

export const useHospital = () => {
    const dispatch = useDispatch();

    async function handleCreateDoctor(formData) {
        try {
            dispatch(setLoading(true));
            const response = await createDoctor(formData);
            dispatch(setDoctors(response.data));
            
        } catch (error) {
            dispatch(setError(error));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetAllDoctors(hospitalId) {
        try {
            dispatch(setLoading(true));
            const response = await getAllDoctors(hospitalId);
            dispatch(setDoctors(response.data));
            
        } catch (error) {
            dispatch(setError(error));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetAllDoctorBySpecialization(specialization) {
        try {
            dispatch(setLoading(true));
            const response = await getAllDoctorBySpecialization(specialization);
            dispatch(setDoctors(response.data));
            
        } catch (error) {
            dispatch(setError(error));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetDoctor(doctorId) {
        try {
            dispatch(setLoading(true));
            const response = await getDoctor(doctorId);
            dispatch(setDoctors(response.data));
            
        } catch (error) {
            dispatch(setError(error));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleDeleteDoctor(doctorId) {
        try {
            dispatch(setLoading(true));
            const response = await deleteDoctor(doctorId);
            dispatch(setDoctors((prev)=>(prev.filter((doctor)=>doctor._id !== doctorId))))
        } catch (error) {
            dispatch(setError(error));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        handleCreateDoctor,
        handleGetAllDoctors,
        handleGetAllDoctorBySpecialization,
        handleGetDoctor,
        handleDeleteDoctor
    }
}
