import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any auth tokens or headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error types
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - please check your internet connection');
      error.message = 'Request timeout - please try again';
    } else if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      if (status === 404) {
        error.message = 'Resource not found';
      } else if (status === 500) {
        error.message = 'Internal server error';
      } else if (status >= 400 && status < 500) {
        error.message = 'Client error occurred';
      } else if (status >= 500) {
        error.message = 'Server error occurred';
      }
    } else if (error.request) {
      // Network error
      console.error('Network error - no response received');
      error.message = 'Network error - please check your internet connection';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
