import axios from "axios";

const api = axios.create({
  baseURL: "https://tikcoinbackend.onrender.com",
});

// Attach Bearer token from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
