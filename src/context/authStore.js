// frontend/src/context/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      
      // Register a new user
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', userData);
          const { user, token } = response.data.data;
          
          // Store the token in the API service
          api.setToken(token);
          
          set({ user, token, isLoading: false });
          return user;
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Registration failed';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
      
      // Login a user
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', credentials);
          const { user, token } = response.data.data;
          
          // Store the token in the API service
          api.setToken(token);
          
          set({ user, token, isLoading: false });
          return user;
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
      
      // Logout a user
      logout: () => {
        // Clear the token from the API service
        api.clearToken();
        
        set({ user: null, token: null });
      },
      
      // Check if user is authenticated (token is valid)
      checkAuth: async () => {
        const { token } = get();
        
        if (!token) return false;
        
        try {
          // Check if token is expired
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            // Token is expired, logout
            get().logout();
            return false;
          }
          
          // Set the token in the API service
          api.setToken(token);
          
          // Get user profile
          const response = await api.get('/auth/me');
          const user = response.data.data.user;
          
          set({ user });
          return true;
        } catch (error) {
          // Token is invalid, logout
          get().logout();
          return false;
        }
      },
      
      // Update user profile
      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.put('/auth/profile', userData);
          const updatedUser = response.data.data.user;
          
          set({ user: updatedUser, isLoading: false });
          return updatedUser;
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Failed to update profile';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      }
    }),
    {
      name: 'triddle-auth', // localStorage key
      partialize: (state) => ({ token: state.token }), // Only persist the token
    }
  )
);