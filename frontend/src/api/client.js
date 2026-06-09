import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST interceptor: attach access token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Track if we're currently refreshing, so we don't trigger multiple refreshes
// for parallel requests that all fail at once.
let isRefreshing = false;
let pendingRequests = [];

// Helper: notify all pending requests with the new token (or reject them)
function processQueue(error, newToken = null) {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(newToken);
  });
  pendingRequests = [];
}

// RESPONSE interceptor: handle 401 by trying to refresh, then retry
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Not a 401? Just pass it through.
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Already retried once? Don't loop forever.
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't try to refresh on the login or refresh endpoint itself
    if (
      originalRequest.url?.includes('/auth/login/') ||
      originalRequest.url?.includes('/auth/refresh/')
    ) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      // No refresh token = user must log in again
      logoutAndRedirect();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // If a refresh is already in flight, wait for it
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      // Use a plain axios call (no interceptors) to avoid recursion
      const res = await axios.post(
        'http://127.0.0.1:8000/api/auth/refresh/',
        { refresh: refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const newAccessToken = res.data.access;
      localStorage.setItem('access_token', newAccessToken);

      // Notify any waiting requests
      processQueue(null, newAccessToken);

      // Retry the original request with the new token
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh failed — refresh token also expired
      processQueue(refreshError, null);
      logoutAndRedirect();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

function logoutAndRedirect() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  // Use window.location instead of useNavigate (we're not inside a component)
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

export default apiClient;