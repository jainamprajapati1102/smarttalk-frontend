// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Only if backend uses cookies/sessions
});

export default api;
