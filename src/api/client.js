import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor: Attaches token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('edugrade_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Catches global errors like token expiration
apiClient.interceptors.response.use(
  (response) => response, // If successful, just pass it through
  (error) => {
    // Check if the error is a 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Token is expired or invalid. Clean up and force logout.
      localStorage.removeItem('edugrade_token');
      
      // Prevent infinite loops if the login page itself throws a 401
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'; 
      }
    }
    
    // Always reject the error so individual components can still show specific toasts if needed
    return Promise.reject(error);
  }
);

export default apiClient;