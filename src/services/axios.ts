// Import axios for HTTP requests and utility functions for session management
import axios from 'axios';
import { refreshSession } from './auth';
import { clearToken } from '../lib/tokenManager';

// Base API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create an axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enable HttpOnly Cookies for secure authentication
});

// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response, // Pass successful responses as-is
  async (error) => {
    console.error('Axios error:', error); // Log the error for debugging
    if (error.response?.status === 401) {
      // Handle unauthorized errors by refreshing the session
      try {
        await refreshSession();
        return axiosInstance.request(error.config); // Retry the original request
      } catch (refreshError) {
        console.error('Failed to refresh session during Axios retry:', refreshError);
        clearToken(); // Clear the token and redirect to login
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error); // Reject other errors
  }
);

export default axiosInstance;
