import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
    setLoading,
    setError,
    clearError,
    setStats,
    setUsers,
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
    setAnalytics,
} from "../slice/admin.slice.js";
import {
    getDashboardStats,
    getAllUsers,
    getUserById,
    updateUser as updateUserApi,
    suspendUser,
    deleteUser as deleteUserApi,
    getAllHospitals,
    approveHospital,
    rejectHospital,
    deleteHospital as deleteHospitalApi,
    getAllDoctors,
    approveDoctor,
    deleteDoctor as deleteDoctorApi,
    getActivityFeed,
    getRevenueAnalytics,
    getGrowthAnalytics,
} from "../services/admin.api.js";

export const useAdmin = () => {
    const dispatch = useDispatch();
    const {
        loading,
        error,
        stats,
        users,
        usersPagination,
        hospitals,
        hospitalsPagination,
        doctors,
        doctorsPagination,
        activityFeed,
        analytics,
    } = useSelector((state) => state.admin);

    // Dashboard Stats
    const handleGetDashboardStats = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await getDashboardStats();
            dispatch(setStats(response.data));
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetch dashboard stats"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // User Management
    const handleGetAllUsers = useCallback(async (params) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await getAllUsers(params);
            dispatch(setUsers(response.data));
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetch users"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleGetUserById = useCallback(async (userId) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await getUserById({ userId });
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetch user"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleUpdateUser = useCallback(async (userId, userData) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await updateUserApi({ userId, ...userData });
            dispatch(updateUser(response.data));
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to update user"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleSuspendUser = useCallback(async (userId) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await suspendUser({ userId });
            dispatch(updateUserStatus({ userId, status: response.data?.status || "suspended" }));
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to suspend user"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleDeleteUser = useCallback(async (userId) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await deleteUserApi({ userId });
            dispatch(removeUser(userId));
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to delete user"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // Hospital Management
    const handleGetAllHospitals = useCallback(async (params) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await getAllHospitals(params);
            dispatch(setHospitals(response.data));
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetch hospitals"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleApproveHospital = useCallback(async (hospitalId) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await approveHospital({ hospitalId });
            dispatch(updateHospitalStatus({ hospitalId, status: "verified" }));
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to approve hospital"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleRejectHospital = useCallback(async (hospitalId) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await rejectHospital({ hospitalId });
            dispatch(updateHospitalStatus({ hospitalId, status: "rejected" }));
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to reject hospital"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleDeleteHospital = useCallback(async (hospitalId) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await deleteHospitalApi({ hospitalId });
            dispatch(removeHospital(hospitalId));
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to delete hospital"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // Doctor Management
    const handleGetAllDoctors = useCallback(async (params) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await getAllDoctors(params);
            dispatch(setDoctors(response.data));
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetch doctors"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleApproveDoctor = useCallback(async (doctorId) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await approveDoctor({ doctorId });
            dispatch(updateDoctorStatus({ doctorId, status: "verified" }));
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to approve doctor"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleDeleteDoctor = useCallback(async (doctorId) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await deleteDoctorApi({ doctorId });
            dispatch(removeDoctor(doctorId));
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to delete doctor"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // Activity Feed
    const handleGetActivityFeed = useCallback(async (limit) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await getActivityFeed({ limit });
            dispatch(setActivityFeed(response.data));
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetch activity feed"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // Analytics
    const handleGetRevenueAnalytics = useCallback(async (period) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await getRevenueAnalytics({ period });
            dispatch(setAnalytics({ revenue: response.data }));
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetch revenue analytics"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleGetGrowthAnalytics = useCallback(async (period) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await getGrowthAnalytics({ period });
            dispatch(setAnalytics({ growth: response.data }));
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetch growth analytics"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    return {
        loading,
        error,
        stats,
        users,
        usersPagination,
        hospitals,
        hospitalsPagination,
        doctors,
        doctorsPagination,
        activityFeed,
        analytics,
        handleGetDashboardStats,
        handleGetAllUsers,
        handleGetUserById,
        handleUpdateUser,
        handleSuspendUser,
        handleDeleteUser,
        handleGetAllHospitals,
        handleApproveHospital,
        handleRejectHospital,
        handleDeleteHospital,
        handleGetAllDoctors,
        handleApproveDoctor,
        handleDeleteDoctor,
        handleGetActivityFeed,
        handleGetRevenueAnalytics,
        handleGetGrowthAnalytics,
        clearError: () => dispatch(clearError()),
    };
};

