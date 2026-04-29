import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://healthaxis-14r9.onrender.com";

const api = axios.create({
    baseURL: `${BASE_URL}/api`,
    withCredentials: true
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== "/user/login" &&
            originalRequest.url !== "/user/refresh-token"
        ) {
            originalRequest._retry = true;
            try {
                // ✅ Fix — Render URL use karo
                await axios.post(
                    `${BASE_URL}/api/user/refresh-token`,
                    {},
                    { withCredentials: true }
                );
                
                return api(originalRequest);
            } catch (refreshError) {
                if (window.location.pathname !== '/') {
                    window.location.href = "/";
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export async function login({ email, number, password }) {
    const payload = {
        password,
        ...(email ? { email } : { number })
    };
    const response = await api.post("/user/login", payload);
    return response.data;
}

export async function register({ name, email, number, password }) {
    const response = await api.post("/user/register", { name, email, number, password });
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
    const response = await api.post("/user/logout");
    return response.data;
}

export async function getCurrentUser() {
    const response = await api.get("/user/current-user");
    return response.data;
}

export async function updateProfile(formData) {
    const response = await api.put("/user/profile", formData);
    return response.data;
}

export async function changePassword({ currentPassword, newPassword }) {
    const response = await api.put("/user/change-password", { currentPassword, newPassword });
    return response.data;
}

export async function forgotPassword(email) {
    const response = await api.post("/user/forgot-password", { email });
    return response.data;
}

export async function resetPassword({ resetToken, password }) {
    const response = await api.post("/user/reset-password", { resetToken, password });
    return response.data;
}