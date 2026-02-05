import axios from 'axios';
import { getApiErrorAsync } from './api-error';

/**
 * API Setup
 * Configures axios defaults for all API calls
 * This affects the generated API client which uses axios.default
 */

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Set base URL for all axios requests
axios.defaults.baseURL = API_URL;

// Set default headers
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Request interceptor to add auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Attach parsed ApiError (if available) so callers can branch on status/code.
    // This works even when generated clients use `responseType: 'blob'`.
    const apiError = await getApiErrorAsync(error);
    if (apiError) {
      (error as any).apiError = apiError;
    }

    return Promise.reject(error);
  }
);