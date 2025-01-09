// src/api/axiosClient.js

import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // <-- prefiks /api
});

// Interceptor dołączający token JWT (o ile jest w localStorage)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
