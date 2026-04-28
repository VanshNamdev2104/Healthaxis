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

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login (optional - can be handled by Redux)
      console.warn("Unauthorized: Redirecting to login");
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
