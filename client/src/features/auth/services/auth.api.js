import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true
});

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
        const response = await api.get("/user/me");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateProfile({ name, email, number }) {
    try {
        const response = await api.put("/user/profile", { name, email, number });
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
