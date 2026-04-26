import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true
});

// Dashboard Stats
export async function getDashboardStats() {
    try {
        const response = await api.get("/admin/dashboard/stats");
        return response.data;
    } catch (error) {
        throw error || "Failed to fetch dashboard stats";
    }
}

// User Management
export async function getAllUsers({ page = 1, limit = 10, search = "", role = "", status = "" }) {
    try {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (search) params.append("search", search);
        if (role) params.append("role", role);
        if (status) params.append("status", status);
        
        const response = await api.get(`/admin/users?${params.toString()}`);
        return response.data;
    } catch (error) {
        throw error || "Failed to fetch users";
    }
}

export async function getUserById({ userId }) {
    try {
        const response = await api.get(`/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error || "Failed to fetch user";
    }
}

export async function updateUser({ userId, name, email, number, role }) {
    try {
        const response = await api.put(`/admin/users/${userId}`, { name, email, number, role });
        return response.data;
    } catch (error) {
        throw error || "Failed to update user";
    }
}

export async function suspendUser({ userId }) {
    try {
        const response = await api.patch(`/admin/users/${userId}/suspend`);
        return response.data;
    } catch (error) {
        throw error || "Failed to suspend user";
    }
}

export async function deleteUser({ userId }) {
    try {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error || "Failed to delete user";
    }
}

// Hospital Management
export async function getAllHospitals({ page = 1, limit = 10, search = "", status = "" }) {
    try {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (search) params.append("search", search);
        if (status) params.append("status", status);
        
        const response = await api.get(`/admin/hospitals?${params.toString()}`);
        return response.data;
    } catch (error) {
        throw error || "Failed to fetch hospitals";
    }
}

export async function approveHospital({ hospitalId }) {
    try {
        const response = await api.patch(`/admin/hospitals/${hospitalId}/approve`);
        return response.data;
    } catch (error) {
        throw error || "Failed to approve hospital";
    }
}

export async function rejectHospital({ hospitalId }) {
    try {
        const response = await api.patch(`/admin/hospitals/${hospitalId}/reject`);
        return response.data;
    } catch (error) {
        throw error || "Failed to reject hospital";
    }
}

export async function deleteHospital({ hospitalId }) {
    try {
        const response = await api.delete(`/admin/hospitals/${hospitalId}`);
        return response.data;
    } catch (error) {
        throw error || "Failed to delete hospital";
    }
}

// Doctor Management
export async function getAllDoctors({ page = 1, limit = 10, search = "", specialization = "", status = "" }) {
    try {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (search) params.append("search", search);
        if (specialization) params.append("specialization", specialization);
        if (status) params.append("status", status);
        
        const response = await api.get(`/admin/doctors?${params.toString()}`);
        return response.data;
    } catch (error) {
        throw error || "Failed to fetch doctors";
    }
}

export async function approveDoctor({ doctorId }) {
    try {
        const response = await api.patch(`/admin/doctors/${doctorId}/approve`);
        return response.data;
    } catch (error) {
        throw error || "Failed to approve doctor";
    }
}

export async function deleteDoctor({ doctorId }) {
    try {
        const response = await api.delete(`/admin/doctors/${doctorId}`);
        return response.data;
    } catch (error) {
        throw error || "Failed to delete doctor";
    }
}

// Activity Feed
export async function getActivityFeed({ limit = 20 }) {
    try {
        const response = await api.get(`/admin/activity?limit=${limit}`);
        return response.data;
    } catch (error) {
        throw error || "Failed to fetch activity feed";
    }
}

// Analytics
export async function getRevenueAnalytics({ period = "monthly" }) {
    try {
        const response = await api.get(`/admin/analytics/revenue?period=${period}`);
        return response.data;
    } catch (error) {
        throw error || "Failed to fetch revenue analytics";
    }
}

export async function getGrowthAnalytics({ period = "monthly" }) {
    try {
        const response = await api.get(`/admin/analytics/growth?period=${period}`);
        return response.data;
    } catch (error) {
        throw error || "Failed to fetch growth analytics";
    }
}
