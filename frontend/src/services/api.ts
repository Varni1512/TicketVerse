import axios from 'axios';

// Create an Axios instance with base URL pointing to the Spring Boot backend
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api', // Backend URL
});

// Add a request interceptor to attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    // You can store and retrieve the token from localStorage or your Zustand store
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

export default api;
