import api from "./api";

export const attendanceService = {
  getAttendance: async (classId, dateRange) => {
    const response = await api.get(`/class/${classId}/attendance`, {
      params: dateRange,
    });
    return response.data;
  },

  exportAttendance: async (classId, format, dateRange) => {
    const response = await api.get(`/class/${classId}/attendance/export`, {
      params: { format, ...dateRange },
      responseType: "blob",
    });
    return response.data;
  },

  recordAttendance: async (classId, userId, photoUrl) => {
    const response = await api.post(`/class/${classId}/attendance`, {
      userId,
      photoUrl,
    });
    return response.data;
  },

  uploadPhoto: async (photoFile) => {
    const formData = new FormData();
    formData.append("image", photoFile);

    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default attendanceService;