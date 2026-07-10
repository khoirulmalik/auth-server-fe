import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@features/auth/store/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://10.121.26.50:3020/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ─── Request interceptor — attach token ──────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor — handle 401 refresh + systemic toasts ─────────
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // ── 401 → try refresh once, then retry original request ──
    if (status === 401 && !originalRequest._retry) {
      // Skip refresh for the refresh endpoint itself
      if (originalRequest.url?.includes("/auth/refresh")) {
        useAuthStore.getState().clearAuth();
        toast.error("Your session has expired. Please log in again.");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // Skip refresh for login (so wrong-password 401 reaches the caller)
      if (originalRequest.url?.includes("/auth/login")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // If a refresh is already in flight, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            api(originalRequest).then(resolve).catch(reject);
          });
        });
      }

      isRefreshing = true;
      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        isRefreshing = false;
        useAuthStore.getState().clearAuth();
        toast.error("Your session has expired. Please log in again.");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await api.post("/auth/refresh", {
          refresh_token: refreshToken,
        });

        useAuthStore.getState().setAccessToken(data.access_token);
        onRefreshed(data.access_token);

        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        toast.error("Your session has expired. Please log in again.");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ── 429 → systemic, always show toast ──
    if (status === 429) {
      toast.error("Too many requests. Please slow down.");
    }

    // ── 500+ → systemic, always show toast ──
    if (status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    // ── Network error (no response) ──
    if (!error.response) {
      toast.error("Cannot connect to server. Check your connection.");
    }

    return Promise.reject(error);
  },
);

export default api;