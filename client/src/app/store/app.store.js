import { configureStore } from "@reduxjs/toolkit";
import doctorReducer from "../../features/hospital/slice/doctor.slice.js";
import appointmentReducer from "../../features/hospital/slice/appointment.slice.js";
import authReducer from "../../features/auth/slice/auth.slice.js";
import hospitalReducer from "../../features/hospital/slice/hospital.slice.js";
import diseaseReducer from "../../features/health/slice/disease.slice.js";
import medicineReducer from "../../features/health/slice/medicine.slice.js";

export const store = configureStore({
    reducer: {
        doctor: doctorReducer,
        appointment: appointmentReducer,
        auth: authReducer,
        hospital: hospitalReducer,
        disease: diseaseReducer,
        medicine: medicineReducer,
    }
});