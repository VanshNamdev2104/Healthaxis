import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading, setError, logout as logoutAction, clearError } from "../slice/auth.slice.js";
import { login, register, logout as logoutApi, getCurrentUser, updateProfile, changePassword, googleAuth, forgotPassword as forgotPasswordApi, resetPassword as resetPasswordApi } from "../services/auth.api.js";

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, error, isAuthenticated } = useSelector((state) => state.auth);

    async function handleLogin(formData) {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await login(formData);
            dispatch(setUser(response.data.user));
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Login failed"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleRegister(formData) {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await register(formData);
            // Set user in Redux after successful registration
            dispatch(setUser(response.data.user));
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registration failed"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    function handleGoogleAuth() {
        googleAuth();
    }

    async function handleLogout() {
        try {
            dispatch(setLoading(true));
            await logoutApi();
            dispatch(logoutAction());
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Logout failed"));
            // Even if API fails, clear local state
            dispatch(logoutAction());
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetCurrentUser() {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await getCurrentUser();
            dispatch(setUser(response.data.user));
            return response;
        } catch (error) {
            // If getting current user fails (e.g. 401), we just clear the user state.
            dispatch(logoutAction());
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleUpdateProfile(formData) {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await updateProfile(formData);
            dispatch(setUser(response));
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to update profile"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleChangePassword(formData) {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await changePassword(formData);
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to change password"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleForgotPassword(email) {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await forgotPasswordApi(email);
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to send reset email"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleResetPassword(formData) {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await resetPasswordApi(formData);
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to reset password"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        user,
        loading,
        error,
        isAuthenticated,
        handleLogin,
        handleRegister,
        handleGoogleAuth,
        handleLogout,
        handleGetCurrentUser,
        handleUpdateProfile,
        handleChangePassword,
        handleForgotPassword,
        handleResetPassword,
        clearError: () => dispatch(clearError())
    };
};

