import { createSlice } from "@reduxjs/toolkit";

const sampleAppointments = [
    {
        _id: "1",
        patientName: "Alice Henderson",
        age: 28,
        gender: "female",
        doctor: { name: "Ananya Sharma", specialization: "Cardiology" },
        date: "2026-04-18",
        time: "10:30 AM",
        status: "pending"
    },
    {
        _id: "2",
        patientName: "Michael Scott",
        age: 45,
        gender: "male",
        doctor: { name: "Rajat Verma", specialization: "Orthopedics" },
        date: "2026-04-18",
        time: "11:45 AM",
        status: "approved"
    },
    {
        _id: "3",
        patientName: "Sarah Connor",
        age: 35,
        gender: "female",
        doctor: { name: "Sneha Patel", specialization: "Pediatrics" },
        date: "2026-04-19",
        time: "09:15 AM",
        status: "rejected"
    },
    {
        _id: "4",
        patientName: "John Doe",
        age: 52,
        gender: "male",
        doctor: { name: "Ananya Sharma", specialization: "Cardiology" },
        date: "2026-04-19",
        time: "02:00 PM",
        status: "approved"
    }
];

const appointmentSlice = createSlice({
    name: "appointment",
    initialState: {
        appointments: sampleAppointments, // Injecting sample data for design verification
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
        updateAppointmentStatusInState: (state, action) => {
            const { id, status } = action.payload;
            const index = state.appointments.findIndex(app => app._id === id);
            if (index !== -1) {
                state.appointments[index].status = status;
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
    updateAppointmentStatusInState, 
    removeAppointmentFromState 
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
