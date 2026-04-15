import { createSlice } from "@reduxjs/toolkit";

export const hospitalSlice = createSlice({
    name: "hospital",
    initialState: {
        loading: false,
        error: null,
        doctors: [],
    },
    reducers: {
        setDoctors: (state, action) => {
            state.doctors = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setDoctors, setLoading, setError } = hospitalSlice.actions;
export default hospitalSlice.reducer;
