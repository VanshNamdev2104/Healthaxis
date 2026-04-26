import { createSlice } from "@reduxjs/toolkit";

export const doctorSlice = createSlice({
    name: "doctor",
    initialState: {
        loading: false,
        error: null,
        doctors: [],
        
    },
    reducers: {
        setDoctors: (state, action) => {
            state.doctors = action.payload;
        },
        addDoctor: (state, action) => {
            if (Array.isArray(state.doctors)) {
                state.doctors.push(action.payload);
            } else {
                state.doctors = [action.payload];
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    },
});

export const { setDoctors, setLoading, setError, addDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
