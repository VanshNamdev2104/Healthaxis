import { configureStore } from "@reduxjs/toolkit";
import hospitalReducer from "../../features/hospital/slice/doctor.slice.js";
import appointmentReducer from "../../features/hospital/slice/appointment.slice.js";
import authReducer from "../../features/auth/slice/auth.slice.js"

export const store = configureStore({
    reducer: {
        hospital: hospitalReducer,
        appointment: appointmentReducer,
        auth: authReducer,
    }
});