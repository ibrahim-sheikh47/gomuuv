import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URL } from "./routes";
import axiosRetry from "axios-retry";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Apply retry logic to Axios instance
axiosRetry(apiClient, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

// Add a request interceptor
apiClient.interceptors.request.use(
  async (config) => {
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
    // Return response data directly
    return response;
  },
  async (error) => {
    // Handle errors globally
    let errorMessage = "Something went wrong, please try again later.";

    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        errorMessage = "Unauthorized! Please log in again.";
        // Optionally handle token refresh here
        // Example: await refreshAuthToken();
      } else if (status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (data && data.message) {
        errorMessage = data.message;
      }
    } else if (error.message === "Network Error") {
      errorMessage = "Please check your internet connection.";
    }

    // Optionally log errors
    // logErrorToService(error);

    return Promise.reject(errorMessage); // Throw error for individual calls to handle
  }
);

const API = {
  get: (url, params, token) =>
    apiClient.get(url, { params, authorized: true, token }),
  post: (url, data, token) =>
    apiClient.post(url, data, { authorized: true, token }),
  put: (url, data, token) =>
    apiClient.put(url, data, { authorized: true, token }),
  patch: (url, data, token) =>
    apiClient.patch(url, data, { authorized: true, token }),
  delete: (url, token) => apiClient.delete(url, { authorized: true, token }),
};

export { apiClient, API };
