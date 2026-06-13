import { createSlice } from "@reduxjs/toolkit";



const appointmentSlice = createSlice({
    name: "appointment",
    initialState: {
        appointments: [], // Injecting sample data for design verification
        loading: false,
        error: null,
    },
    reducers: {
        setAppointments: (state, action) => {
            state.appointments = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        updateAppointmentInState: (state, action) => {
            const { id, ...updates } = action.payload;
            const index = state.appointments.findIndex(app => app._id === id);
            if (index !== -1) {
                state.appointments[index] = { ...state.appointments[index], ...updates };
            }
        },
        removeAppointmentFromState: (state, action) => {
            state.appointments = state.appointments.filter(app => app._id !== action.payload);
        }
    }
});

export const { 
    setAppointments, 
    setLoading, 
    setError, 
    updateAppointmentInState, 
    removeAppointmentFromState 
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
