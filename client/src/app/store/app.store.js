import { configureStore} from "@reduxjs/toolkit";
import hospitalReducer from "../../features/hospital/slice/hospital.slice.js"
import authReducer from "../../features/auth/slice/auth.slice.js"

export const store = configureStore({
    reducer: {
        hospital: hospitalReducer,
        auth: authReducer,
    }
})