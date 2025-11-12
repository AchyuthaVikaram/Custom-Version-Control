import axios from "axios";
import BASE_URL from "./constant";

// Axios instance with base URL and auth header injector
const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // backend accepts raw token or Bearer token depending on middleware
    config.headers["Authorization"] = token; // raw token
  }
  return config;
});

export default api;
