import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://0737-103-206-131-194.ngrok-free.app',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
   },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized');
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
