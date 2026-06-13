import axiosInstance from "../../../lib/api/axiosConfig.js";

const BASE_URL = import.meta.env.VITE_API_URL || "https://healthaxis-14r9.onrender.com";

export async function login({ email, number, password }) {
    const payload = {
        password,
        ...(email ? { email } : { number })
    };
    const response = await axiosInstance.post("/api/user/login", payload);
    return response.data;
}

export async function register({ name, email, number, password }) {
    const response = await axiosInstance.post("/api/user/register", { name, email, number, password });
    return response.data;
}

export function googleAuth() {
    // Clear existing cookies before starting Google auth
    document.cookie = `accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    
    // Redirect to Google auth with prompt to select account
    window.location.href = `${BASE_URL}/api/auth/google?prompt=select_account`;
}

export async function logout() {
    const response = await axiosInstance.post("/api/user/logout");
    return response.data;
}

export async function getCurrentUser() {
    const response = await axiosInstance.get("/api/user/current-user");
    return response.data;
}

export async function updateProfile(formData) {
    const response = await axiosInstance.put("/api/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
}

export async function changePassword({ currentPassword, newPassword }) {
    const response = await axiosInstance.put("/api/user/change-password", { currentPassword, newPassword });
    return response.data;
}

export async function forgotPassword(email) {
    const response = await axiosInstance.post("/api/user/forgot-password", { email });
    return response.data;
}

export async function resetPassword({ resetToken, password }) {
    const response = await axiosInstance.post("/api/user/reset-password", { resetToken, password });
    return response.data;
}

export async function deleteAccount() {
    const response = await axiosInstance.delete("/api/user/account");
    return response.data;
}