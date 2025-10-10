import axios from "axios";
import axiosRetry from "axios-retry";
import { toastMessage } from "../components/toastMessage";
import { loaderRef } from "../contexts/LoaderRef";

let logoutHandler = null;

export const setLogoutHandler = (fn) => {
  logoutHandler = fn;
};

// Create an Axios instance
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Apply retry logic to Axios instance
axiosRetry(apiClient, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

let activeRequests = 0;
const showLoader = () => loaderRef.show();
const hideLoader = () => loaderRef.hide();

// Add a request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    activeRequests++;
    showLoader();
    if (config.authorized) {
      const token = config.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error("error", error);
    // Handle request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    activeRequests--;
    if (activeRequests === 0) hideLoader();
    return response;
  },
  async (err) => {
    activeRequests--;
    if (activeRequests === 0) hideLoader();

    const error = {
      url: err.config?.url,
      data: err.config?.data,
      headers: err.config?.headers,
      method: err.config?.method,
      code: err.response?.status || 404,
      message:
        err.response?.data?.message || err.response?.data?.msg || err.message,
    };

    if ([401, 403].includes(error.code) && logoutHandler) {
      logoutHandler();
    }

    if (error.code !== 404) {
      toastMessage({
        type: "error",
        text1: error.message,
        duration: 2000,
      });
    }

    return Promise.reject(error);
  }
);

const API = {
  get: (url, params, token) =>
    apiClient.get(url, { params, authorized: true, token }),
  post: (url, data, token, isMultipart = false) =>
    apiClient.post(url, data, {
      authorized: true,
      token,
      headers: isMultipart
        ? {
            "Content-Type": "multipart/form-data",
          }
        : {},
    }),
  put: (url, data, token) =>
    apiClient.put(url, data, { authorized: true, token }),
  patch: (url, data, token, isMultipart = false) =>
    apiClient.patch(url, data, {
      authorized: true,
      token,
      headers: isMultipart
        ? {
            "Content-Type": "multipart/form-data",
          }
        : {},
    }),
  delete: (url, token) => apiClient.delete(url, { authorized: true, token }),
};

export { apiClient, API };
