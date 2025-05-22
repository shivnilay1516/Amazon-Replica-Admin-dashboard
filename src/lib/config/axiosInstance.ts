// // src/lib/axiosInstance.ts
// import axios from 'axios';

// // Create the instance
// const axiosInstance: any = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://0a35-103-206-131-194.ngrok-free.app',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor
// axiosInstance.interceptors.request.use(
//   (config: any) => {
//     const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error: any) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// axiosInstance.interceptors.response.use(
//   (response: any) => response,
//   (error: any) => {
//     if (error.response?.status === 401) {
//       console.warn('Unauthorized, redirect to login or refresh token');
//       // Optional: logout or redirect
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;





import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://0a35-103-206-131-194.ngrok-free.app',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
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
