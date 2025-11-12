import axios from 'axios';
import BASE_URL from '../constant';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// User API functions
export const userAPI = {
  // Get user profile
  getUserProfile: (userId) => api.get(`/userProfile/${userId}`),
  
  // Update user profile
  updateUserProfile: (userId, userData) => api.put(`/updateProfile/${userId}`, userData),
  
  // Delete user profile
  deleteUserProfile: (userId) => api.delete(`/deleteProfile/${userId}`),
  
  // Get all users
  getAllUsers: () => api.get('/allUsers'),
  
  // Auth endpoints
  login: (credentials) => api.post('/login', credentials),
  signup: (userData) => api.post('/signup', userData),
};

// Repository API functions
export const repoAPI = {
  // Get all repositories
  getAllRepositories: () => api.get('/repo/all'),
  
  // Get repository by ID
  getRepositoryById: (repoId) => api.get(`/repo/${repoId}`),
  
  // Get repository by name
  getRepositoryByName: (name) => api.get(`/repo/name/${name}`),
  
  // Get repositories for current user
  getUserRepositories: (userId) => api.get(`/repo/user/${userId}`),
  
  // Create new repository
  createRepository: (repoData) => api.post('/repo/create', repoData),
  
  // Update repository
  updateRepository: (repoId, updateData) => api.put(`/repo/update/${repoId}`, updateData),
  
  // Delete repository
  deleteRepository: (repoId) => api.delete(`/repo/delete/${repoId}`),
  
  // Toggle repository visibility
  toggleVisibility: (repoId) => api.patch(`/repo/toggle/${repoId}`),
};

export default api;
