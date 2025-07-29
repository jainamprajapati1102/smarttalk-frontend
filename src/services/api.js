// services/api.js
import axios from "axios";

const  api = axios.create({
  baseURL: "http://localhost:5100", // Your backend base URL
    headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Only if backend uses cookies/sessions
});

export default api;
