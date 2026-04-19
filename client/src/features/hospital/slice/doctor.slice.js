import { createSlice } from "@reduxjs/toolkit";

export const hospitalSlice = createSlice({
    name: "hospital",
    initialState: {
        loading: false,
        error: null,
        doctors: [],
        hospitalAdmin: ""
    },
    reducers: {
        setDoctors: (state, action) => {
            state.doctors = action.payload;
        },
        addDoctor: (state, action) => {
            state.doctors.push(action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setHospitalAdmin: (state, action) => {
            state.hospitalAdmin = action.payload;
        },
    },
});

export const { setDoctors, setLoading, setError, addDoctor, setHospitalAdmin } = hospitalSlice.actions;
export default hospitalSlice.reducer;
