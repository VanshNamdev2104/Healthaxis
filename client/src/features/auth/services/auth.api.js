import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401, we haven't retried yet, and it's not the login or refresh routes themselves
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== "/user/login" &&
            originalRequest.url !== "/user/refresh-token"
        ) {
            originalRequest._retry = true;
            try {
                // Make a call to refresh the token using the base axios to avoid infinite loops
                await axios.post("/api/user/refresh-token", {}, { withCredentials: true });
                
                // If the refresh is successful, retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If the refresh token has expired, just reject the promise. Let the application handle the unauthenticated state.
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
    try {
        const payload = {
            password,
            ...(email ? { email } : { number })
        };
        const response = await api.post("/user/login", payload);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function register({ name, email, number, password }) {
    try {
        const response = await api.post("/user/register", { name, email, number, password });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export function googleAuth() {
    // Google OAuth requires full page redirect, not an AJAX call
    window.location.href = "/api/auth/google";
}

export async function logout() {
    try {
        const response = await api.post("/user/logout");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getCurrentUser() {
    try {
        const response = await api.get("/user/current-user");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateProfile(formData) {
    try {
        const headers = {};
        // Only set content-type if it's FormData (file upload)
        if (formData instanceof FormData) {
            headers["Content-Type"] = "multipart/form-data";
        }
        const response = await api.put("/user/profile", formData, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function changePassword({ currentPassword, newPassword }) {
    try {
        const response = await api.put("/user/change-password", { currentPassword, newPassword });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function forgotPassword(email) {
    try {
        const response = await api.post("/user/forgot-password", { email });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function resetPassword({ resetToken, password }) {
    try {
        const response = await api.post("/user/reset-password", { resetToken, password });
        return response.data;
    } catch (error) {
        throw error;
    }
}
