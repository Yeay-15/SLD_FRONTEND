import axios from "axios";

const api = axios.create({
  // Tambahkan /api/v1 di ujungnya (tanpa garis miring di akhir)
  baseURL: "https://sdlbackend-production.up.railway.app/api/v1",
});

// Otomatis menyisipkan token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;