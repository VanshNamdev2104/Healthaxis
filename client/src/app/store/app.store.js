import { configureStore} from "@reduxjs/toolkit";
import hospitalReducer from "../../features/hospital/slice/hospital.slice.js"

export const store = configureStore({
    reducer: {
        hospital: hospitalReducer,
    }
})