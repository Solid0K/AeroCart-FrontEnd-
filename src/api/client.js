import axios from "axios";

// In dev, requests hit the Vite proxy (see vite.config.js) which forwards
// to the Spring Boot server on :8080. In production, set VITE_API_BASE_URL.
const baseURL = import.meta.env.VITE_API_BASE_URL || "";

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("aerocart_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("aerocart_token");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
