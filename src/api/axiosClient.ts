import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Create a configured axios instance
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8000/api'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token
axiosClient.interceptors.request.use(
  (config) => {
    const operatorToken = useAuthStore.getState().token;
    const citizenToken = sessionStorage.getItem('citizen_token')
    // Prefer citizen token if we are hitting a citizen route or operator token isn't present
    const token = (config.url?.includes('/citizen') && citizenToken) ? citizenToken : (operatorToken || citizenToken);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401s (token expiration)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Check if we are in the citizen portal
      const isCitizenApp = window.location.pathname.startsWith('/citizen');

      if (isCitizenApp) {
        sessionStorage.removeItem('citizen_token');
        sessionStorage.removeItem('citizen_plate');
        window.location.href = '/citizen';
      } else {
        useAuthStore.getState().logout();
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
