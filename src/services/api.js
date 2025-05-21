// frontend/src/services/api.js
import axios from 'axios';

// Create axios instance with environment variable support
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token storage - more secure than storing on the API instance
let authToken = null;

// Token management
api.setToken = (token) => {
  authToken = token;
  // Store in localStorage for persistence across page refreshes
  localStorage.setItem('triddle-token', token);
};

api.clearToken = () => {
  authToken = null;
  localStorage.removeItem('triddle-token');
};

// Initialize from localStorage if token exists
const savedToken = localStorage.getItem('triddle-token');
if (savedToken) {
  authToken = savedToken;
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Add token to authorization header if available
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🔶 API Request: ${config.method.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.status} ${response.config.method.toUpperCase()} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Unauthorized - token expired or invalid
      if (error.response.status === 401) {
        console.warn('Authentication token expired or invalid');
        // Only clear token if it exists (avoid infinite loops)
        if (authToken) {
          api.clearToken();
          // Reload page to force login if not on auth page
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
            window.location.href = '/login';
          }
        }
      }
      
      // Server error
      if (error.response.status >= 500) {
        console.error('Server error:', error.response?.data || error.message);
      }
      
      // Log all API errors in development
      if (import.meta.env.DEV) {
        console.error(
          `🔴 API Error: ${error.response.status} ${error.config?.method?.toUpperCase() || 'UNKNOWN'} ${error.config?.url || 'UNKNOWN'}`,
          error.response?.data
        );
      }
    } else if (error.request) {
      // Network error - request made but no response
      console.error('Network error - no response received', error.request);
      
      if (import.meta.env.DEV) {
        console.error('🔴 Network Error: No response received from server');
      }
    } else {
      // Request setup error
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Get response count for a form
 * @param {string} formId - ID of the form
 * @returns {Promise<number>} - Number of responses
 */
api.getFormResponseCount = async (formId) => {
  try {
    // Temporarily return 0 to avoid 404 errors until the backend endpoint is implemented
    // When the backend endpoint is ready, uncomment and update the code below:
    /*
    const response = await api.get(`/forms/${formId}/responses`);
    // Assuming response data structure has a data array of responses
    return response.data.data.length;
    */
    
    // For now, return 0 to avoid errors
    if (import.meta.env.DEV) {
      console.log(`ℹ️ Form response count for ${formId}: Using stub implementation (returning 0)`);
    }
    return 0;
  } catch (error) {
    console.error('Error getting form response count:', error);
    return 0;
  }
};

export default api;