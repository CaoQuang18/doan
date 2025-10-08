// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  
  // User endpoints
  USERS: `${API_BASE_URL}/api/users`,
  USER_PROFILE: (id) => `${API_BASE_URL}/api/users/${id}`,
  UPDATE_PROFILE: (id) => `${API_BASE_URL}/api/users/${id}`,
  
  // House endpoints
  HOUSES: `${API_BASE_URL}/api/houses`,
  HOUSE_DETAIL: (id) => `${API_BASE_URL}/api/houses/${id}`,
  
  // Booking endpoints
  BOOKINGS: `${API_BASE_URL}/api/bookings`,
  BOOKING_DETAIL: (id) => `${API_BASE_URL}/api/bookings/${id}`,
  USER_BOOKINGS: (userId) => `${API_BASE_URL}/api/bookings/user/${userId}`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/api/health`,
  TEST: `${API_BASE_URL}/api/test`,
};

export default API_BASE_URL;
