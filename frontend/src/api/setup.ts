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
    const status = error.response?.status;
    const config = error.config ?? {};

    // Attach parsed ApiError (if available) so callers can branch on status/code.
    // This works even when generated clients use `responseType: 'blob'`.
    const apiError = await getApiErrorAsync(error);
    if (apiError) {
      (error as any).apiError = apiError;
    }

    // For 401 responses, only auto-logout/redirect when we actually had a token,
    // the failing call was NOT the login/register endpoints, and we're not already
    // on the login/register pages. This prevents a full reload hiding inline errors
    // on the auth screens.
    if (status === 401) {
      const hasToken = !!localStorage.getItem('token');
      const url: string = typeof config.url === 'string' ? config.url : '';
      const isAuthEndpoint =
        url.includes('/api/auth/login') || url.includes('/api/auth/register');
      const pathname = window.location.pathname || '';
      const isAuthPage =
        pathname.startsWith('/login') || pathname.startsWith('/register');

      if (hasToken && !isAuthEndpoint && !isAuthPage) {
        // Token expired or invalid - clear auth and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);