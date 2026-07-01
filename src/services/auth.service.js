import api from "./api";

export const authService = {
  login: async (credentials) => {
    const response = await api.post("/auth/admin/login", credentials);
    if (response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/admin/me");
    return response.data;
  },
};