import axios from 'axios';
import { env } from '@/lib/env';
import { tokenStore } from '@/auth/tokenStore';

export const client = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL + '/api/v1',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
client.interceptors.request.use(
  (config) => {
    const token = tokenStore.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we're not on the login page, clear tokens and redirect or logout
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        tokenStore.clearAll();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
// Helper function for fetch-like calls using the axios client
export const fetchApi = async (url: string, options: any = {}) => {
  const { method = 'GET', body, ...rest } = options;
  
  const response = await client({
    url,
    method,
    data: body,
    ...rest,
  });

  return response.data?.data || response.data;
};
