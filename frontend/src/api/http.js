import axios from "axios";

// Use environment variable or fallback to localhost
const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

console.log("API Base URL:", API_BASE); // For debugging

const http = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default http;
