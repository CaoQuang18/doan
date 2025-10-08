// src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance with default config
const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Request error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor with error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.response?.data || error.message);
    }
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear auth and redirect to login
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      throw new Error(data.message || `Request failed with status ${status}`);
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(error.message || 'Request failed');
    }
  }
);

// API Endpoints using axios
export const apiEndpoints = {
  // Houses
  houses: {
    getAll: () => API.get('/houses').then(res => res.data),
    getById: (id) => API.get(`/houses/${id}`).then(res => res.data),
    create: (data) => API.post('/houses', data).then(res => res.data),
    update: (id, data) => API.put(`/houses/${id}`, data).then(res => res.data),
    delete: (id) => API.delete(`/houses/${id}`).then(res => res.data),
    deleteMultiple: (ids) => API.post('/houses/delete-multiple', { ids }).then(res => res.data),
  },
  // Users
  users: {
    getAll: () => API.get('/users').then(res => res.data),
    getById: (id) => API.get(`/users/${id}`).then(res => res.data),
    update: (id, data) => API.put(`/users/${id}`, data).then(res => res.data),
    changePassword: (id, data) => API.put(`/users/${id}/change-password`, data).then(res => res.data),
  },
  // Bookings
  bookings: {
    getAll: () => API.get('/bookings').then(res => res.data),
    create: (data) => API.post('/bookings', data).then(res => res.data),
    update: (id, data) => API.put(`/bookings/${id}`, data).then(res => res.data),
  },
  // Auth
  auth: {
    login: (data) => API.post('/auth/login', data).then(res => res.data),
    register: (data) => API.post('/auth/register', data).then(res => res.data),
  },
};

export default API;
