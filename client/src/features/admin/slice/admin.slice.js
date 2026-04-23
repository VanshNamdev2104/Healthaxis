import { createSlice } from "@reduxjs/toolkit";

export const adminSlice = createSlice({
    name: "admin",
    initialState: {
        loading: false,
        error: null,
        // Dashboard stats
        stats: {
            totalUsers: 0,
            totalHospitals: 0,
            totalAppointments: 0,
            totalDoctors: 0,
            totalDiseases: 0,
            totalMedicines: 0,
            revenue: 0,
            growth: 0,
        },
        // Users
        users: [],
        usersPagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
        },
        // Hospitals
        hospitals: [],
        hospitalsPagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
        },
        // Doctors
        doctors: [],
        doctorsPagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
        },
        // Activity feed
        activityFeed: [],
        // Analytics
        analytics: {
            revenue: [],
            growth: [],
            appointments: [],
        },
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        // Dashboard stats
        setStats: (state, action) => {
            state.stats = action.payload;
        },
        // Users
        setUsers: (state, action) => {
            state.users = action.payload.data || action.payload;
            state.usersPagination = action.payload.pagination || {
                page: 1,
                limit: 10,
                total: action.payload.length || 0,
                totalPages: 1,
            };
        },
        addUser: (state, action) => {
            state.users.unshift(action.payload);
            state.usersPagination.total += 1;
        },
        updateUser: (state, action) => {
            const index = state.users.findIndex(u => u._id === action.payload._id);
            if (index !== -1) {
                state.users[index] = action.payload;
            }
        },
        removeUser: (state, action) => {
            state.users = state.users.filter(u => u._id !== action.payload);
            state.usersPagination.total -= 1;
        },
        updateUserStatus: (state, action) => {
            const { userId, status } = action.payload;
            const index = state.users.findIndex(u => u._id === userId);
            if (index !== -1) {
                state.users[index].status = status;
            }
        },
        // Hospitals
        setHospitals: (state, action) => {
            state.hospitals = action.payload.data || action.payload;
            state.hospitalsPagination = action.payload.pagination || {
                page: 1,
                limit: 10,
                total: action.payload.length || 0,
                totalPages: 1,
            };
        },
        updateHospitalStatus: (state, action) => {
            const { hospitalId, status } = action.payload;
            const index = state.hospitals.findIndex(h => h._id === hospitalId);
            if (index !== -1) {
                state.hospitals[index].status = status;
            }
        },
        removeHospital: (state, action) => {
            state.hospitals = state.hospitals.filter(h => h._id !== action.payload);
            state.hospitalsPagination.total -= 1;
        },
        // Doctors
        setDoctors: (state, action) => {
            state.doctors = action.payload.data || action.payload;
            state.doctorsPagination = action.payload.pagination || {
                page: 1,
                limit: 10,
                total: action.payload.length || 0,
                totalPages: 1,
            };
        },
        updateDoctorStatus: (state, action) => {
            const { doctorId, status } = action.payload;
            const index = state.doctors.findIndex(d => d._id === doctorId);
            if (index !== -1) {
                state.doctors[index].status = status;
            }
        },
        removeDoctor: (state, action) => {
            state.doctors = state.doctors.filter(d => d._id !== action.payload);
            state.doctorsPagination.total -= 1;
        },
        // Activity feed
        setActivityFeed: (state, action) => {
            state.activityFeed = action.payload;
        },
        addActivity: (state, action) => {
            state.activityFeed.unshift(action.payload);
        },
        // Analytics
        setAnalytics: (state, action) => {
            state.analytics = { ...state.analytics, ...action.payload };
        },
    },
});

export const {
    setLoading,
    setError,
    clearError,
    setStats,
    setUsers,
    addUser,
    updateUser,
    removeUser,
    updateUserStatus,
    setHospitals,
    updateHospitalStatus,
    removeHospital,
    setDoctors,
    updateDoctorStatus,
    removeDoctor,
    setActivityFeed,
    addActivity,
    setAnalytics,
} = adminSlice.actions;

export default adminSlice.reducer;
