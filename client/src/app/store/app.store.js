import { configureStore } from "@reduxjs/toolkit";
import hospitalReducer from "../../features/hospital/slice/doctor.slice.js";
import appointmentReducer from "../../features/hospital/slice/appointment.slice.js";

export const store = configureStore({
    reducer: {
        hospital: hospitalReducer,
        appointment: appointmentReducer,
    }
});