import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://healthaxis-14r9.onrender.com";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally and perform token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized by trying to refresh tokens
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/api/user/login" &&
      originalRequest.url !== "/api/user/refresh-token"
    ) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${API_URL}/api/user/refresh-token`,
          {},
          { withCredentials: true }
        );
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/auth" && window.location.pathname !== "/") {
          window.location.href = "/auth";
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access Forbidden");
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error("Server Error: Please try again later");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
