import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

export const BASE_URL = "http://localhost:4000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper: Header set karne ke liye (Axios v1+ compatible)
const setAuthHeader = (config: InternalAxiosRequestConfig, token: string) => {
  config.headers.Authorization = `Bearer ${token}`;
  if (typeof config.headers.set === "function") {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
};

// Request Interceptor: Har request mein valid Bearer token lagayega
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token && token !== "undefined" && token !== "null") {
      setAuthHeader(config, token);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Concurrent 401 requests ko queue karne ke liye
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: 401 aane par /auth/refresh-token se silent token refresh karega
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Login ya Refresh endpoint ke errors ko directly return karein
    if (
      !originalRequest ||
      originalRequest.url?.includes("/admin/loginadmin") ||
      originalRequest.url?.includes("/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    // Sirf 401 Unauthorized par aur ek hi baar retry karein
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem("refreshToken");

      // Agar refreshToken hi nahi hai, to session clear karke signin par bhejein
      if (
        !refreshToken ||
        refreshToken === "undefined" ||
        refreshToken === "null"
      ) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("isAuthenticated");
        if (window.location.pathname !== "/signin") {
          window.location.href = "/signin";
        }
        return Promise.reject(error);
      }

      // Agar pehle se refresh call chal rahi hai, to baaki requests ko queue mein daalein
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            setAuthHeader(originalRequest, newToken);
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Plain axios se refresh call (taaki interceptor loop na bane)
        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const newAccessToken =
          res.data?.accessToken || res.data?.tokens?.accessToken;
        const newRefreshToken =
          res.data?.refreshToken || res.data?.tokens?.refreshToken;

        if (!newAccessToken) {
          throw new Error("No accessToken returned from refresh endpoint");
        }

        // Naye tokens save karein
        localStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Queued requests ko naye token se resolve karein
        processQueue(null, newAccessToken);

        // Original failed request ko naye token se retry karein
        setAuthHeader(originalRequest, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Sirf tabhi logout karein jab refresh token bhi expire/invalid (401/403) ho
        if (
          axios.isAxiosError(refreshError) &&
          (refreshError.response?.status === 401 ||
            refreshError.response?.status === 403)
        ) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("adminUser");
          localStorage.removeItem("isAuthenticated");
          if (window.location.pathname !== "/signin") {
            window.location.href = "/signin";
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;