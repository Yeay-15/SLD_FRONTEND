import api from "./api";

export const classService = {
  getAllClasses: async () => {
    const response = await api.get("/class");
    return response.data;
  },

  getClassById: async (id) => {
    const response = await api.get(`/class/${id}`);
    return response.data;
  },

  createClass: async (classData) => {
    const response = await api.post("/class", classData);
    return response.data;
  },

  updateClass: async (id, classData) => {
    const response = await api.put(`/class/${id}`, classData);
    return response.data;
  },

  deleteClass: async (id) => {
    const response = await api.delete(`/class/${id}`);
    return response.data;
  },

  getSchedule: async () => {
    const response = await api.get("/class/schedule");
    return response.data;
  },
};