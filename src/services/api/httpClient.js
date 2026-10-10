import axios from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens, isTokenExpired } from '../../utils/tokenUtils';

// Asosiy Axios instansiyasi
export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Access token qo'shish
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401 da refresh token bilan bir marta yangilash
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken || isTokenExpired(refreshToken)) {
        clearTokens();
        window.dispatchEvent(new CustomEvent('makler:session_expired'));
        return Promise.reject(error);
      }

      try {
        // Refresh token mock so'rovi
        const res = await axios.post('/api/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: newRefresh } = res.data.data;
        saveTokens({ accessToken, refreshToken: newRefresh });
        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearTokens();
        window.dispatchEvent(new CustomEvent('makler:session_expired'));
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Mock REST API simulyatori: real REST API kabi { data, error, meta } qaytaradi
 * @template T
 * @param {() => Promise<T> | T} fn
 * @param {number} latencyMs
 * @returns {Promise<{ data: T|null, error: Object|null, meta: Object }>}
 */
export const mockApiResponse = async (fn, latencyMs = 450) => {
  await new Promise((res) => setTimeout(res, latencyMs));
  try {
    const result = await fn();
    return {
      data: result,
      error: null,
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v1'
      }
    };
  } catch (err) {
    const errorCode = err.code || 'INTERNAL_ERROR';
    const statusCode = err.status || 400;
    return {
      data: null,
      error: {
        code: errorCode,
        status: statusCode,
        message: err.message || 'Xatolik yuz berdi',
        details: err.details || null
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v1'
      }
    };
  }
};
